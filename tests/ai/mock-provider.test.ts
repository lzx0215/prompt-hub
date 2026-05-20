import { describe, expect, it } from "vitest";
import { createMockAIProvider } from "@/lib/ai/mock-provider";

describe("createMockAIProvider", () => {
  it("generates deterministic text prompt output", async () => {
    const provider = createMockAIProvider();

    const result = await provider.generateTextPrompt({
      goal: "写一个会议纪要提示词",
      language: "zh-CN",
    });

    expect(result.naturalPrompt).toContain("写一个会议纪要提示词");
    expect(result.explanation).toContain("mock");
  });

  it("generates deterministic image prompt output without storing images", async () => {
    const provider = createMockAIProvider();

    const result = await provider.generatePromptFromImage({
      imageBase64: "ZmFrZS1pbWFnZQ==",
      mimeType: "image/png",
      mode: "image-generation",
      language: "en",
    });

    expect(result.naturalPrompt).toContain("reference image");
    expect(result.jsonBlueprint).toMatchObject({
      source: "mock-vision",
      mode: "image-generation",
    });
  });
});
