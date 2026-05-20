# Prompt Hub Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the verifiable foundation for Prompt Hub: Next.js app shell, harness docs, MySQL/Prisma schema, mock AI provider, auth utilities, rate-limit utilities, seed pipeline, and one unified verification command.

**Architecture:** This first implementation slice creates a working skeleton only. It does not implement the full public product, image upload workflow, or admin CRUD UI. The foundation must compile, test, and provide stable interfaces for follow-up implementation plans.

**Tech Stack:** Next.js App Router, TypeScript, MySQL, Prisma, Tailwind CSS, shadcn-compatible component structure, Vitest, bcryptjs, zod.

---

## Scope Check

The approved design covers several independent subsystems: public tool pages, AI image processing, prompt library, admin content management, and release-quality verification. This plan intentionally covers only the foundation subsystem so it can produce working, testable software on its own.

Separate follow-up plans should cover:

- Public pages and prompt library UI.
- Image-to-prompt real provider integration.
- Text generator flows.
- Admin login and CRUD pages.
- Full seed content with 20 reviewed prompts.

## File Structure

Create or modify these files during this plan:

```text
D:\aiproject\prompt-hub
|-- AGENTS.md
|-- progress.md
|-- feature_list.json
|-- package.json
|-- package-lock.json
|-- next.config.ts
|-- tsconfig.json
|-- eslint.config.mjs
|-- postcss.config.mjs
|-- vitest.config.ts
|-- app/
|   |-- layout.tsx
|   |-- page.tsx
|   |-- globals.css
|   |-- image-to-prompt/page.tsx
|   |-- generator/page.tsx
|   |-- prompts/page.tsx
|   |-- learn/page.tsx
|   `-- admin/page.tsx
|-- components/
|   `-- site/SiteHeader.tsx
|-- content/
|   `-- seed-prompts/foundation.json
|-- docs/
|   |-- product/mvp_spec.md
|   |-- testing/README.md
|   |-- architecture/decisions/0001-tech-stack.md
|   `-- features/M0-001-foundation.md
|-- lib/
|   |-- ai/types.ts
|   |-- ai/mock-provider.ts
|   |-- ai/provider.ts
|   |-- auth/password.ts
|   |-- db/prisma.ts
|   |-- rate-limit/rules.ts
|   `-- seed/load-seed-prompts.ts
|-- prisma/
|   |-- schema.prisma
|   `-- seed.ts
`-- tests/
    |-- ai/mock-provider.test.ts
    |-- auth/password.test.ts
    |-- rate-limit/rules.test.ts
    `-- seed/load-seed-prompts.test.ts
```

## Task 1: Scaffold Next.js App Shell

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `app/image-to-prompt/page.tsx`
- Create: `app/generator/page.tsx`
- Create: `app/prompts/page.tsx`
- Create: `app/learn/page.tsx`
- Create: `app/admin/page.tsx`
- Create: `components/site/SiteHeader.tsx`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`

- [ ] **Step 1: Create a temporary Next.js scaffold**

Run from `D:\aiproject`:

```powershell
npx create-next-app@latest prompt-hub-scaffold --typescript --tailwind --eslint --app --use-npm --no-src-dir --import-alias "@/*" --yes
```

Expected: a new temporary folder `D:\aiproject\prompt-hub-scaffold` is created with a working Next.js app.

- [ ] **Step 2: Copy scaffold files into the real project**

Run from `D:\aiproject`:

```powershell
$source = 'D:\aiproject\prompt-hub-scaffold'
$target = 'D:\aiproject\prompt-hub'
$items = @(
  'app',
  'public',
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'eslint.config.mjs',
  'postcss.config.mjs',
  '.gitignore'
)
foreach ($item in $items) {
  Copy-Item -LiteralPath (Join-Path $source $item) -Destination $target -Recurse -Force
}
```

Expected: the real project now contains Next.js app files while keeping existing `docs/` and `.git/`.

- [ ] **Step 3: Safely remove the temporary scaffold**

Run from `D:\aiproject`:

```powershell
$temp = Resolve-Path -LiteralPath 'D:\aiproject\prompt-hub-scaffold'
if ($temp.Path -ne 'D:\aiproject\prompt-hub-scaffold') {
  throw "Unexpected scaffold path: $($temp.Path)"
}
Remove-Item -LiteralPath $temp.Path -Recurse -Force
```

Expected: `D:\aiproject\prompt-hub-scaffold` is removed and `D:\aiproject\prompt-hub` remains intact.

- [ ] **Step 4: Replace the site header**

Create `components/site/SiteHeader.tsx`:

```tsx
import Link from "next/link";

