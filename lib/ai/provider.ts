import { createMockAIProvider } from "./mock-provider";
import type { AIProvider } from "./types";

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return createMockAIProvider();
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}
