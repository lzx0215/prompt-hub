# Prompt Hub 中文设计规格

## 1. 产品定位

Prompt Hub 是一个中文优先的 AI 提示词工具型门户。它帮助公开用户查找精选提示词、学习优秀提示词为什么有效，并使用 AI 生成或优化提示词。v0.1 最有差异化的工具是“图片转提示词”：用户上传参考图片后，系统返回图像生成提示词、结构化 JSON 描述和中文解释。

产品整体不做成宽泛的社区，而是做成聚焦的工具站。布局方向采用前期讨论确认的工具型落地页模式：首屏直接提供可操作工具，下方承接学习内容、SEO 解释、FAQ 和相关工具入口。

## 2. 目标用户

### 公开用户

公开用户不需要注册或登录。可以使用：

- 浏览精选提示词。
- 搜索和筛选提示词。
- 复制提示词。
- 通过示例和拆解学习提示词结构。
- 根据文字目标生成新提示词。
- 优化已有提示词。
- 基于模板改写提示词。
- 上传图片生成图像提示词或设计分析提示词。

### 管理员

管理员通过 `/admin/login` 登录并维护提示词内容。v0.1 使用简单的数据库管理员账号，密码通过 bcrypt 加密，登录状态通过 HTTP-only cookie session 维护。

## 3. v0.1 范围

### 包含范围

- 响应式公开网站。
- 工具型门户首页。
- 图片转提示词页面。
- 文本提示词生成器页面。
- 20 条高质量精选提示词库。
- 提示词详情页和学习拆解。
- 管理员登录。
- 管理员维护提示词。
- 管理员维护分类和标签。
- 从文件种子数据导入 MySQL。
- 使用 OpenAI-compatible 接口形态的 AI provider 抽象层。
- 通过已配置的视觉模型实现真实图片理解。
- 简单 IP 限流。
- 基础公开统计：浏览量和复制次数。

### 不包含范围

- 普通用户账号。
- 收藏。
- 评论。
- 评分。
- 付费。
- 多管理员权限体系。
- 图片长期保存。
- 社区用户发布提示词。
- 向量搜索或语义推荐。
- 完整双语站点内容。
- 原生移动 App。

## 4. 信息架构

### 路由

```text
/                  工具型门户首页
/image-to-prompt   图片转提示词主工具页
/generator         文本提示词生成器和优化器
/prompts           精选提示词库
/prompts/[slug]    提示词详情和学习拆解
/learn             提示词写作指南
/admin/login       管理员登录
/admin             管理后台首页
/admin/prompts     提示词管理
/admin/categories  分类和标签管理
```

### 首页

首页是工具型门户，不是传统导航站。它应采用用户参考的 Genkee 风格工具型结构，但必须保持原创文案、原创视觉设计、原创命名和原创交互细节。

首页分区：

1. 顶部导航：Logo、Image to Prompt、Generator、Prompt Library、Learn、Login。
2. 首屏：简短价值主张和三个核心入口。
3. 核心入口：图片转提示词、文本提示词生成器、提示词库。
4. 精选分类：办公、学习、编程、写作、营销、图像/视频。
5. 精选和热门提示词：管理员精选提示词和复制次数较高的提示词。
6. 使用流程：找提示词、看拆解、生成自己的版本。
7. FAQ。
8. 底部链接。

### 图片转提示词页

`/image-to-prompt` 是 v0.1 最完整的 SEO 工具页。

页面分区：

1. 工具标题和简短说明。
2. 上传区，支持拖拽上传和点击上传。
3. 支持格式：PNG、JPG、WEBP。
4. 模式选择：
   - 图像生成提示词。
   - 设计分析提示词。
5. 结果区：
   - 自然语言 prompt。
   - JSON 结构化描述。
   - 中文解释和拆解。
   - 复制按钮。
6. How it works。
7. 为什么使用这个工具。
8. SEO 长文解释。
9. FAQ。
10. 相关工具入口。

图片不长期保存。服务端只接收图片 buffer，校验后传给已配置的视觉 provider，返回结果后丢弃 buffer。

