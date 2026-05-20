# ADR 0001: 技术栈选择

日期：2026-05-20

## 决策

Prompt Hub v0.1 使用 Next.js App Router、TypeScript、MySQL、Prisma、Tailwind CSS、Vitest。

## 原因

- 项目是内容型工具网站，需要 SEO 友好的页面结构。
- Next.js 可以在一个项目中承载公开页面、后台页面和 API。
- MySQL 符合项目偏好，也适合 v0.1 的关系型数据。
- Prisma 让 schema、迁移和 seed 脚本更清晰，适合 Agent 协作维护。

## 取舍

- 不采用 Vue + Spring Boot，因为第一版会更重。
- 不采用 SQLite，因为目标是公开网站和后台维护。
- 不采用 PostgreSQL，因为第一版没有向量搜索或复杂 JSON 查询需求。
