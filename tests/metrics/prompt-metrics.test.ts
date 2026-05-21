import { describe, expect, it, vi } from "vitest";
import { recordPromptCopy, recordPromptView } from "@/lib/metrics/prompt-metrics";

describe("prompt metrics", () => {
  it("increments views for a public prompt", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });

    await expect(recordPromptView("prompt-id", { prompt: { updateMany } })).resolves.toBe(true);
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: "prompt-id", status: "PUBLISHED" },
      data: { viewCount: { increment: 1 } },
    });
  });

  it("returns false instead of throwing when copy metrics fail", async () => {
    const updateMany = vi.fn().mockRejectedValue(new Error("write failed"));

    await expect(recordPromptCopy("prompt-id", { prompt: { updateMany } })).resolves.toBe(false);
  });

  it("returns false when no published prompt matches", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 0 });

    await expect(recordPromptView("nonexistent-id", { prompt: { updateMany } })).resolves.toBe(false);
  });
});