const navItems = [
  { href: "/image-to-prompt", label: "图片转提示词" },
  { href: "/generator", label: "生成器" },
  { href: "/prompts", label: "提示词库" },
  { href: "/learn", label: "学习" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-slate-950">
          Prompt Hub
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
            管理后台
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Replace root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Prompt Hub",
  description: "中文优先的 AI 提示词工具型门户。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Replace homepage placeholder**

Replace `app/page.tsx`:

```tsx
import Link from "next/link";

const entries = [
  {
    href: "/image-to-prompt",
    title: "图片转提示词",
    description: "上传参考图，生成图像创作提示词和结构化拆解。",
  },
  {
    href: "/generator",
    title: "文本提示词生成器",
    description: "根据目标生成、优化或改写提示词。",
  },
  {
    href: "/prompts",
    title: "精选提示词库",
    description: "浏览 20 条高质量提示词和学习拆解。",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-indigo-600">AI Prompt Tool Portal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          查找、学习并生成更好的 AI 提示词
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Prompt Hub 将提示词库、学习拆解和 AI 生成工具放在一个中文优先的工具型门户中。
        </p>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-950">{entry.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{entry.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 7: Add route placeholders**

Create `app/image-to-prompt/page.tsx`:

```tsx
export default function ImageToPromptPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">图片转提示词</h1>
      <p className="mt-3 text-slate-600">图片上传、视觉分析和提示词生成将在后续计划中实现。</p>
    </div>
  );
}
```

Create `app/generator/page.tsx`:

```tsx
export default function GeneratorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">文本提示词生成器</h1>
      <p className="mt-3 text-slate-600">生成、优化和模板改写流程将在后续计划中实现。</p>
    </div>
  );
}
```

Create `app/prompts/page.tsx`:

```tsx
export default function PromptsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">精选提示词库</h1>
      <p className="mt-3 text-slate-600">提示词列表、搜索和筛选将在后续计划中实现。</p>
    </div>
  );
}
```

Create `app/learn/page.tsx`:

```tsx
export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">提示词学习</h1>
      <p className="mt-3 text-slate-600">提示词写法教程将在后续计划中实现。</p>
    </div>
  );
}
```

Create `app/admin/page.tsx`:

```tsx
export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">管理后台</h1>
      <p className="mt-3 text-slate-600">管理员登录和内容维护将在后续计划中实现。</p>
    </div>
  );
}
```

- [ ] **Step 8: Run build**

Run from `D:\aiproject\prompt-hub`:

```powershell
npm run build
```

Expected: Next.js production build completes successfully.

- [ ] **Step 9: Commit scaffold**

Run from `D:\aiproject\prompt-hub`:

```powershell
git add app components package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs .gitignore
git commit -m "feat: scaffold prompt hub app shell"
```

Expected: commit succeeds.

## Task 2: Add Harness Documentation

**Files:**
- Create: `AGENTS.md`
- Create: `progress.md`
- Create: `feature_list.json`
- Create: `docs/product/mvp_spec.md`
- Create: `docs/testing/README.md`
- Create: `docs/architecture/decisions/0001-tech-stack.md`
- Create: `docs/features/M0-001-foundation.md`

- [ ] **Step 1: Create AGENTS.md**

Create `AGENTS.md`:

```markdown
# Prompt Hub Agent 工作规则

## Project Overview

- 当前模式：project
- 项目名称：Prompt Hub
- 项目类型：AI 提示词工具型门户
- 核心功能：提供提示词库、学习拆解、文本提示词生成和图片转提示词工具。
- 技术栈：Next.js App Router、TypeScript、MySQL、Prisma、Tailwind CSS、Vitest。
- 源代码位置：app/、components/、lib/、prisma/。

## Startup Protocol

每个 Agent 开始工作前必须读取：

1. `AGENTS.md`
2. `progress.md`
3. `feature_list.json`
4. 当前任务相关的 `docs/features/*.md`
5. 当前计划相关的 `docs/superpowers/plans/*.md`

## Scope Rules

