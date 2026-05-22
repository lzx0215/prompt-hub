import type {
  AIProvider,
  ImagePromptInput,
  ImagePromptResult,
  OptimizePromptInput,
  TemplateRewriteInput,
  TextPromptInput,
  TextPromptResult,
} from "./types";

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export function createOpenAICompatibleProvider(): AIProvider {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
  const textModel = process.env.TEXT_MODEL || "gpt-4o-mini";
  const visionModel = process.env.VISION_MODEL || "gpt-4o-mini";

  async function callOpenAI(messages: Array<Record<string, unknown>>, model: string, isJson = true): Promise<string> {
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: isJson ? { type: "json_object" } : undefined,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API request failed: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI API");
    }

    return content;
  }

  return {
    name: "openai-compatible",
    modelName: textModel,

    async generateTextPrompt(input: TextPromptInput): Promise<TextPromptResult> {
      const systemMessage = `你是一名专业的提示词工程专家。请根据用户的目标生成一个结构清晰、目标明确、包含上下文和输出格式的高级提示词。
你必须返回一个符合 JSON 格式的对象，包含以下键名：
- "naturalPrompt": 生成的高级结构化提示词主体内容，请使用 Markdown 语法进行排版。
- "explanation": 对该提示词使用方法的简要说明。

请务必确保返回的文本是一个合法的 JSON 对象，不带有任何额外的 markdown 标记包裹。`;

      const messages = [
        { role: "system", content: systemMessage },
        { role: "user", content: `目标：${input.goal}\n期望语言：${input.language}` },
      ];

      const content = await callOpenAI(messages, textModel, true);
      const result = JSON.parse(content) as TextPromptResult;
      return {
        naturalPrompt: result.naturalPrompt || "",
        explanation: result.explanation || "",
      };
    },

    async optimizePrompt(input: OptimizePromptInput): Promise<TextPromptResult> {
      const systemMessage = `你是一名专业的提示词工程专家。你的任务是优化用户提供的不完美提示词，使其更加精准、高保真、并能让大模型发挥最大能力。
你必须返回一个符合 JSON 格式的对象，包含以下键名：
- "naturalPrompt": 优化后的完整提示词主体内容，请使用 Markdown 语法进行排版。
- "explanation": 对你做出的改动与优化原因进行简要解析说明。

请务必确保返回的文本是一个合法的 JSON 对象。`;

      const messages = [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: `原始提示词：${input.originalPrompt}\n优化目标/背景：${input.goal || "无"}\n期望语言：${input.language}`,
        },
      ];

      const content = await callOpenAI(messages, textModel, true);
      const result = JSON.parse(content) as TextPromptResult;
      return {
        naturalPrompt: result.naturalPrompt || "",
        explanation: result.explanation || "",
      };
    },

    async rewriteWithTemplate(input: TemplateRewriteInput): Promise<TextPromptResult> {
      const systemMessage = `你是一名专业的提示词工程专家。你的任务是将传入的变量参数填充进给定的提示词模板中，并进行最终的高清晰度语义润色，以生成最优质的下游执行提示词。
你必须返回一个符合 JSON 格式的对象，包含以下键名：
- "naturalPrompt": 填充并润色后的完整提示词，请使用 Markdown 语法排版。
- "explanation": 对生成结果的简要说明。

请务必确保返回的文本是一个合法的 JSON 对象。`;

      const messages = [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: `提示词模板：${input.template}\n变量值：${JSON.stringify(input.variables)}\n期望语言：${input.language}`,
        },
      ];

      const content = await callOpenAI(messages, textModel, true);
      const result = JSON.parse(content) as TextPromptResult;
      return {
        naturalPrompt: result.naturalPrompt || "",
        explanation: result.explanation || "",
      };
    },

    async generatePromptFromImage(input: ImagePromptInput): Promise<ImagePromptResult> {
      const systemMessage = `You are a professional visual prompt engineer and multi-modal AI analyst. 
Analyze the provided image and generate a highly descriptive text prompt (perfectly tailored for Midjourney or Flux AI) and a structured JSON blueprint.

You must return a JSON object with the following keys:
1. "naturalPrompt": A detailed, high-quality image generation prompt describing the subject, composition, lighting, style, color palette, and camera/rendering details (in English).
2. "jsonBlueprint": A structured JSON object containing:
   - "composition": shot_type, camera_angle, focal_length, aperture, depth_of_field.
   - "subject": entity, style, materials[], emissive_elements, textures.
   - "lighting": key_light, ambient, reflections.
   - "color_palette": primary, accent_1, accent_2.
   - "scene_context": background, mood.
3. "chineseExplanation": A brief Chinese analysis of the style, lighting, and composition elements extracted from this image.

Ensure the returned text is a valid JSON object.`;

      const messages = [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image in mode: ${input.mode}, target language: ${input.language}. Return the requested JSON.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${input.mimeType};base64,${input.imageBase64}`,
              },
            },
          ],
        },
      ];

      const content = await callOpenAI(messages as unknown as Array<Record<string, unknown>>, visionModel, true);
      const result = JSON.parse(content) as ImagePromptResult;
      return {
        naturalPrompt: result.naturalPrompt || "",
        jsonBlueprint: result.jsonBlueprint || {},
        chineseExplanation: result.chineseExplanation || "",
      };
    },

    async analyzeDesignFromImage(input: ImagePromptInput): Promise<ImagePromptResult> {
      return this.generatePromptFromImage({ ...input, mode: "design-analysis" });
    },
  };
}
