# Prompt Hub 公开首页与精选提示词库首发体验实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付可供个人和朋友真实试用的公开首页与精选提示词库闭环，覆盖首批 20 条内容、列表搜索筛选、学习详情、复制反馈和最小公开统计。

**Architecture:** 本计划复用现有 Prisma 内容模型和 App Router 页面骨架。先把 seed 契约和公开查询层固定下来，再实现计数写入边界和页面组件，最后完成首页、列表、详情的浏览器检查与 feature 状态同步。

**Tech Stack:** Next.js App Router、TypeScript、Prisma/MySQL、Tailwind CSS、Vitest、React Server Components、Next.js Server Actions。

---

## 0. 执行边界

- 必读规格：`docs/superpowers/specs/2026-05-21-prompt-hub-public-home-prompt-library-launch-design.zh-CN.md`。
- 必读 feature：`docs/features/M1-001-public-home-prompt-library-launch.md`。
- 本计划只做 `M1-001`，不开发真实 AI 工具、`/learn` 教程正文、后台 CRUD 或运营分析。
- 页面默认只读 `PUBLISHED` 内容。
- 统计写入失败不能阻断公开阅读或复制主流程。
- 所有代码任务先写能证明行为的测试，再写最小实现。
- 重要 UI 改动完成前必须做桌面端和移动端浏览器检查，并把检查结果回写 `progress.md`。

## 1. 文件结构

本计划预计创建或修改：

```text
app/
|-- page.tsx
|-- actions/
|   `-- prompt-metrics.ts
`-- prompts/
    |-- page.tsx
    `-- [slug]/
        |-- not-found.tsx
        `-- page.tsx
components/
|-- home/
|   |-- FeaturedCategories.tsx
|   |-- FeaturedPrompts.tsx
|   `-- ToolEntryGrid.tsx
`-- prompt/
    |-- PromptCard.tsx
    |-- PromptCopyButton.tsx
    |-- PromptFilters.tsx
    |-- PromptStructure.tsx
    `-- PromptComparison.tsx
content/
`-- seed-prompts/
    |-- foundation.json
    `-- public-library.json
lib/
|-- prompts/
|   |-- public-query.ts
|   `-- public-types.ts
|-- seed/
|   `-- load-seed-prompts.ts
`-- metrics/
    `-- prompt-metrics.ts
prisma/
`-- seed.ts
tests/
|-- fixtures/
|   `-- seed-prompts/
|       `-- missing-learning-fields.json
|-- prompts/
|   |-- public-query.test.ts
|   `-- prompt-pages.test.tsx
|-- metrics/
|   `-- prompt-metrics.test.ts
`-- seed/
    `-- load-seed-prompts.test.ts
progress.md
feature_list.json
```

各文件职责：

| 文件或目录 | 职责 |
| --- | --- |
| `content/seed-prompts/public-library.json` | 首批 20 条公开提示词内容 |
| `lib/seed/load-seed-prompts.ts` | 校验 seed 内容字段和分类标签输入 |
| `prisma/seed.ts` | 导入分类、标签和已发布提示词 |
| `lib/prompts/public-query.ts` | 首页、列表、详情、相关提示词公开读取逻辑 |
| `lib/metrics/prompt-metrics.ts` | 浏览和复制计数写入边界 |
| `app/actions/prompt-metrics.ts` | 复制动作可调用的服务端计数入口 |
| `components/prompt/*` | 提示词列表和详情可复用展示组件 |
| `app/page.tsx` | 工具型首页分区与提示词库入口 |
| `app/prompts/**` | 列表页、详情页和未找到状态 |

## 2. Task 1：准备 M1-001 进行中状态

**Files:**
- Modify: `feature_list.json`
- Modify: `progress.md`

- [ ] **Step 1: 将 `M1-001` 状态切到进行中**

在 `feature_list.json` 中把 `M1-001.status` 从 `planned` 改为 `in_progress`，并把顶层阶段改为：

```json
"stage": "public-home-prompt-library-launch-in-progress"
```

- [ ] **Step 2: 更新当前目标**

在 `progress.md` 中把当前目标更新为：

```markdown
## 当前目标

按 `M1-001` 计划交付公开首页与精选提示词库首发体验，先固定 20 条内容契约、公开查询和统计边界，再进入页面实现。
```

