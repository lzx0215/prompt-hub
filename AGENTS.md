# Prompt Hub Agent 工作规则

## Project Overview

- 当前模式：project
- 项目名称：Prompt Hub
- 项目类型：AI 提示词工具型门户
- 核心功能：提示词库、学习拆解、文本提示词生成和图片转提示词工具
- 技术栈：Next.js App Router、TypeScript、MySQL、Prisma、Tailwind CSS、Vitest
- 源代码位置：`app/`、`components/`、`lib/`、`prisma/`

## Document Authority

当仓库事实冲突时，按以下顺序处理：

1. 用户当前明确指令。
2. `AGENTS.md`。
3. `docs/product/mvp_spec.md`。
4. 当前 feature 文档 `docs/features/*.md`。
5. 当前设计规格 `docs/superpowers/specs/*.md`。
6. 当前实施计划 `docs/superpowers/plans/*.md`。
7. `progress.md` 与 `feature_list.json`。

`progress.md` 和 `feature_list.json` 只描述状态，不允许隐式改写范围。计划不能覆盖规格。代码已经存在，也不能作为继续扩范围的理由。

## Startup Protocol

每个 Agent 开始功能任务前必须读取：

1. `AGENTS.md`
2. `progress.md`
3. `feature_list.json`
4. `docs/product/mvp_spec.md`
5. 当前任务相关的 feature 文档
6. 当前任务相关的设计规格
7. 当前任务相关的实施计划
8. 与任务相关的 ADR 和 `docs/testing/README.md`

如果当前 feature、规格或计划缺失，先指出缺口，不得直接开始功能编码。小范围 bugfix 可以绑定已有 feature 或显式 bug 目标。

## Development Gates

后续功能开发按以下阶段门推进：

1. Scope Gate：确认需求属于 v0.1；超范围先获得用户确认并同步文档。
2. Spec Gate：新功能、关键行为变化和关键交互变化先有设计规格。
3. Feature Gate：可开发 feature 必须有 feature id、范围、不做范围、验收和验证方式。
4. Plan Gate：多步开发先有实施计划，再开始编码。
5. Execution Gate：执行中不顺手实现计划外功能；发现计划缺口先修正文档。
6. Verification Gate：有新鲜验证证据后才能声称任务、feature 或阶段完成。
7. Review Gate：重要任务先做规格符合性检查，再做代码质量检查。
8. Progress Gate：feature 状态变化时同步 `feature_list.json` 和 `progress.md`。

## Scope Rules

- 未经用户确认，不扩展 v0.1 范围。
- 图片上传只允许临时处理，不允许长期保存。
- 普通用户保持免登录。
- 管理后台只做单管理员账号密码登录。
- 架构决策变化时补充 `docs/architecture/decisions/`。

## Execution Rules

- 每个编码任务必须映射到一个 feature id 或显式 bug 目标。
- 优先交付最小可验证切片：一个任务只做一个明确目标。
- 不提前生成当前计划不需要的页面、抽象、配置、provider、数据库字段或复用层。
- 若需要新增共享契约或扩大范围，先更新 feature 文档、规格或计划。
- 工具函数、领域逻辑、auth、rate limit 和 provider 行为优先用测试证明。
- 不回滚用户或其他 Agent 的改动；遇到重叠修改时先理解再继续。

## Workflow And Skill Rules

- Harness 规则优先描述跨平台工程流程，再使用平台专属 skill、插件或工具。
- 若当前 Agent 平台具备 planning、TDD、debugging、review、verification、browser QA 等匹配 skill 或工作流，应优先使用。
- 若平台没有同名 skill，也必须执行等价流程：读仓库事实、按规格和计划工作、小步验证、review 后同步状态。
- skill、插件和工具不能覆盖用户指令、仓库范围事实源和 feature 验收标准。
- 派发任务不能只写某个平台 skill 名称，还必须写清目标、允许修改范围、不做范围、验收、验证和输出要求。

## Frontend UI Guardrails

- 界面与面向人的文档中文优先，模型输出语言策略按产品规格执行。
- 公开页面优先呈现可操作工具和内容价值，不把第一屏做成空泛营销页。
- 工具页结构可参考已确认的 Genkee 风格布局方向，但必须使用原创视觉、原创文案、原创资产和原创交互细节。
- 前端实现优先复用项目既有组件、样式约束和信息架构。
- UI 必须同时考虑桌面端和移动端的可读性、可扫描性、操作反馈和错误状态。
- 页面布局、组件分区和具体交互在对应 feature 规格与计划中确定，不能没有页面规格就凭感觉堆界面。

## Verification And Review Rules

- 所有代码变更最终必须通过 `npm run verify`。
- 任务级验证要求见 `docs/testing/README.md`。
- feature 进入 `review` 或 `completed` 前，必须核对验收标准、验证结果、文档同步和未完成项。
- 重要 UI 改动在进入完成状态前必须做浏览器检查，并记录桌面端和移动端检查范围。
- review 发现的问题必须修复、显式阻塞或记录为后续项，不能只留在聊天中。

## State Sync Rules

- 开始新 feature 前：创建或更新 feature 文档、规格和计划，并在 `feature_list.json` 标记为 `planned`。
- 开始实现时：将 feature 状态标记为 `in_progress`，在 `progress.md` 写清当前目标。
- 进入 review 时：将 feature 状态标记为 `review`，记录验证和未完成项。
- 完成时：将 feature 状态标记为 `completed`，更新 `progress.md` 的已完成事项、最近验证和下一步。
- 阻塞时：将 feature 状态标记为 `blocked`，记录阻塞原因和恢复条件。

## Documentation Rules

- 面向人的项目文档默认使用中文。
- 代码标识符、路径、命令、环境变量、API 字段和第三方产品名称可以使用英文。
- 对话记忆不能替代仓库文档；关键范围、状态和验证结论必须回写仓库。

## Handoff

暂停、换会话或跨 Agent 交接时，至少提供：

```markdown
## Handoff

- 当前分支：
- 当前 feature：
- 当前阶段：
- 已完成：
- 未完成：
- 已验证：
- 风险/阻塞：
- 下一步：
- 必读文档：
```
