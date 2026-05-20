export type PromptLanguage = "zh-CN" | "en" | "bilingual";

export type ImagePromptMode = "image-generation" | "design-analysis";

export interface TextPromptInput {
  goal: string;
  language: PromptLanguage;
}

export interface OptimizePromptInput {
  originalPrompt: string;
  goal?: string;
  language: PromptLanguage;
}

export interface TemplateRewriteInput {
  template: string;
  variables: Record<string, string>;
  language: PromptLanguage;
}

export interface ImagePromptInput {
  imageBase64: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  mode: ImagePromptMode;
  language: PromptLanguage;
}

export interface TextPromptResult {
  naturalPrompt: string;
  explanation: string;
}

export interface ImagePromptResult {
  naturalPrompt: string;
  jsonBlueprint: Record<string, unknown>;
  chineseExplanation: string;
}

export interface AIProvider {
  name: string;
  modelName: string;
  generateTextPrompt(input: TextPromptInput): Promise<TextPromptResult>;
  optimizePrompt(input: OptimizePromptInput): Promise<TextPromptResult>;
  rewriteWithTemplate(input: TemplateRewriteInput): Promise<TextPromptResult>;
  generatePromptFromImage(input: ImagePromptInput): Promise<ImagePromptResult>;
  analyzeDesignFromImage(input: ImagePromptInput): Promise<ImagePromptResult>;
}