- [ ] **Step 3: 验证状态 JSON**

运行：

```powershell
Get-Content -Raw -Encoding UTF8 'feature_list.json' | ConvertFrom-Json | Out-Null
```

预期：退出码为 `0`。

- [ ] **Step 4: 提交状态切换**

运行：

```powershell
git add feature_list.json progress.md
git commit -m "docs: start public prompt library launch"
```

## 3. Task 2：扩展 seed 内容契约并准备 20 条公开内容

**Files:**
- Create: `content/seed-prompts/public-library.json`
- Modify: `content/seed-prompts/foundation.json`
- Modify: `lib/seed/load-seed-prompts.ts`
- Modify: `prisma/seed.ts`
- Test: `tests/seed/load-seed-prompts.test.ts`

- [ ] **Step 1: 先写 seed 契约测试**

将 `tests/seed/load-seed-prompts.test.ts` 扩展为：

```ts
import { describe, expect, it } from "vitest";
import { loadSeedPrompts } from "@/lib/seed/load-seed-prompts";

describe("loadSeedPrompts", () => {
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
```

同时创建测试 fixture `tests/fixtures/seed-prompts/missing-learning-fields.json`：

```json
[
  {
    "slug": "missing-learning-fields",
    "title": "缺字段示例",
    "summary": "只用于验证 seed 契约。",
    "category": "office",
    "tags": ["work"],
    "content": "请整理会议。"
  }
]
```

- [ ] **Step 2: 运行失败测试**

运行：

```powershell
npx vitest run tests/seed/load-seed-prompts.test.ts
```

预期：失败，因为 20 条公开内容文件和测试 fixture 校验路径尚未齐备。

- [ ] **Step 3: 固定 seed 校验字段**

在 `lib/seed/load-seed-prompts.ts` 保持详情页必需字段校验，并为发布状态加默认显式字段：

```ts
const seedPromptSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  content: z.string().min(1),
  exampleInput: z.string().min(1),
  exampleOutput: z.string().min(1),
  structureRole: z.string().min(1),
  structureTask: z.string().min(1),
  structureContext: z.string().min(1),
  structureConstraints: z.string().min(1),
  structureOutputFormat: z.string().min(1),
  weakPrompt: z.string().min(1),
  improvedPrompt: z.string().min(1),
  improvementNotes: z.string().min(1),
  language: z.string().min(1),
  isFeatured: z.boolean(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
});
```

- [ ] **Step 4: 写入首批内容文件**

创建 `content/seed-prompts/public-library.json`，包含 20 条已 review 内容。每条对象都必须提供 Step 3 中的完整字段，并使用以下分类 slug：

```json
["office", "learning", "coding-agent", "writing", "marketing", "image-video"]
```

同时把 `content/seed-prompts/foundation.json` 保留为 Foundation fixture，不再作为首发公开库主数据源。

- [ ] **Step 5: 更新 seed 导入分类与数据源**

在 `prisma/seed.ts` 中定义分类配置：

```ts
const categories = [
  { slug: "office", name: "办公效率", description: "会议、汇报、总结、邮件和日常办公提示词。", sortOrder: 10 },
  { slug: "learning", name: "学习成长", description: "学习规划、复盘和知识理解提示词。", sortOrder: 20 },
  { slug: "coding-agent", name: "编程和 Agent 工作流", description: "编程、调试和 Agent 协作提示词。", sortOrder: 30 },
  { slug: "writing", name: "写作创作", description: "写作、改写和内容构思提示词。", sortOrder: 40 },
  { slug: "marketing", name: "营销和电商", description: "营销策划、商品表达和转化文案提示词。", sortOrder: 50 },
  { slug: "image-video", name: "图像和视频", description: "图像、视频和视觉创作提示词。", sortOrder: 60 },
];
```

导入时先 upsert 分类映射，再读取：

```ts
const prompts = await loadSeedPrompts("content/seed-prompts/public-library.json");
```

每条 prompt 使用自己的 `category` 找到 `categoryId`，并把 `status` 写入 Prisma。

- [ ] **Step 6: 验证 seed 专项**

运行：

```powershell
npx vitest run tests/seed/load-seed-prompts.test.ts
npm run prisma:validate
npm run prisma:generate
```