- 未经用户确认，不扩展 v0.1 范围。
- 图片上传只允许临时处理，不允许长期保存。
- 普通用户保持免登录。
- 管理员后台只做单管理员账号密码登录。
- 所有代码变更必须通过 `npm run verify`。

## Documentation Rules

面向人的项目文档默认使用中文。代码标识符、路径、命令、环境变量和 API 字段可以使用英文。
```

- [ ] **Step 2: Create progress.md**

Create `progress.md`:

```markdown
# Prompt Hub 进度记录

最后更新：2026-05-20

## 当前阶段

`foundation-planning`

## 当前目标

完成 Prompt Hub v0.1 的基础工程骨架：Next.js 应用、harness 文档、MySQL/Prisma schema、mock AI provider、认证和限流基础工具、统一验证命令。

## 已完成事项

- 已确认中文设计规格：`docs/superpowers/specs/2026-05-20-prompt-hub-design.zh-CN.md`。
- 已确认第一份实施计划范围：Foundation。

## 下一步

按 `docs/superpowers/plans/2026-05-20-prompt-hub-foundation.md` 执行基础工程实现。
```

- [ ] **Step 3: Create feature_list.json**

Create `feature_list.json`:

```json
{
  "project": "Prompt Hub",
  "stage": "foundation-planning",
  "last_updated": "2026-05-20",
  "tasks": [
    {
      "id": "M0-001",
      "name": "基础工程骨架",
      "status": "planned",
      "files": [
        "AGENTS.md",
        "progress.md",
        "feature_list.json",
        "app/**",
        "components/**",
        "lib/**",
        "prisma/**",
        "tests/**"
      ]
    }
  ]
}
```

- [ ] **Step 4: Create MVP spec**

Create `docs/product/mvp_spec.md`:

```markdown
# Prompt Hub MVP 规格

## MVP 目标

v0.1 构建一个中文优先的 AI 提示词工具型门户，支持公开用户浏览精选提示词、学习提示词结构、使用文本生成器，并通过图片转提示词工具生成图像创作提示词。

## v0.1 包含

- 工具型首页。
- 图片转提示词页。
- 文本提示词生成器。
- 20 条精选提示词库。
- 提示词详情和学习拆解。
- 管理员登录和内容维护。
- 文件种子数据导入。
- IP 限流。

## v0.1 不包含

- 普通用户账号。
- 收藏、评论、评分。
- 付费。
- 图片长期保存。
- 社区发布。
- 向量搜索。
```

- [ ] **Step 5: Create testing guide**

Create `docs/testing/README.md`:

```markdown
# 测试与质量门禁

## 统一验证命令

```bash
npm run verify
```

## Foundation 阶段必须覆盖

- lint
- Prisma schema validation
- Prisma client generation
- typecheck
- unit tests
- production build

## 预期命令

```bash
npm run lint
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run test
npm run build
```
```

- [ ] **Step 6: Create architecture decision**

Create `docs/architecture/decisions/0001-tech-stack.md`:

```markdown
# ADR 0001: 技术栈选择

日期：2026-05-20

## 决策

Prompt Hub v0.1 使用 Next.js App Router、TypeScript、MySQL、Prisma、Tailwind CSS、Vitest。

## 原因

- 项目是内容型工具网站，需要 SEO 友好的页面结构。
- Next.js 可以在一个项目中承载前台页面、后台页面和 API。
- MySQL 符合用户偏好，也适合 v0.1 的关系型数据。
- Prisma 让 schema、迁移和 seed 脚本更清晰，适合 Agent 协作维护。

## 取舍

- 不采用 Vue + Spring Boot，因为第一版会更重。
- 不采用 SQLite，因为目标是公开网站和后台维护。
- 不采用 PostgreSQL，因为第一版没有向量搜索或复杂 JSON 查询需求。
```

- [ ] **Step 7: Create foundation feature card**

Create `docs/features/M0-001-foundation.md`:

```markdown
# M0-001 基础工程骨架

## 功能目标

建立 Prompt Hub 的可验证工程基础，为后续公开页面、AI 工具、提示词库和管理后台提供稳定骨架。

## 范围

- Next.js 应用骨架。
- Harness 文档。
- Prisma schema。
- seed 数据加载结构。
- mock AI provider。
- 密码工具。
- 限流工具。
- Vitest 单元测试。
- 统一 `npm run verify` 命令。

## 不做范围

