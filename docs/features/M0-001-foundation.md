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