预期：全部通过。

- [ ] **Step 7: 提交内容契约**

运行：

```powershell
git add content lib/seed prisma/seed.ts tests/seed tests/fixtures
git commit -m "feat: add launch prompt seed library"
```

## 4. Task 3：实现公开提示词查询层

**Files:**
- Create: `lib/prompts/public-types.ts`
- Create: `lib/prompts/public-query.ts`
- Test: `tests/prompts/public-query.test.ts`

- [ ] **Step 1: 写公开查询测试**

创建 `tests/prompts/public-query.test.ts`，用可替换 Prisma 依赖验证查询边界：

```ts
import { describe, expect, it, vi } from "vitest";
import {
  getFeaturedPublicPrompts,
  getPublicPromptBySlug,
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
});
```

- [ ] **Step 2: 运行失败测试**

运行：

```powershell
npx vitest run tests/prompts/public-query.test.ts
```

预期：失败，因为公开查询模块尚未创建。

- [ ] **Step 3: 定义公开展示类型**

创建 `lib/prompts/public-types.ts`：

```ts
export interface PublicPromptListFilters {
  query?: string;
  category?: string;
  tag?: string;
}

export interface RelatedPromptInput {
  id: string;
  categoryId: string;
  tagIds: string[];
}
```

- [ ] **Step 4: 实现查询函数**

创建 `lib/prompts/public-query.ts`，以 Prisma 公开读取规则实现：

```ts
import { prisma } from "@/lib/db/prisma";
import type { PublicPromptListFilters, RelatedPromptInput } from "./public-types";

const promptCardInclude = {
  category: true,
  tags: { include: { tag: true } },
} as const;

export async function getFeaturedPublicPrompts(client = prisma) {
  return client.prompt.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: promptCardInclude,
    orderBy: [{ copyCount: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
}

export async function getPublicPromptList(
  filters: PublicPromptListFilters,
  client = prisma,
) {
  const query = filters.query?.trim();
  const where = {
    status: "PUBLISHED" as const,
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.tag ? { tags: { some: { tag: { slug: filters.tag } } } } : {}),
    ...(query
    ? {
        OR: [
            { title: { contains: query } },
            { summary: { contains: query } },
            { content: { contains: query } },
        ],
      }
    : {}),
  };

  return client.prompt.findMany({
    where,
    include: promptCardInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getPublicPromptBySlug(slug: string, client = prisma) {
  return client.prompt.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: promptCardInclude,
  });
}

export async function getRelatedPublicPrompts(
  input: RelatedPromptInput,
  client = prisma,
) {
  return client.prompt.findMany({
    where: {
      id: { not: input.id },
      status: "PUBLISHED",
      OR: [
        { categoryId: input.categoryId },
        { tags: { some: { tagId: { in: input.tagIds } } } },
      ],
    },
    include: promptCardInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 4,
  });
}

export async function getPublicPromptFilterOptions(client = prisma) {
  const [categories, tags] = await Promise.all([
    client.category.findMany({
      where: { prompts: { some: { status: "PUBLISHED" } } },
      orderBy: { sortOrder: "asc" },
    }),
    client.tag.findMany({
      where: { prompts: { some: { prompt: { status: "PUBLISHED" } } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { categories, tags };
}
```

查询步骤中的详情函数必须保留 `where: { slug, status: "PUBLISHED" }`；相关内容函数必须排除当前提示词、限制为 4 条并只返回 `PUBLISHED` 内容。

- [ ] **Step 5: 验证查询专项**

运行：

```powershell
npx vitest run tests/prompts/public-query.test.ts
npm run typecheck
```

预期：全部通过。

- [ ] **Step 6: 提交公开查询**

运行：

```powershell
git add lib/prompts tests/prompts/public-query.test.ts
git commit -m "feat: add public prompt queries"
```

## 5. Task 4：实现浏览与复制计数边界

**Files:**
- Create: `lib/metrics/prompt-metrics.ts`
- Create: `app/actions/prompt-metrics.ts`
- Test: `tests/metrics/prompt-metrics.test.ts`

- [ ] **Step 1: 写计数测试**

创建 `tests/metrics/prompt-metrics.test.ts`：

