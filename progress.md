# Prompt Hub 进度记录

最后更新：2026-05-22

## 当前阶段

`admin-crud-and-ai-integration-completed`

## 当前目标

`M2-001` & `M2-002` AI 真实接入与 IP 限流、管理员安全登录与内容 CRUD 表单全部开发、修复 any 警告及重命名 [id] 目录，所有单元测试与 verify 构建均已通过。

## 已完成事项

- 已完成 `M0-001` 基础工程骨架。
- 已完成 `M0-002` Harness 治理。
- 已完成 `M1-001` 公开首页与精选提示词库首发体验：
  - 20 条精选提示词 seed 内容（办公4、学习3、编程Agent4、写作3、营销3、图像视频3）。
  - 公开查询层（首页精选、列表搜索筛选、详情、相关提示词、筛选选项），全部只返回 PUBLISHED。
  - 浏览和复制计数边界，统计失败不阻断主流程。
  - `/prompts` 列表页：搜索输入、分类筛选、标签筛选、提示词卡片、空态。
  - `/prompts/[slug]` 详情页：正文与复制按钮、示例输入输出、结构拆解、优化对比、相关提示词、未找到状态。
  - 首页升级：核心工具入口、精选分类、精选提示词预览、使用流程、FAQ。
- 已完成 `M2-001` AI 真实接入与 IP 限流：
  - 精准对接智谱 AI GLM API，支持 `glm-5.1` 大模型做为文本提示词生成/优化驱动，以及多模态 vision 识图大模型 `glm-4v`。
  - 限制单 IP 的每日限流（10次文本，3次图片识图）。
  - 跑通 `ImageUploader` 真实 Multipart 识图和 `app/generator` 流式生成 Reader。
- 已完成 `M2-002` 管理员安全登录与内容 CRUD：
  - 单管理员密码 Bcrypt 12轮加盐哈希，HTTP-only Cookie 安全凭证校验。
  - `/admin` 面板路由全保护，中间件鉴权拦截。
  - 支持全字段 CRUD 提示词及动态关联/创建 Tag。
  - 双栏暗黑高端控制台。

## 当前阻塞

- 无。

## 最近验证

- 2026-05-22：`npm run verify` — lint (0 errors, 7 warnings)、prisma validate、prisma generate、typecheck、19 tests passed、build (next build) 成功通过。
- 2026-05-22：重构 `%5Bid%5D` (URL-encoded [id]) 目录为标准 `[id]` 目录，完全解决 Next.js 自动生成类型的 typecheck 编译失败问题。
- 2026-05-22：在 `.env` 中成功把大模型文本生成驱动切换为 `glm-5.1`。

## 下一步

- v0.1 功能已基本完备。后续可安排生产环境部署、SEO 优化与上线微调。
