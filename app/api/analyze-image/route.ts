import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit/check";
import { createAIProvider } from "@/lib/ai/provider";
import { GenerationType, Prisma } from "@prisma/client";
import { ImagePromptInput } from "@/lib/ai/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 1. IP Rate limit check
    const { allowed, ipHash, currentCount, limit } = await checkRateLimit(request, "image");
    if (!allowed) {
      return NextResponse.json(
        { error: `今日图片转提示词额度 (${limit}次) 已用尽，当前已用 ${currentCount} 次。请明天再试` },
        { status: 429 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid Content-Type, expected multipart/form-data" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const mode = (formData.get("mode") as string) || "image-generation";

    if (!file) {
      return NextResponse.json({ error: "Missing uploaded file" }, { status: 400 });
    }

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "图片文件过大，最大支持 4MB" }, { status: 400 });
    }

    // Validate MIME types
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    let mimeType = file.type;
    if (!mimeType && file.name.endsWith(".webp")) mimeType = "image/webp";
    if (!mimeType && (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg"))) mimeType = "image/jpeg";
    if (!mimeType && file.name.endsWith(".png")) mimeType = "image/png";

    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json({ error: "不支持的图片格式，仅支持 PNG, JPG, JPEG, WEBP" }, { status: 400 });
    }

    // Convert image buffer to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Obtain provider and execute
    const provider = createAIProvider();
    const isDesign = mode === "design-analysis";

    const cleanMimeType = (mimeType === "image/jpg" ? "image/jpeg" : mimeType) as "image/png" | "image/jpeg" | "image/webp";
    const cleanMode = (mode === "design-analysis" ? "design-analysis" : "image-generation") as "image-generation" | "design-analysis";

    const aiInput: ImagePromptInput = {
      imageBase64: base64,
      mimeType: cleanMimeType,
      mode: cleanMode,
      language: "zh-CN",
    };

    const result = isDesign
      ? await provider.analyzeDesignFromImage(aiInput)
      : await provider.generatePromptFromImage(aiInput);

    // Save record to DB (never stores actual base64 or file bytes, only descriptions!)
    await prisma.generationRecord.create({
      data: {
        type: isDesign ? GenerationType.DESIGN_ANALYSIS : GenerationType.IMAGE_TO_PROMPT,
        inputSummary: `Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        outputPrompt: result.naturalPrompt,
        outputJson: result.jsonBlueprint as Prisma.InputJsonValue,
        outputExplanation: result.chineseExplanation,
        language: "zh-CN",
        providerName: provider.name,
        modelName: provider.modelName,
        ipHash,
      },
    });

    return NextResponse.json({
      naturalPrompt: result.naturalPrompt,
      jsonBlueprint: result.jsonBlueprint,
      chineseExplanation: result.chineseExplanation,
    });
  } catch (error: unknown) {
    console.error("Error in analyze-image API route:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error during image analysis" }, { status: 500 });
  }
}
