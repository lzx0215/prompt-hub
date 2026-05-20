import { describe, expect, it } from "vitest";
import { loadSeedPrompts } from "../../lib/seed/load-seed-prompts";

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
});
