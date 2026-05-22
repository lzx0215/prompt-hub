import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit/check";
import { GenerationType } from "@prisma/client";

export const runtime = "nodejs";

// A helper to sleep in mock streaming
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, goal, framework, tone, originalPrompt } = body;

    // Validate inputs
    const genType = type as GenerationType;
    if (!genType) {
      return NextResponse.json({ error: "Missing or invalid generation type" }, { status: 400 });
    }

    const promptGoal = goal || originalPrompt || "自定义任务";

    // 1. IP Rate limit check
    const { allowed, ipHash, currentCount, limit } = await checkRateLimit(request, "text");
    if (!allowed) {
      return NextResponse.json(
        { error: `今日文本生成额度 (${limit}次) 已用尽，当前已用 ${currentCount} 次。请明天再试` },
        { status: 429 }
      );
    }

    const provider = process.env.AI_PROVIDER || "mock";
    const apiKey = process.env.OPENAI_API_KEY || "";
    const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
    const model = process.env.TEXT_MODEL || "gpt-4o-mini";

    // 2. Stream generation logic
    if (provider === "mock") {
      const mockResultText = `# 角色定位：自定义 AI 高级生成助理 (${tone} 风格)

## 💡 核心指令
根据您输入的目标：“${promptGoal}”，已为您生成符合 ${framework.toUpperCase()} 架构的黄金提示词。

## 📝 结构框架 (${framework.toUpperCase()})
- **Capacity (角色与能力)**: 针对此任务专属调优的多模态专家模型。
- **Objective (生成目标)**: 极速高精度的产出，满足严格的内容规范。
- **Tone (语调控制)**: 完美契合您选择的 ${tone} 风格，字字珠玑。
- **Constraints (约束边界)**: 遵守防幻觉、零冗余的系统规则。

## 🛠 输出样例
已自动锁定温度参数 (Temp = 0.7)，参数配置处于最优解，完美兼容 ChatGPT, Claude 和 DeepSeek 等核心模型。`;

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Stream chunk by chunk (simulate actual network delay and token generation)
            const chunkSize = 15;
            for (let i = 0; i < mockResultText.length; i += chunkSize) {
              const chunk = mockResultText.slice(i, i + chunkSize);
              controller.enqueue(encoder.encode(chunk));
              await sleep(25);
            }

            // Save record to DB
            await prisma.generationRecord.create({
              data: {
                type: genType,
                inputSummary: promptGoal.slice(0, 150),
                outputPrompt: mockResultText,
                outputExplanation: "这是 mock 模式下流式生成的测试记录，用于本地开发验证。",
                language: "zh-CN",
                providerName: "mock",
                modelName: "mock-model",
                ipHash,
              },
            });
          } catch (err) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    if (provider === "openai-compatible") {
      if (!apiKey) {
        return NextResponse.json({ error: "Missing OPENAI_API_KEY environment variable on server" }, { status: 500 });
      }

      const systemPrompt = `你是一名世界顶级的提示词工程专家。请根据用户的目标生成一个结构清晰、目标明确、包含上下文和输出格式的高级结构化提示词。
你应当完美对齐用户期望的 [框架：${framework}] 与 [语调：${tone}]，并采用 Markdown 格式输出。
请务必直接输出提示词内容本身，不带有任何 JSON 包裹，开头直接以 Markdown 标题或正文开始，排版要极致精美。`;

      const userContent = genType === "TEXT_OPTIMIZE"
        ? `请帮我重塑并升维以下提示词。
原始提示词：${originalPrompt}
优化附加目标/背景：${goal || "无"}`
        : `提示词生成目标：${goal}`;

      const response = await fetch(`${apiBase}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: `Upstream AI service error: ${response.status} - ${errorText}` }, { status: 502 });
      }

      const reader = response.body?.getReader();
      if (!reader) {
        return NextResponse.json({ error: "Failed to read stream from upstream AI service" }, { status: 502 });
      }

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = "";

      const stream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const cleanLine = line.trim();
                if (!cleanLine) continue;
                if (cleanLine === "data: [DONE]") continue;

                if (cleanLine.startsWith("data: ")) {
                  try {
                    const jsonStr = cleanLine.slice(6);
                    const parsed = JSON.parse(jsonStr);
                    const token = parsed.choices?.[0]?.delta?.content || "";
                    if (token) {
                      accumulatedText += token;
                      controller.enqueue(encoder.encode(token));
                    }
                  } catch {
                    // Ignore malformed line JSON parse error
                  }
                }
              }
            }

            // Flush remaining buffer
            if (buffer.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(buffer.slice(6));
                const token = parsed.choices?.[0]?.delta?.content || "";
                if (token) {
                  accumulatedText += token;
                  controller.enqueue(encoder.encode(token));
                }
              } catch {}
            }

            // Write final compiled generation record to MySQL
            if (accumulatedText.trim()) {
              await prisma.generationRecord.create({
                data: {
                  type: genType,
                  inputSummary: promptGoal.slice(0, 150),
                  outputPrompt: accumulatedText,
                  outputExplanation: `基于 ${framework.toUpperCase()} 框架 and ${tone} 语调流式生成完毕。`,
                  language: "zh-CN",
                  providerName: "openai-compatible",
                  modelName: model,
                  ipHash,
                },
              });
            }
          } catch (err) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    return NextResponse.json({ error: "Unsupported AI_PROVIDER configuration" }, { status: 500 });
  } catch (error: unknown) {
    console.error("Error in generate API route:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