```ts
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
});
```

- [ ] **Step 2: 运行失败测试**

运行：

```powershell
npx vitest run tests/metrics/prompt-metrics.test.ts
```

预期：失败，因为计数模块尚未创建。

- [ ] **Step 3: 写计数服务**

创建 `lib/metrics/prompt-metrics.ts`：

```ts
import { prisma } from "@/lib/db/prisma";

async function incrementPublishedPromptMetric(
  id: string,
  field: "copyCount" | "viewCount",
  client = prisma,
): Promise<boolean> {
  try {
    const result = await client.prompt.updateMany({
      where: { id, status: "PUBLISHED" },
      data:
        field === "viewCount"
          ? { viewCount: { increment: 1 } }
          : { copyCount: { increment: 1 } },
    });

    return result.count > 0;
  } catch {
    return false;
  }
}

export function recordPromptView(id: string, client = prisma) {
  return incrementPublishedPromptMetric(id, "viewCount", client);
}

export function recordPromptCopy(id: string, client = prisma) {
  return incrementPublishedPromptMetric(id, "copyCount", client);
}
```

- [ ] **Step 4: 暴露复制计数 action**

创建 `app/actions/prompt-metrics.ts`：

```ts
"use server";

import { recordPromptCopy } from "@/lib/metrics/prompt-metrics";

export async function recordPromptCopyAction(promptId: string): Promise<void> {
  await recordPromptCopy(promptId);
}
```

- [ ] **Step 5: 验证计数专项**

运行：

```powershell
npx vitest run tests/metrics/prompt-metrics.test.ts
npm run typecheck
```

预期：全部通过。

- [ ] **Step 6: 提交计数边界**

运行：

```powershell
git add app/actions lib/metrics tests/metrics
git commit -m "feat: add public prompt metrics"
```

## 6. Task 5：实现提示词列表展示与筛选页

**Files:**
- Create: `components/prompt/PromptCard.tsx`
- Create: `components/prompt/PromptFilters.tsx`
- Modify: `app/prompts/page.tsx`
- Test: `tests/prompts/prompt-pages.test.tsx`

- [ ] **Step 1: 写列表页面渲染测试**

在 `tests/prompts/prompt-pages.test.tsx` 中先覆盖：

```tsx
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
```

- [ ] **Step 2: 运行失败测试**

运行：

```powershell
npx vitest run tests/prompts/prompt-pages.test.tsx
```

预期：失败，因为列表页还是占位页。

- [ ] **Step 3: 实现列表展示组件**

创建 `components/prompt/PromptCard.tsx`，展示标题、摘要、分类、标签、语言和详情入口。

创建 `components/prompt/PromptFilters.tsx`，使用 GET 表单和查询参数输入：

```tsx
import Link from "next/link";
import type { PublicPromptListFilters } from "@/lib/prompts/public-types";

interface PromptFiltersProps {
  categories: Array<{ slug: string; name: string }>;
  filters: PublicPromptListFilters;
  tags: Array<{ slug: string; name: string }>;
}

export function PromptFilters({ categories, filters, tags }: PromptFiltersProps) {
  return (
    <form action="/prompts" className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>搜索提示词</span>
        <input
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
          defaultValue={filters.query}
          name="query"
          placeholder="搜索任务、标题或提示词正文"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>分类</span>
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
          defaultValue={filters.category ?? ""}
          name="category"
        >
          <option value="">全部分类</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>标签</span>
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
          defaultValue={filters.tag ?? ""}
          name="tag"
        >
          <option value="">全部标签</option>
          {tags.map((tag) => (
            <option key={tag.slug} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-md bg-slate-950 px-4 py-2 text-sm text-white" type="submit">
          应用筛选
        </button>
        <Link className="rounded-md border border-slate-300 px-4 py-2 text-sm" href="/prompts">
          清除筛选
        </Link>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: 实现 `/prompts` 页面**

在 `app/prompts/page.tsx` 中：

- 读取 `searchParams`。
- 调用 `getPublicPromptFilterOptions()`。
- 调用 `getPublicPromptList(filters)`。
- 正常态渲染 `PromptCard`。
- 有筛选但无命中时渲染“没有找到匹配的提示词”。
- 无公开内容时渲染“当前还没有可展示的提示词”。

- [ ] **Step 5: 验证列表页面**

运行：

```powershell
npx vitest run tests/prompts/prompt-pages.test.tsx
npm run lint
npm run typecheck
```

预期：全部通过。

- [ ] **Step 6: 提交列表页**

运行：

```powershell
git add app/prompts/page.tsx components/prompt tests/prompts/prompt-pages.test.tsx
git commit -m "feat: build public prompt library page"
```

## 7. Task 6：实现学习详情页和复制反馈

**Files:**
- Create: `app/prompts/[slug]/page.tsx`
- Create: `app/prompts/[slug]/not-found.tsx`
- Create: `components/prompt/PromptCopyButton.tsx`
- Create: `components/prompt/PromptStructure.tsx`
- Create: `components/prompt/PromptComparison.tsx`
- Modify: `tests/prompts/prompt-pages.test.tsx`

- [ ] **Step 1: 写详情页面测试**

在 `tests/prompts/prompt-pages.test.tsx` 中增加详情渲染覆盖：

```tsx
import PromptDetailPage from "@/app/prompts/[slug]/page";

