# Prompt Hub Foundation 中文实施计划

> **给所有 Agent 的说明：** 这份计划不是 Codex 专用。Codex、Claude Code、Gemini CLI、Cursor、Copilot CLI 或其他 coding agent 都可以执行。执行时按任务顺序推进，每个任务完成后运行对应验证命令并提交。若平台没有 `superpowers` 技能，就把文中的流程要求理解为普通工程约束：先读规格、按任务执行、运行测试、提交、再进入下一步。

**目标：** 建立 Prompt Hub 的可验证基础工程：Next.js 应用骨架、harness 文档、MySQL/Prisma schema、mock AI provider、认证工具、限流工具、seed 加载和统一验证命令。

**架构：** 本计划只做 Foundation，不实现完整前台页面、真实图片识图、后台 CRUD 或 20 条完整内容。完成后项目应能构建、测试，并为后续公开页面、AI 工具和后台管理提供稳定接口。

**技术栈：** Next.js App Router、TypeScript、MySQL、Prisma、Tailwind CSS、Vitest、bcryptjs、zod。

---

## 0. 执行原则

- 执行前阅读：
  - `docs/superpowers/specs/2026-05-20-prompt-hub-design.zh-CN.md`
  - `docs/superpowers/plans/2026-05-20-prompt-hub-foundation.zh-CN.md`
- 不扩展 v0.1 范围。
- 不实现本计划未包含的完整页面、真实 AI provider 或后台 CRUD。
- 每个任务完成后独立提交。
- 所有代码变更最终必须通过 `npm run verify`。
- 若使用其他 Agent，可直接把单个任务全文发送给该 Agent 执行，不要求它读取整段对话历史。

## 1. 文件结构

本计划会创建或修改：

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

## 2. 任务一：创建 Next.js 应用骨架

### 涉及文件

- 创建：`app/layout.tsx`
- 创建：`app/page.tsx`
- 创建：`app/globals.css`
- 创建：`app/image-to-prompt/page.tsx`
- 创建：`app/generator/page.tsx`
- 创建：`app/prompts/page.tsx`
- 创建：`app/learn/page.tsx`
- 创建：`app/admin/page.tsx`
- 创建：`components/site/SiteHeader.tsx`
- 创建：`package.json`
- 创建：`package-lock.json`
- 创建：`next.config.ts`
- 创建：`tsconfig.json`
- 创建：`eslint.config.mjs`
- 创建：`postcss.config.mjs`

### 步骤

- [ ] 创建临时 Next.js scaffold。

在 `D:\aiproject` 运行：

```powershell
npx create-next-app@latest prompt-hub-scaffold --typescript --tailwind --eslint --app --use-npm --no-src-dir --import-alias "@/*" --yes
```

预期：生成 `D:\aiproject\prompt-hub-scaffold`。

- [ ] 复制 scaffold 文件到真实项目。

在 `D:\aiproject` 运行：

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

- [ ] 删除临时 scaffold。

```powershell
$temp = Resolve-Path -LiteralPath 'D:\aiproject\prompt-hub-scaffold'
if ($temp.Path -ne 'D:\aiproject\prompt-hub-scaffold') {
  throw "Unexpected scaffold path: $($temp.Path)"
}
Remove-Item -LiteralPath $temp.Path -Recurse -Force
```

- [ ] 创建 `components/site/SiteHeader.tsx`。

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

- [ ] 替换 `app/layout.tsx`。

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

- [ ] 替换 `app/page.tsx`。

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

- [ ] 创建占位页面。

`app/image-to-prompt/page.tsx`：

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

`app/generator/page.tsx`：

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

`app/prompts/page.tsx`：

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

`app/learn/page.tsx`：

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

`app/admin/page.tsx`：

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

- [ ] 构建验证。

```powershell
npm run build
```

- [ ] 提交。

```powershell
git add app components package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs .gitignore
git commit -m "feat: scaffold prompt hub app shell"
```

## 3. 任务二：添加 Harness 文档

### 涉及文件

- 创建：`AGENTS.md`
- 创建：`progress.md`
- 创建：`feature_list.json`
- 创建：`docs/product/mvp_spec.md`
- 创建：`docs/testing/README.md`
- 创建：`docs/architecture/decisions/0001-tech-stack.md`
- 创建：`docs/features/M0-001-foundation.md`

### 步骤

- [ ] 创建 `AGENTS.md`。

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

- [ ] 创建 `progress.md`。

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