- 完整图片上传识图流程。
- 完整提示词库 UI。
- 完整管理员 CRUD。
- 真实 AI provider 调用。
- 20 条完整种子提示词。

## 验收标准

- `npm run verify` 通过。
- `npx prisma validate` 通过。
- 关键工具函数有单元测试。
- 首页和占位路由可生产构建。
```

- [ ] **Step 8: Commit harness docs**

Run from `D:\aiproject\prompt-hub`:

```powershell
git add AGENTS.md progress.md feature_list.json docs/product/mvp_spec.md docs/testing/README.md docs/architecture/decisions/0001-tech-stack.md docs/features/M0-001-foundation.md
git commit -m "docs: add foundation harness"
```

Expected: commit succeeds.

## Task 3: Add Prisma MySQL Schema and Seed Loader

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/db/prisma.ts`
- Create: `lib/seed/load-seed-prompts.ts`
- Create: `content/seed-prompts/foundation.json`
- Test: `tests/seed/load-seed-prompts.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Prisma and support dependencies**

Run from `D:\aiproject\prompt-hub`:

```powershell
npm install @prisma/client bcryptjs zod
npm install -D prisma tsx vitest @types/bcryptjs
```

Expected: dependencies are added to `package.json` and `package-lock.json`.

- [ ] **Step 2: Create Prisma schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model AdminUser {
  id           String   @id @default(cuid())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Category {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String   @db.Text
  sortOrder   Int      @default(0)
  prompts     Prompt[]
}

model Tag {
  id      String      @id @default(cuid())
  slug    String      @unique
  name    String
  prompts PromptTag[]
}

model Prompt {
  id                         String      @id @default(cuid())
  slug                       String      @unique
  title                      String
  summary                    String      @db.Text
  content                    String      @db.Text
  exampleInput               String      @db.Text
  exampleOutput              String      @db.Text
  structureRole              String      @db.Text
  structureTask              String      @db.Text
  structureContext           String      @db.Text
  structureConstraints       String      @db.Text
  structureOutputFormat      String      @db.Text
  weakPrompt                 String      @db.Text
  improvedPrompt             String      @db.Text
  improvementNotes           String      @db.Text
  language                   String      @default("zh-CN")
  status                     PromptStatus @default(DRAFT)
  isFeatured                 Boolean     @default(false)
  copyCount                  Int         @default(0)
  viewCount                  Int         @default(0)
  categoryId                 String
  category                   Category    @relation(fields: [categoryId], references: [id])
  tags                       PromptTag[]
  createdAt                  DateTime    @default(now())
  updatedAt                  DateTime    @updatedAt
}

model PromptTag {
  promptId String
  tagId    String
  prompt   Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
  tag      Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([promptId, tagId])
}

model GenerationRecord {
  id                String         @id @default(cuid())
  type              GenerationType
  inputSummary      String         @db.Text
  outputPrompt      String         @db.Text
  outputJson        String?        @db.LongText
  outputExplanation String         @db.Text
  language          String         @default("zh-CN")
  providerName      String
  modelName         String
  ipHash            String
  createdAt         DateTime       @default(now())
}

model RateLimitBucket {
  id        String   @id @default(cuid())
  key       String   @unique
  count     Int      @default(0)
  resetAt   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum PromptStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum GenerationType {
  TEXT_GENERATE
  TEXT_OPTIMIZE
  TEMPLATE_REWRITE
  IMAGE_TO_PROMPT
  DESIGN_ANALYSIS
}
```

- [ ] **Step 3: Add seed prompt file**

Create `content/seed-prompts/foundation.json`:

