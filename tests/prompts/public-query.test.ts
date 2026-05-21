import { describe, expect, it, vi } from "vitest";
import {
  getFeaturedPublicPrompts,
  getPublicPromptBySlug,
  getPublicPromptFilterOptions,
  getPublicPromptList,
  getRelatedPublicPrompts,
} from "@/lib/prompts/public-query";

describe("public prompt queries", () => {
  it("filters list queries to published prompts and combines search filters", async () => {
    const findMany = vi.fn().mockResolvedValue([]);

    await getPublicPromptList(
      { query: "会议", category: "office", tag: "summary" },
      { prompt: { findMany }, category: { findMany: vi.fn() }, tag: { findMany: vi.fn() } },
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "PUBLISHED",
          category: { slug: "office" },
          tags: { some: { tag: { slug: "summary" } } },
        }),
      }),
    );
  });

  it("never resolves a non-published detail prompt", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);

    await getPublicPromptBySlug("draft-slug", { prompt: { findFirst } });

    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: "draft-slug", status: "PUBLISHED" },
      }),
    );
  });

  it("excludes the current prompt from related public prompts", async () => {
    const findMany = vi.fn().mockResolvedValue([]);

    await getRelatedPublicPrompts(
      { id: "current-id", categoryId: "office-id", tagIds: ["summary-id"] },
      { prompt: { findMany } },
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: "current-id" },
          status: "PUBLISHED",
        }),
      }),
    );
  });

  it("uses featured public prompts for homepage previews", async () => {
    const findMany = vi.fn().mockResolvedValue([]);

    await getFeaturedPublicPrompts({ prompt: { findMany } });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "PUBLISHED", isFeatured: true },
      }),
    );
  });

  it("returns filter options with published-only categories and tags", async () => {
    const categoryFindMany = vi.fn().mockResolvedValue([{ slug: "office", name: "办公效率" }]);
    const tagFindMany = vi.fn().mockResolvedValue([{ slug: "summary", name: "summary" }]);

    const result = await getPublicPromptFilterOptions({
      category: { findMany: categoryFindMany },
      tag: { findMany: tagFindMany },
    });

    expect(result.categories).toHaveLength(1);
    expect(result.tags).toHaveLength(1);
  });
});
