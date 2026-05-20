import type {
  AIProvider,
  ImagePromptInput,
  ImagePromptResult,
  OptimizePromptInput,
  TemplateRewriteInput,
  TextPromptInput,
  TextPromptResult,
} from "./types";

function textResult(topic: string): TextPromptResult {
  return {
    naturalPrompt: `你是一名专业提示词工程助手。请围绕“${topic}”生成结构清晰、目标明确、包含上下文和输出格式的提示词。`,
    explanation: "这是 mock provider 返回的稳定结果，用于本地开发和自动化测试。",
  };
}

function imageResult(input: ImagePromptInput): ImagePromptResult {
  return {
    naturalPrompt:
      input.mode === "design-analysis"
        ? "Analyze the uploaded reference image as a visual design. Describe layout, hierarchy, color, typography, spacing, and improvement opportunities."
        : "Create a high-quality image generation prompt based on the uploaded reference image, describing subject, composition, lighting, style, color palette, and camera details.",
    jsonBlueprint: {
      source: "mock-vision",
      mode: input.mode,
      mimeType: input.mimeType,
      language: input.language,
    },
    chineseExplanation: "这是 mock 视觉分析结果，用于验证图片转提示词流程，不代表真实识图。",
  };
}

export function createMockAIProvider(): AIProvider {
  return {
    name: "mock",
    modelName: "mock-model",
    generateTextPrompt(input: TextPromptInput) {
      return Promise.resolve(textResult(input.goal));
    },
    optimizePrompt(input: OptimizePromptInput) {
      return Promise.resolve(textResult(input.goal ?? input.originalPrompt));
    },
    rewriteWithTemplate(input: TemplateRewriteInput) {
      const topic = Object.values(input.variables).join("，") || input.template;

      return Promise.resolve(textResult(topic));
    },
    generatePromptFromImage(input: ImagePromptInput) {
      return Promise.resolve(imageResult(input));
    },
    analyzeDesignFromImage(input: ImagePromptInput) {
      return Promise.resolve(imageResult({ ...input, mode: "design-analysis" }));
    },
  };
}