```json
[
  {
    "slug": "meeting-summary-assistant",
    "title": "会议纪要整理助手",
    "summary": "把杂乱会议记录整理为结构清晰的纪要、行动项和风险提醒。",
    "category": "office",
    "tags": ["summary", "work"],
    "content": "你是一名专业会议纪要助手。请根据我提供的会议记录，整理出会议主题、关键结论、行动项、负责人、截止时间和风险提醒。输出使用 Markdown 表格和分节标题。",
    "exampleInput": "今天讨论了新版首页上线计划，设计周三给最终稿，前端周五完成首版，后端接口还有两个字段未确认。",
    "exampleOutput": "## 会议主题\n新版首页上线计划\n\n## 行动项\n| 事项 | 负责人 | 截止时间 |\n| --- | --- | --- |\n| 提供最终设计稿 | 设计 | 周三 |\n| 完成前端首版 | 前端 | 周五 |",
    "structureRole": "专业会议纪要助手",
    "structureTask": "整理会议主题、关键结论、行动项和风险提醒",
    "structureContext": "用户提供原始会议记录",
    "structureConstraints": "必须用 Markdown，行动项要包含负责人和截止时间",
    "structureOutputFormat": "分节标题和 Markdown 表格",
    "weakPrompt": "帮我总结会议。",
    "improvedPrompt": "你是一名专业会议纪要助手。请根据我提供的会议记录，整理出会议主题、关键结论、行动项、负责人、截止时间和风险提醒。输出使用 Markdown 表格和分节标题。",
    "improvementNotes": "优化版明确了角色、任务、字段和输出格式，因此结果更稳定。",
    "language": "zh-CN",
    "isFeatured": true
  }
]
```

- [ ] **Step 4: Write seed loader test first**

Create `tests/seed/load-seed-prompts.test.ts`:

```ts
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
});
```

- [ ] **Step 5: Run seed loader test to verify it fails**

Run from `D:\aiproject\prompt-hub`:

```powershell
npx vitest run tests/seed/load-seed-prompts.test.ts
```

Expected: fail because `@/lib/seed/load-seed-prompts` does not exist.

- [ ] **Step 6: Implement seed loader**

Create `lib/seed/load-seed-prompts.ts`:

```ts
import { readFile } from "node:fs/promises";
import { z } from "zod";

const seedPromptSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)),
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
});

export type SeedPrompt = z.infer<typeof seedPromptSchema>;

export async function loadSeedPrompts(path: string): Promise<SeedPrompt[]> {
  const raw = await readFile(path, "utf8");
  const data = JSON.parse(raw);
  return z.array(seedPromptSchema).parse(data);
}
```

- [ ] **Step 7: Add Prisma client singleton**

Create `lib/db/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 8: Add seed script**

Create `prisma/seed.ts`:

```ts
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/prisma";
import { loadSeedPrompts } from "../lib/seed/load-seed-prompts";