vi.mock("@/lib/metrics/prompt-metrics", () => ({
  recordPromptView: vi.fn().mockResolvedValue(true),
}));

it("renders prompt detail learning sections", async () => {
  const page = await PromptDetailPage({ params: Promise.resolve({ slug: "meeting-summary" }) });
  const html = renderToStaticMarkup(page);

  expect(html).toContain("提示词正文");
  expect(html).toContain("示例输入");
  expect(html).toContain("结构拆解");
  expect(html).toContain("优化对比");
  expect(html).toContain("相关提示词");
});
```

详情 query mock 必须返回包含正文、示例、结构字段、优化字段、分类、标签和 id 的公开提示词对象。

- [ ] **Step 2: 运行失败测试**

运行：

```powershell
npx vitest run tests/prompts/prompt-pages.test.tsx
```

预期：失败，因为详情页面尚未创建。

- [ ] **Step 3: 实现详情展示组件**

创建：

- `PromptStructure.tsx`，渲染角色、任务、上下文、约束和输出格式。
- `PromptComparison.tsx`，渲染普通版、优化版和改进说明。
- `PromptCopyButton.tsx`，复制正文后调用 `recordPromptCopyAction(promptId)`，展示中文成功或失败反馈。

复制组件必须是 client component，并围绕浏览器剪贴板失败提供可见反馈。

- [ ] **Step 4: 实现详情页**

在 `app/prompts/[slug]/page.tsx` 中：

- 读取 slug。
- 调用 `getPublicPromptBySlug(slug)`。
- 不存在时调用 `notFound()`。
- 在有效详情页调用 `recordPromptView(prompt.id)`，不因返回 `false` 中断渲染。
- 调用 `getRelatedPublicPrompts({ id: prompt.id, categoryId: prompt.categoryId, tagIds: prompt.tags.map((item) => item.tagId) })`。
- 按规格顺序渲染正文、示例、结构拆解、优化对比和相关提示词。

- [ ] **Step 5: 实现未找到状态**

创建 `app/prompts/[slug]/not-found.tsx`，提供中文说明和回到提示词库的入口。

- [ ] **Step 6: 验证详情页**

运行：

```powershell
npx vitest run tests/prompts/prompt-pages.test.tsx
npm run lint
npm run typecheck
```

预期：全部通过。

- [ ] **Step 7: 提交详情页**

运行：

```powershell
git add app/prompts components/prompt tests/prompts/prompt-pages.test.tsx
git commit -m "feat: build prompt learning detail page"
```

## 8. Task 7：升级工具型首页

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/ToolEntryGrid.tsx`
- Create: `components/home/FeaturedCategories.tsx`
- Create: `components/home/FeaturedPrompts.tsx`
- Modify: `tests/prompts/prompt-pages.test.tsx`

- [ ] **Step 1: 写首页测试**

在 `tests/prompts/prompt-pages.test.tsx` 中增加：

```tsx
import HomePage from "@/app/page";

it("renders prompt-library launch entries on the homepage", async () => {
  const page = await HomePage();
  const html = renderToStaticMarkup(page);

  expect(html).toContain("找提示词");
  expect(html).toContain("精选分类");
  expect(html).toContain("精选提示词");
  expect(html).toContain("/prompts");
});
```

