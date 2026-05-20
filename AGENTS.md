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