async function main() {
  const password = process.env.ADMIN_INITIAL_PASSWORD ?? "prompt-hub-admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: "office" },
    update: {
      name: "办公效率",
      description: "会议、汇报、总结、邮件和日常办公提示词。",
      sortOrder: 10,
    },
    create: {
      slug: "office",
      name: "办公效率",
      description: "会议、汇报、总结、邮件和日常办公提示词。",
      sortOrder: 10,
    },
  });

  const prompts = await loadSeedPrompts("content/seed-prompts/foundation.json");

  for (const prompt of prompts) {
    const createdPrompt = await prisma.prompt.upsert({
      where: { slug: prompt.slug },
      update: {
        title: prompt.title,
        summary: prompt.summary,
        content: prompt.content,
        exampleInput: prompt.exampleInput,
        exampleOutput: prompt.exampleOutput,
        structureRole: prompt.structureRole,
        structureTask: prompt.structureTask,
        structureContext: prompt.structureContext,
        structureConstraints: prompt.structureConstraints,
        structureOutputFormat: prompt.structureOutputFormat,
        weakPrompt: prompt.weakPrompt,
        improvedPrompt: prompt.improvedPrompt,
        improvementNotes: prompt.improvementNotes,
        language: prompt.language,
        isFeatured: prompt.isFeatured,
        status: "PUBLISHED",
        categoryId: category.id,
      },
      create: {
        slug: prompt.slug,
        title: prompt.title,
        summary: prompt.summary,
        content: prompt.content,
        exampleInput: prompt.exampleInput,
        exampleOutput: prompt.exampleOutput,
        structureRole: prompt.structureRole,
        structureTask: prompt.structureTask,
        structureContext: prompt.structureContext,
        structureConstraints: prompt.structureConstraints,
        structureOutputFormat: prompt.structureOutputFormat,
        weakPrompt: prompt.weakPrompt,
        improvedPrompt: prompt.improvedPrompt,
        improvementNotes: prompt.improvementNotes,
        language: prompt.language,
        isFeatured: prompt.isFeatured,
        status: "PUBLISHED",
        categoryId: category.id,
      },
    });

    for (const tagSlug of prompt.tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name: tagSlug },
        create: { slug: tagSlug, name: tagSlug },
      });

      await prisma.promptTag.upsert({
        where: {
          promptId_tagId: {
            promptId: createdPrompt.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          promptId: createdPrompt.id,
          tagId: tag.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 9: Update package scripts**

Modify `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "prisma:validate": "prisma validate",
    "prisma:generate": "prisma generate",
    "prisma:seed": "tsx prisma/seed.ts",
    "verify": "npm run lint && npm run prisma:validate && npm run prisma:generate && npm run typecheck && npm run test && npm run build"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Preserve existing dependencies and devDependencies from the scaffold and installs.

- [ ] **Step 10: Run test and Prisma validation**

Run from `D:\aiproject\prompt-hub`:

```powershell
npx vitest run tests/seed/load-seed-prompts.test.ts
npx prisma validate
```

Expected: both commands pass.

- [ ] **Step 11: Commit Prisma foundation**

Run from `D:\aiproject\prompt-hub`:

```powershell
git add package.json package-lock.json prisma lib/db lib/seed content/seed-prompts tests/seed
git commit -m "feat: add prisma schema and seed loader"
```

Expected: commit succeeds.

## Task 4: Add AI Provider Foundation

**Files:**
- Create: `lib/ai/types.ts`
- Create: `lib/ai/mock-provider.ts`
- Create: `lib/ai/provider.ts`
- Test: `tests/ai/mock-provider.test.ts`

- [ ] **Step 1: Write mock provider test first**

Create `tests/ai/mock-provider.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createMockAIProvider } from "@/lib/ai/mock-provider";

describe("createMockAIProvider", () => {
  it("generates deterministic text prompt output", async () => {
    const provider = createMockAIProvider();

    const result = await provider.generateTextPrompt({
      goal: "写一个会议纪要提示词",
      language: "zh-CN",
    });

    expect(result.naturalPrompt).toContain("写一个会议纪要提示词");
    expect(result.explanation).toContain("mock");
  });

  it("generates deterministic image prompt output without storing images", async () => {
    const provider = createMockAIProvider();

    const result = await provider.generatePromptFromImage({
      imageBase64: "ZmFrZS1pbWFnZQ==",
      mimeType: "image/png",
      mode: "image-generation",
      language: "en",
    });

    expect(result.naturalPrompt).toContain("reference image");
    expect(result.jsonBlueprint).toMatchObject({
      source: "mock-vision",
      mode: "image-generation",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run from `D:\aiproject\prompt-hub`:

```powershell
npx vitest run tests/ai/mock-provider.test.ts
```

Expected: fail because `@/lib/ai/mock-provider` does not exist.

- [ ] **Step 3: Create AI types**

Create `lib/ai/types.ts`:

```ts
export type PromptLanguage = "zh-CN" | "en" | "bilingual";

export type ImagePromptMode = "image-generation" | "design-analysis";

export interface TextPromptInput {
  goal: string;
  language: PromptLanguage;
}

export interface OptimizePromptInput {
  originalPrompt: string;
  goal?: string;
  language: PromptLanguage;
}

export interface TemplateRewriteInput {
  template: string;
  variables: Record<string, string>;
  language: PromptLanguage;
}

export interface ImagePromptInput {
  imageBase64: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  mode: ImagePromptMode;
  language: PromptLanguage;
}

export interface TextPromptResult {
  naturalPrompt: string;
  explanation: string;
}

export interface ImagePromptResult {
  naturalPrompt: string;
  jsonBlueprint: Record<string, unknown>;
  chineseExplanation: string;
}

export interface AIProvider {
  name: string;
  modelName: string;
  generateTextPrompt(input: TextPromptInput): Promise<TextPromptResult>;
  optimizePrompt(input: OptimizePromptInput): Promise<TextPromptResult>;
  rewriteWithTemplate(input: TemplateRewriteInput): Promise<TextPromptResult>;
  generatePromptFromImage(input: ImagePromptInput): Promise<ImagePromptResult>;
  analyzeDesignFromImage(input: ImagePromptInput): Promise<ImagePromptResult>;
}
```

- [ ] **Step 4: Create mock provider**

Create `lib/ai/mock-provider.ts`:

```ts
import type {
  AIProvider,
  ImagePromptInput,
  ImagePromptResult,
  OptimizePromptInput,
  TemplateRewriteInput,
  TextPromptInput,
  TextPromptResult,
} from "./types";

function textResult(topic: string): TextPromptResult {
  return {
    naturalPrompt: `你是一名专业提示词工程助手。请围绕“${topic}”生成结构清晰、目标明确、包含上下文和输出格式的提示词。`,
    explanation: "这是 mock provider 返回的稳定结果，用于本地开发和自动化测试。",
  };
}

function imageResult(input: ImagePromptInput): ImagePromptResult {
  return {
    naturalPrompt:
      input.mode === "design-analysis"
        ? "Analyze the uploaded reference image as a visual design. Describe layout, hierarchy, color, typography, spacing, and improvement opportunities."
        : "Create a high-quality image generation prompt based on the uploaded reference image, describing subject, composition, lighting, style, color palette, and camera details.",
    jsonBlueprint: {
      source: "mock-vision",
      mode: input.mode,
      mimeType: input.mimeType,
      language: input.language,
    },
    chineseExplanation: "这是 mock 视觉分析结果，用于验证图片转提示词流程，不代表真实识图。",
  };
}

export function createMockAIProvider(): AIProvider {
  return {
    name: "mock",
    modelName: "mock-model",
    generateTextPrompt(input: TextPromptInput) {
      return Promise.resolve(textResult(input.goal));
    },
    optimizePrompt(input: OptimizePromptInput) {
      return Promise.resolve(textResult(input.goal ?? input.originalPrompt));
    },
    rewriteWithTemplate(input: TemplateRewriteInput) {
      return Promise.resolve(textResult(Object.values(input.variables).join("，") || input.template));
    },
    generatePromptFromImage(input: ImagePromptInput) {
      return Promise.resolve(imageResult(input));
    },
    analyzeDesignFromImage(input: ImagePromptInput) {
      return Promise.resolve(imageResult({ ...input, mode: "design-analysis" }));
    },
  };
}
```

- [ ] **Step 5: Create provider factory**

Create `lib/ai/provider.ts`:

```ts
import { createMockAIProvider } from "./mock-provider";
import type { AIProvider } from "./types";

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "mock") {
    return createMockAIProvider();
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}
```

- [ ] **Step 6: Run AI tests**

Run from `D:\aiproject\prompt-hub`:

```powershell
npx vitest run tests/ai/mock-provider.test.ts
```

Expected: tests pass.

- [ ] **Step 7: Commit AI foundation**

Run from `D:\aiproject\prompt-hub`:

```powershell
git add lib/ai tests/ai
git commit -m "feat: add mock ai provider foundation"
```

Expected: commit succeeds.

## Task 5: Add Auth and Rate-Limit Utilities

**Files:**
- Create: `lib/auth/password.ts`
- Create: `lib/rate-limit/rules.ts`
- Test: `tests/auth/password.test.ts`
- Test: `tests/rate-limit/rules.test.ts`

- [ ] **Step 1: Write password utility test first**

Create `tests/auth/password.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password utilities", () => {
  it("verifies a matching password and rejects a wrong password", async () => {
    const hash = await hashPassword("correct-password");

    await expect(verifyPassword("correct-password", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });
});
```

- [ ] **Step 2: Write rate limit rules test first**

Create `tests/rate-limit/rules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildRateLimitKey, isWithinLimit } from "@/lib/rate-limit/rules";

describe("rate limit rules", () => {
  it("builds a stable key without storing the raw IP", () => {
    const key = buildRateLimitKey({
      ip: "127.0.0.1",
      type: "text",
      date: "2026-05-20",
    });

    expect(key).toContain("text:2026-05-20:");
    expect(key).not.toContain("127.0.0.1");
  });

  it("allows requests below the limit and rejects requests at the limit", () => {
    expect(isWithinLimit({ currentCount: 9, limit: 10 })).toBe(true);
    expect(isWithinLimit({ currentCount: 10, limit: 10 })).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run from `D:\aiproject\prompt-hub`:

```powershell
npx vitest run tests/auth/password.test.ts tests/rate-limit/rules.test.ts
```

Expected: fail because auth and rate-limit modules do not exist.

- [ ] **Step 4: Implement password utilities**

Create `lib/auth/password.ts`:

```ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
```

- [ ] **Step 5: Implement rate limit rules**

Create `lib/rate-limit/rules.ts`:

```ts
import { createHash } from "node:crypto";

export type RateLimitType = "text" | "image";

export interface RateLimitKeyInput {
  ip: string;
  type: RateLimitType;
  date: string;
}

export interface LimitCheckInput {
  currentCount: number;
  limit: number;
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export function buildRateLimitKey(input: RateLimitKeyInput): string {
  return `${input.type}:${input.date}:${hashIp(input.ip)}`;
}

export function isWithinLimit(input: LimitCheckInput): boolean {
  return input.currentCount < input.limit;
}

export function getDailyLimit(type: RateLimitType): number {
  if (type === "image") {
    return Number(process.env.RATE_LIMIT_IMAGE_DAILY ?? 3);
  }
  return Number(process.env.RATE_LIMIT_TEXT_DAILY ?? 10);
}
```

- [ ] **Step 6: Run auth and rate-limit tests**

Run from `D:\aiproject\prompt-hub`:

```powershell
npx vitest run tests/auth/password.test.ts tests/rate-limit/rules.test.ts
```

Expected: tests pass.

- [ ] **Step 7: Commit utilities**

Run from `D:\aiproject\prompt-hub`:

```powershell
git add lib/auth lib/rate-limit tests/auth tests/rate-limit
git commit -m "feat: add auth and rate limit utilities"
```

Expected: commit succeeds.

## Task 6: Add Vitest Configuration and Unified Verify

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `docs/testing/README.md`
- Modify: `progress.md`
- Modify: `feature_list.json`

- [ ] **Step 1: Create Vitest config**

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
```

- [ ] **Step 2: Confirm package scripts**

Ensure `package.json` scripts include exactly these command names:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "prisma:validate": "prisma validate",
  "prisma:generate": "prisma generate",
  "prisma:seed": "tsx prisma/seed.ts",
  "verify": "npm run lint && npm run prisma:validate && npm run prisma:generate && npm run typecheck && npm run test && npm run build"
}
```

If the scaffold generated additional scripts, preserve them only if they do not replace these names.

- [ ] **Step 3: Run unified verification**

Run from `D:\aiproject\prompt-hub`:

```powershell
npm run verify
```

Expected: lint, typecheck, tests, Prisma validation, and build all pass.

- [ ] **Step 4: Update progress**

Modify `progress.md` to:

```markdown
# Prompt Hub 进度记录

最后更新：2026-05-20

## 当前阶段

`foundation-completed`

## 当前目标

Prompt Hub 基础工程骨架已完成。下一步可以进入公开页面与提示词库实现计划。

## 已完成事项

- 已确认中文设计规格：`docs/superpowers/specs/2026-05-20-prompt-hub-design.zh-CN.md`。
- 已完成 Next.js 应用骨架。
- 已完成 harness 文档。
- 已完成 Prisma MySQL schema。
- 已完成 seed 数据加载结构。
- 已完成 mock AI provider。
- 已完成密码工具和限流规则工具。
- 已完成 Vitest 单元测试。
- `npm run verify` 已通过。

## 下一步

创建公开页面与提示词库实施计划。
```

- [ ] **Step 5: Update feature list**

Modify `feature_list.json` to:

```json
{
  "project": "Prompt Hub",
  "stage": "foundation-completed",
  "last_updated": "2026-05-20",
  "tasks": [
    {
      "id": "M0-001",
      "name": "基础工程骨架",
      "status": "completed",
      "files": [
        "AGENTS.md",
        "progress.md",
        "feature_list.json",
        "app/**",
        "components/**",
        "lib/**",
        "prisma/**",
        "tests/**"
      ],
      "verification": "npm run verify"
    }
  ]
}
```

- [ ] **Step 6: Commit verification updates**

Run from `D:\aiproject\prompt-hub`:

```powershell
git add vitest.config.ts package.json package-lock.json docs/testing/README.md progress.md feature_list.json
git commit -m "chore: add foundation verification"
```

Expected: commit succeeds.

## Final Verification

- [ ] **Step 1: Check repository status**

Run from `D:\aiproject\prompt-hub`:

```powershell
git status --short
```

Expected: no unexpected uncommitted changes.

- [ ] **Step 2: Run final verification**

Run from `D:\aiproject\prompt-hub`:

```powershell
npm run verify
```

Expected: all checks pass.

- [ ] **Step 3: Record completion**

If all checks pass, the Foundation slice is complete and the next implementation plan should target public pages and prompt library UI.
