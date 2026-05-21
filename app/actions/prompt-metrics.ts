"use server";

import { recordPromptCopy } from "@/lib/metrics/prompt-metrics";

export async function recordPromptCopyAction(promptId: string): Promise<void> {
  await recordPromptCopy(promptId);
}