### 文本生成器页

`/generator` 包含四种模式：

- 生成新提示词。
- 优化已有提示词。
- 基于模板改写。
- 图片提示词入口。

图片提示词入口可以跳转到 `/image-to-prompt`，避免重复实现同一套图片上传和识图逻辑。

### 提示词库

`/prompts` 展示 v0.1 的 20 条精选提示词。搜索和筛选支持分类与任务标签。第一批内容强调质量，不追求数量。

初始内容分布：

```text
办公效率：4
学习成长：3
编程和 Agent 工作流：4
写作创作：3
营销和电商：3
图像和视频：3
```

### 提示词详情页

`/prompts/[slug]` 是核心学习页面。

每个详情页包含：

- 标题。
- 分类和标签。
- 适用场景。
- 提示词正文。
- 复制按钮。
- 示例输入。
- 示例输出。
- 结构卡：
  - 角色。
  - 任务。
  - 上下文。
  - 约束。
  - 输出格式。
- 普通版提示词和优化版提示词对比。
- 为什么优化版更好。
- 相关提示词。

## 5. 语言策略

界面中文优先。

提示词生成结果支持：

- 中文。
- 英文。
- 中英双语。

图片转提示词默认输出英文 prompt，因为图像生成模型通常更适合英文提示词；同时页面展示中文解释，方便用户理解。

提示词库说明中文优先。提示词正文可以在更有利于模型表现时包含英文。

## 6. 技术架构

### 技术栈

```text
Next.js App Router
TypeScript
MySQL
Prisma
Tailwind CSS
shadcn/ui
bcrypt
HTTP-only cookie sessions
OpenAI-compatible AI provider abstraction
```

### 建议目录结构

```text
D:\aiproject\prompt-hub
├── app/
│   ├── page.tsx
│   ├── image-to-prompt/page.tsx
│   ├── generator/page.tsx
│   ├── prompts/page.tsx
│   ├── prompts/[slug]/page.tsx
│   ├── learn/page.tsx
│   └── admin/
├── components/
│   ├── site/
│   ├── prompt/
│   ├── generator/
│   └── admin/
├── lib/
│   ├── ai/
│   ├── auth/
│   ├── db/
│   ├── rate-limit/
│   └── seed/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── content/
│   └── seed-prompts/
├── docs/
├── AGENTS.md
├── progress.md
└── feature_list.json
```

## 7. 数据模型

### AdminUser

```text
id
username
passwordHash
createdAt
updatedAt
```

### Prompt

```text
id
slug
title
summary
content
exampleInput
exampleOutput
structureRole
structureTask
structureContext
structureConstraints
structureOutputFormat
weakPrompt
improvedPrompt
improvementNotes
language
status: draft / published / archived
isFeatured
copyCount
viewCount
categoryId
createdAt
updatedAt
```

### Category

```text
id
slug
name
description
sortOrder
```

### Tag

```text
id
slug
name
```

### PromptTag

```text
promptId
tagId
```

### GenerationRecord

```text
id
type: text_generate / text_optimize / template_rewrite / image_to_prompt / design_analysis
inputSummary
outputPrompt
outputJson
outputExplanation
language
providerName
modelName
ipHash
createdAt
```

v0.1 不建立图片表。上传图片不长期保存。

## 8. 内容管理

项目采用混合内容工作流：

```text
content/seed-prompts/*.json 或 *.md
↓
Prisma seed 脚本
↓
MySQL 中的 Prompt、Category、Tag 记录
↓
管理员后台可继续编辑、发布、归档、设为精选
```

这样既能快速导入第一批内容，又能通过后台持续维护。

## 9. AI Provider 设计

### 文件

```text
lib/ai/types.ts
lib/ai/provider.ts
lib/ai/openai-compatible-provider.ts
lib/ai/prompt-builder.ts
lib/ai/mock-provider.ts
```

### 统一接口

```text
generateTextPrompt(input)
optimizePrompt(input)
rewriteWithTemplate(input)
generatePromptFromImage(input)
analyzeDesignFromImage(input)
```

