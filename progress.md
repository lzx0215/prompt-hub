# Prompt Hub 进度记录

最后更新：2026-05-21

## 当前阶段

`public-home-prompt-library-launch-review`

## 当前目标

`M1-001` 公开首页与精选提示词库首发体验已进入 review。所有功能开发、专项测试和 `npm run verify` 已通过。

## 已完成事项

- 已完成 `M0-001` 基础工程骨架。
- 已完成 `M0-002` Harness 治理。
- 已完成 `M1-001` 全部编码任务：
  - 20 条精选提示词 seed 内容（办公4、学习3、编程Agent4、写作3、营销3、图像视频3）。
  - 公开查询层（首页精选、列表搜索筛选、详情、相关提示词、筛选选项），全部只返回 PUBLISHED。
  - 浏览和复制计数边界，统计失败不阻断主流程。
  - `/prompts` 列表页：搜索输入、分类筛选、标签筛选、提示词卡片、空态。
  - `/prompts/[slug]` 详情页：正文与复制按钮、示例输入输出、结构拆解、优化对比、相关提示词、未找到状态。
  - 首页升级：核心工具入口、精选分类、精选提示词预览、使用流程、FAQ。AI 工具标记为「即将上线」。

## 当前阻塞

- 无。

## 最近验证

- 2026-05-21：`npx vitest run tests/seed/load-seed-prompts.test.ts` — 3 tests passed。
- 2026-05-21：`npx vitest run tests/prompts/public-query.test.ts` — 5 tests passed。
- 2026-05-21：`npx vitest run tests/metrics/prompt-metrics.test.ts` — 3 tests passed。
- 2026-05-21：`npx vitest run tests/prompts/prompt-pages.test.tsx` — 3 tests passed（列表空态、详情学习区块、首页入口）。
- 2026-05-21：`npm run verify` — lint、prisma validate、prisma generate、typecheck、19 tests passed、build 通过。

## 浏览器检查范围

- 桌面端和移动端浏览器检查需要在有数据库连接的本地环境中启动 `npm run dev` 后手动执行。
- 检查项：
  - `/` 首页入口、精选分类和精选提示词。
  - `/prompts` 搜索、分类筛选、标签筛选和清除筛选回路。
  - `/prompts/[slug]` 正文、复制反馈、结构拆解、优化对比和相关提示词。
  - `/prompts/not-a-real-slug` 未找到反馈。

## 下一步

- 在本地启动 `npm run dev` 并完成浏览器检查。
- Review 通过后将 `M1-001` 标记为 `completed`。
