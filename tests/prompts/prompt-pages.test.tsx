import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PromptsPage from "@/app/prompts/page";
import PromptDetailPage from "@/app/prompts/[slug]/page";

vi.mock("@/lib/prompts/public-query", () => ({
  getPublicPromptFilterOptions: vi.fn().mockResolvedValue({
    categories: [{ slug: "office", name: "办公效率" }],
    tags: [{ slug: "summary", name: "summary" }],
  }),
  getPublicPromptList: vi.fn().mockResolvedValue([]),
  getPublicPromptBySlug: vi.fn().mockResolvedValue({
    id: "test-id",
    slug: "meeting-summary",
    title: "会议纪要整理助手",
    summary: "把零散会议记录整理为清晰的结论、行动项和风险提醒。",
    content: "你是一名专业会议纪要助手。",
    exampleInput: "项目例会讨论了首页改版。",
    exampleOutput: "## 关键结论\n- 首页改版进入视觉确认阶段。",
    structureRole: "专业会议纪要助手",
    structureTask: "整理会议主题、关键结论、行动项和风险提醒",
    structureContext: "用户提供的是原始会议记录",
    structureConstraints: "不要编造负责人和截止时间",
    structureOutputFormat: "使用 Markdown 分节标题和表格",
    weakPrompt: "帮我总结会议。",
    improvedPrompt: "你是一名专业会议纪要助手。请根据我提供的会议记录……",
    improvementNotes: "优化版明确了角色、任务、字段和输出格式。",
    language: "zh-CN",
    categoryId: "cat-1",
    tags: [{ tagId: "tag-1", tag: { slug: "summary", name: "summary" } }],
    category: { slug: "office", name: "办公效率" },
  }),
  getRelatedPublicPrompts: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/metrics/prompt-metrics", () => ({
  recordPromptView: vi.fn().mockResolvedValue(true),
}));

describe("prompt public pages", () => {
  it("renders the prompt library filters and empty result state", async () => {
    const page = await PromptsPage({ searchParams: Promise.resolve({ query: "空结果" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("精选提示词库");
    expect(html).toContain("搜索提示词");
    expect(html).toContain("没有找到匹配的提示词");
  });

  it("renders prompt detail learning sections", async () => {
    const page = await PromptDetailPage({ params: Promise.resolve({ slug: "meeting-summary" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("提示词正文");
    expect(html).toContain("示例输入");
    expect(html).toContain("结构拆解");
    expect(html).toContain("优化对比");
  });
});