### 环境变量

```env
AI_PROVIDER=openai-compatible
AI_BASE_URL=
AI_API_KEY=
AI_TEXT_MODEL=
AI_VISION_MODEL=
AI_TIMEOUT_MS=30000
```

实现不能绑定某一家模型厂商。第一版 provider 使用 OpenAI-compatible 请求语义，具体 endpoint 和模型由环境变量决定。

## 10. 图片转提示词流程

```text
用户上传图片
↓
前端本地预览图片
↓
服务端校验格式和大小
↓
服务端读取临时 buffer，不写入长期存储
↓
视觉 provider 分析图片
↓
服务端返回：
  - naturalPrompt
  - jsonBlueprint
  - chineseExplanation
↓
服务端写入 GenerationRecord，但不保存图片
```

校验规则：

- 接受 PNG、JPG、JPEG、WEBP。
- 拒绝不支持的 MIME 类型。
- 强制限制可配置的最大文件大小。
- 返回清晰的中文错误信息。

## 11. 限流

公开用户免登录，因此必须控制 AI 调用成本。

默认行为：

```text
文本生成：每个 IP 每天 10 次
图片分析：每个 IP 每天 3 次
管理员：不受限制
```

环境变量：

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_TEXT_DAILY=10
RATE_LIMIT_IMAGE_DAILY=3
```

限流记录可使用数据库计数器实现，以 IP hash 和日期作为 key。不能存储原始 IP。

## 12. 管理员认证

管理员登录使用：

- 数据库管理员用户。
- bcrypt 密码哈希。
- HTTP-only cookie session。
- `/admin` 路由保护。

v0.1 不包含多角色、第三方登录、普通用户登录或密码重置。

## 13. 质量门禁

项目应提供统一验证命令：

```bash
npm run verify
```

该命令应覆盖：

- `npm run lint`。
- `npm run typecheck`。
- `npm run test`。
- `npm run build`。
- `npx prisma validate`。

推荐测试覆盖：

- AI provider mock 测试。
- prompt-builder 测试。
- rate-limit 测试。
- auth/session 测试。
- 管理员登录流程 E2E。
- 图片上传 mock E2E。
- 提示词复制和浏览计数行为。

## 14. Harness 要求

项目应包含用户已有 harness 风格中的 Agent 协作文件：

```text
AGENTS.md
progress.md
feature_list.json
docs/product/mvp_spec.md
docs/features/
docs/testing/README.md
docs/architecture/decisions/
```

只有在以下条件满足后，才开始实现：

- 设计规格已 review。
- 详细实施计划已写好。
- MVP 范围已同步到 harness 文档。

## 15. 设计决策

- 使用 Next.js 全栈架构，而不是 Vue + Spring Boot，因为这是内容型工具网站，需要 SEO，且第一版应保持紧凑。
- 使用 MySQL，因为用户偏好 MySQL，且 v0.1 数据结构是关系型。
- 使用 Prisma，让 schema、迁移和种子脚本更容易被 Agent 理解和维护。
- 使用工具型门户首页，而不是大而全导航首页。
- 将 `/image-to-prompt` 作为最强 SEO 工具页。
- 不保存上传图片。
- v0.1 保持公开用户匿名。
- 使用复制次数和管理员精选，而不是评分或评论。

## 16. 实施默认值

- 本地开发默认 `AI_PROVIDER=mock`，确保没有 API key 也能构建和测试。
- 真实 AI 调用使用 `AI_PROVIDER=openai-compatible`，并通过环境变量提供 `AI_BASE_URL`、`AI_API_KEY`、`AI_TEXT_MODEL`、`AI_VISION_MODEL`。
- 默认最大图片上传大小为 8 MB，可通过 `IMAGE_UPLOAD_MAX_MB` 配置。
- v0.1 管理后台展示生成总数和最近生成记录，但不展示上传图片，因为图片不保存。
- 第一批 20 条种子提示词可以 AI 辅助生成，但必须人工 review 后才能标记为 published。