按 `docs/superpowers/plans/2026-05-20-prompt-hub-foundation.zh-CN.md` 执行基础工程实现。
```

- [ ] 创建 `feature_list.json`。

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

- [ ] 创建 `docs/product/mvp_spec.md`。

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

- [ ] 创建 `docs/testing/README.md`。

````markdown
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
````

- [ ] 创建 `docs/architecture/decisions/0001-tech-stack.md`。

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

- [ ] 创建 `docs/features/M0-001-foundation.md`。

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

- [ ] 提交。

```powershell
git add AGENTS.md progress.md feature_list.json docs/product/mvp_spec.md docs/testing/README.md docs/architecture/decisions/0001-tech-stack.md docs/features/M0-001-foundation.md
git commit -m "docs: add foundation harness"
```

## 4. 任务三：添加 Prisma MySQL Schema 和 Seed Loader

### 涉及文件

- 创建：`prisma/schema.prisma`
- 创建：`prisma/seed.ts`
- 创建：`lib/db/prisma.ts`
- 创建：`lib/seed/load-seed-prompts.ts`
- 创建：`content/seed-prompts/foundation.json`
- 创建测试：`tests/seed/load-seed-prompts.test.ts`
- 修改：`package.json`

### 步骤

- [ ] 安装依赖。

```powershell
npm install @prisma/client bcryptjs zod
npm install -D prisma tsx vitest @types/bcryptjs
```

- [ ] 创建 `prisma/schema.prisma`。

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
  id                    String       @id @default(cuid())
  slug                  String       @unique
  title                 String
  summary               String       @db.Text
  content               String       @db.Text
  exampleInput          String       @db.Text
  exampleOutput         String       @db.Text
  structureRole         String       @db.Text
  structureTask         String       @db.Text
  structureContext      String       @db.Text
  structureConstraints  String       @db.Text
  structureOutputFormat String       @db.Text
  weakPrompt            String       @db.Text
  improvedPrompt        String       @db.Text
  improvementNotes      String       @db.Text
  language              String       @default("zh-CN")
  status                PromptStatus @default(DRAFT)
  isFeatured            Boolean      @default(false)
  copyCount             Int          @default(0)
  viewCount             Int          @default(0)
  categoryId            String
  category              Category     @relation(fields: [categoryId], references: [id])
  tags                  PromptTag[]
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
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

- [ ] 创建 `content/seed-prompts/foundation.json`。

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

- [ ] 先写测试 `tests/seed/load-seed-prompts.test.ts`。

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

- [ ] 运行失败测试。

```powershell
npx vitest run tests/seed/load-seed-prompts.test.ts
```

预期：失败，因为 loader 尚未实现。

- [ ] 创建 `lib/seed/load-seed-prompts.ts`。

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

- [ ] 创建 `lib/db/prisma.ts`。

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

- [ ] 创建 `prisma/seed.ts`。

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
    create: { username: "admin", passwordHash },
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

- [ ] 更新 `package.json` scripts。

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

- [ ] 验证。

```powershell
npx vitest run tests/seed/load-seed-prompts.test.ts
npx prisma validate
```

- [ ] 提交。

```powershell
git add package.json package-lock.json prisma lib/db lib/seed content/seed-prompts tests/seed
git commit -m "feat: add prisma schema and seed loader"
```

## 5. 任务四：添加 AI Provider Foundation

### 涉及文件

- 创建：`lib/ai/types.ts`
- 创建：`lib/ai/mock-provider.ts`
- 创建：`lib/ai/provider.ts`
- 创建测试：`tests/ai/mock-provider.test.ts`

### 步骤

- [ ] 先写测试 `tests/ai/mock-provider.test.ts`。

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

- [ ] 运行失败测试。

```powershell
npx vitest run tests/ai/mock-provider.test.ts
```

- [ ] 创建 `lib/ai/types.ts`。

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

- [ ] 创建 `lib/ai/mock-provider.ts`。

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

- [ ] 创建 `lib/ai/provider.ts`。

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

- [ ] 验证并提交。

```powershell
npx vitest run tests/ai/mock-provider.test.ts
git add lib/ai tests/ai
git commit -m "feat: add mock ai provider foundation"
```

## 6. 任务五：添加认证和限流工具

### 涉及文件

- 创建：`lib/auth/password.ts`
- 创建：`lib/rate-limit/rules.ts`
- 创建测试：`tests/auth/password.test.ts`
- 创建测试：`tests/rate-limit/rules.test.ts`

### 步骤

- [ ] 写 `tests/auth/password.test.ts`。

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

- [ ] 写 `tests/rate-limit/rules.test.ts`。

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

- [ ] 运行失败测试。

```powershell
npx vitest run tests/auth/password.test.ts tests/rate-limit/rules.test.ts
```

- [ ] 创建 `lib/auth/password.ts`。

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

- [ ] 创建 `lib/rate-limit/rules.ts`。

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

- [ ] 验证并提交。

```powershell
npx vitest run tests/auth/password.test.ts tests/rate-limit/rules.test.ts
git add lib/auth lib/rate-limit tests/auth tests/rate-limit
git commit -m "feat: add auth and rate limit utilities"
```

## 7. 任务六：添加 Vitest 配置和统一验证

### 涉及文件

- 创建：`vitest.config.ts`
- 修改：`package.json`
- 修改：`docs/testing/README.md`
- 修改：`progress.md`
- 修改：`feature_list.json`

### 步骤

- [ ] 创建 `vitest.config.ts`。

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

- [ ] 确认 `package.json` scripts。

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

- [ ] 运行统一验证。

```powershell
npm run verify
```

- [ ] 更新 `progress.md` 为完成状态。

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

- [ ] 更新 `feature_list.json`。

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

- [ ] 提交。

```powershell
git add vitest.config.ts package.json package-lock.json docs/testing/README.md progress.md feature_list.json
git commit -m "chore: add foundation verification"
```

## 8. 最终验证

- [ ] 查看状态。

```powershell
git status --short
```

预期：没有意外未提交变更。

- [ ] 运行最终验证。

```powershell
npm run verify
```

预期：全部通过。

- [ ] 完成判定。

如果最终验证通过，Foundation 阶段完成。下一份实施计划应进入公开页面和提示词库 UI。
