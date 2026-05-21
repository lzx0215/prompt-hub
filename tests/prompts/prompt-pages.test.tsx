import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PromptsPage from "@/app/prompts/page";

vi.mock("@/lib/prompts/public-query", () => ({
  getPublicPromptFilterOptions: vi.fn().mockResolvedValue({
    categories: [{ slug: "office", name: "办公效率" }],
    tags: [{ slug: "summary", name: "summary" }],
  }),
  getPublicPromptList: vi.fn().mockResolvedValue([]),
}));

describe("prompt public pages", () => {
  it("renders the prompt library filters and empty result state", async () => {
    const page = await PromptsPage({ searchParams: Promise.resolve({ query: "空结果" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("精选提示词库");
    expect(html).toContain("搜索提示词");
    expect(html).toContain("没有找到匹配的提示词");
  });
});