公开查询 mock 中补 `getFeaturedPublicPrompts()` 和首页分类数据返回。

- [ ] **Step 2: 运行失败测试**

运行：

```powershell
npx vitest run tests/prompts/prompt-pages.test.tsx
```

预期：失败，因为首页还没有精选分类和精选提示词分区。

- [ ] **Step 3: 实现首页分区组件**

创建：

- `ToolEntryGrid.tsx`，展示图片工具、文本生成器和提示词库入口。
- `FeaturedCategories.tsx`，将分类链接到 `/prompts?category=<slug>`。
- `FeaturedPrompts.tsx`，展示少量精选公开提示词详情入口。

- [ ] **Step 4: 改造 `app/page.tsx`**

首页按规格渲染：

- 品牌价值主张。
- 核心入口。
- 精选分类。
- 精选提示词。
- 简短使用流程。
- FAQ。

图片工具和文本生成器入口文案必须说明方向，不暗示真实能力已在本 feature 完成。

- [ ] **Step 5: 验证首页**

运行：

```powershell
npx vitest run tests/prompts/prompt-pages.test.tsx
npm run lint
npm run typecheck
```

预期：全部通过。

- [ ] **Step 6: 提交首页**

运行：

```powershell
git add app/page.tsx components/home tests/prompts/prompt-pages.test.tsx
git commit -m "feat: upgrade public homepage for prompt library"
```

## 9. Task 8：浏览器检查、统一验证与 feature 同步

**Files:**
- Modify: `feature_list.json`
- Modify: `progress.md`

- [ ] **Step 1: 启动本地服务**

运行：

```powershell
npm run dev
```

预期：Next.js 服务启动；若默认端口被占用，记录实际 URL。

- [ ] **Step 2: 做桌面端浏览器检查**

检查：

- `/` 的主入口、精选分类和精选提示词。
- `/prompts` 的搜索、分类筛选、标签筛选和清除筛选回路。
- `/prompts/[slug]` 的正文、长文本换行、复制反馈、结构拆解、优化对比和相关提示词。
- `/prompts/not-a-real-slug` 的未找到反馈。

- [ ] **Step 3: 做移动端浏览器检查**

使用移动端 viewport 重复检查：

- 首页入口和精选提示词可扫描。
- 列表筛选控件不遮挡结果。
- 详情长提示词、示例输出和复制按钮不溢出。

- [ ] **Step 4: 运行最终验证**

运行：

```powershell
npm run verify
```

预期：lint、Prisma validate、Prisma generate、typecheck、tests 和 build 全部通过。

- [ ] **Step 5: 同步 review 状态**

将 `feature_list.json` 中 `M1-001.status` 更新为 `review`，在 `verification` 中记录：

```json
[
  "npx vitest run tests/seed/load-seed-prompts.test.ts",
  "npx vitest run tests/prompts/public-query.test.ts",
  "npx vitest run tests/metrics/prompt-metrics.test.ts",
  "npx vitest run tests/prompts/prompt-pages.test.tsx",
  "browser QA: desktop and mobile home, prompt list filters, detail copy, not-found",
  "npm run verify"
]
```

同时在 `progress.md` 记录浏览器检查范围、最近验证和剩余 review 项。

- [ ] **Step 6: 提交 review 状态**

运行：

```powershell
git add feature_list.json progress.md
git commit -m "docs: move public prompt library launch to review"
```

## 10. Review 与完成门

进入 `completed` 前必须按仓库规则做两轮核对：

1. 规格符合性检查：
   - 首页、列表、详情、20 条内容、搜索筛选、复制、浏览计数是否逐项覆盖。
   - 未发布内容是否始终排除在公开读取之外。
   - 统计失败是否不阻塞主流程。
2. 代码质量检查：
   - 页面是否把查询规则重复堆进组件。
   - seed 内容和分类导入是否可维护。
   - 客户端复制反馈是否具备失败态。
   - 测试是否覆盖空态、未找到和查询组合。

review 问题修复后，再运行必要专项验证与 `npm run verify`，将 `feature_list.json` 和 `progress.md` 同步为完成状态。
