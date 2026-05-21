import { describe, expect, it } from "vitest";
import { loadSeedPrompts } from "@/lib/seed/load-seed-prompts";

describe("loadSeedPrompts", () => {
  it("loads reviewed seed prompts with category and tags", async () => {
    const prompts = await loadSeedPrompts("content/seed-prompts/foundation.json");

    expect(prompts).toHaveLength(1);
    expect(prompts[0]).toMatchObject({
      slug: "meeting-summary-assistant",
      category: "office",
      tags: ["summary", "work"],
      isFeatured: true,
    });
  });

  it("loads the launch library with the expected category distribution", async () => {
    const prompts = await loadSeedPrompts("content/seed-prompts/public-library.json");
    const counts = prompts.reduce<Record<string, number>>((currentCounts, prompt) => {
      currentCounts[prompt.category] = (currentCounts[prompt.category] ?? 0) + 1;
      return currentCounts;
    }, {});

    expect(prompts).toHaveLength(20);
    expect(counts.office).toBe(4);
    expect(counts.learning).toBe(3);
    expect(counts["coding-agent"]).toBe(4);
    expect(counts.writing).toBe(3);
    expect(counts.marketing).toBe(3);
    expect(counts["image-video"]).toBe(3);
  });

  it("rejects a public prompt without detail-page learning fields", async () => {
    await expect(
      loadSeedPrompts("tests/fixtures/seed-prompts/missing-learning-fields.json"),
    ).rejects.toThrow();
  });
});
