import { createMockAIProvider } from "./mock-provider";
import { createOpenAICompatibleProvider } from "./openai-compatible-provider";
import type { AIProvider } from "./types";

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return createMockAIProvider();
  }

  if (provider === "openai-compatible") {
    return createOpenAICompatibleProvider();
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}
