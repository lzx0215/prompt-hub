# 测试与质量门槛

## 原则

- 先有验证证据，再声称任务、feature 或阶段完成。
- 验证范围随风险扩大：小文档改动做文档检查，业务逻辑和关键界面做专项验证，阶段关闭跑统一验证。
- 计划外风险不能藏在聊天中，必须修复、记录为后续项或标记阻塞。

## 统一验证命令

```bash
npm run verify
```

当前统一验证覆盖：

- lint
- Prisma schema validation
- Prisma client generation
- typecheck
- unit tests
- production build

## 任务级最低门槛

| 变更类型 | 最低验证 |
| --- | --- |
| 文档与 harness | 对照当前规格自审，运行 `git diff --check`；若修改 `feature_list.json`，运行 JSON 解析检查 |
| 工具函数与领域逻辑 | 先新增或更新相关测试，再运行相关测试和 `npm run typecheck` |
| UI 页面与组件 | 运行 `npm run lint`、`npm run typecheck`、相关测试；重要 UI 改动做浏览器检查 |
| Prisma schema 与 seed | 运行 `npm run prisma:validate`、`npm run prisma:generate` 和相关测试 |
| AI provider、auth、rate limit | 运行相关测试、`npm run typecheck`，再按风险补 API 或流程验证 |

## Feature 级门槛

feature 进入 `review` 或 `completed` 前必须确认：

1. 对应 feature 文档的验收标准已逐项核对。
2. 相关专项验证已运行并记录结果。
3. `feature_list.json` 和 `progress.md` 已同步。
4. 未完成项、风险和阻塞已显式记录。
5. 重要任务已完成规格符合性检查和代码质量检查。

## 阶段级门槛

阶段关闭前运行：

```bash
npm run verify
```

发布准备阶段还需要在对应 feature 规格和计划中补充：

- 环境变量检查
- 数据迁移检查
- 依赖安全审查
- 部署验证

## 常用命令

```bash
npm run lint
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run test
npm run build
npm run verify
```

PowerShell JSON 解析检查：

```powershell
Get-Content -Raw -Encoding UTF8 'feature_list.json' | ConvertFrom-Json | Out-Null
```

文档 diff 检查：

```bash
git diff --check
```

## 前端浏览器检查

重要 UI 改动进入完成状态前，至少记录：

- 检查的路由。
- 桌面端检查范围。
- 移动端检查范围。
- 主要交互、错误态和空态是否检查。
- 发现的问题是否已修复或记录。
