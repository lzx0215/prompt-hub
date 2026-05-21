# Prompt Hub Harness 治理中文设计规格

日期：2026-05-21

## 1. 背景

Prompt Hub 已完成 Foundation 工程骨架，仓库中已经具备基础 harness 文件：

- `AGENTS.md`
- `progress.md`
- `feature_list.json`
- `docs/product/mvp_spec.md`
- `docs/features/`
- `docs/testing/README.md`
- `docs/architecture/decisions/`
- `docs/superpowers/specs/`
- `docs/superpowers/plans/`

这些文件已经能说明项目范围、Foundation 进度和基础验证门槛，但约束还偏轻。当前主要风险不是“没有文档”，而是后续 Agent 可能在文档之间跳读、凭聊天记忆推进，或者在规格和计划未同步时直接进入编码。

## 2. 现状分析

### 已有优点

- MVP 范围已写入产品文档。
- Foundation 有设计规格、实施计划、功能文档和验证命令。
- `AGENTS.md` 已要求 Agent 读取进度、feature 列表和任务相关计划。
- `progress.md` 与 `feature_list.json` 已能记录基础阶段状态。
- `docs/testing/README.md` 已提供 Foundation 统一验证命令。

### 主要缺口

- `AGENTS.md` 还没有定义文档优先级、阶段门、review 门、交接格式和跨 Agent 协作约束。
- `feature_list.json` 当前只适合记录单个 Foundation 任务，缺少后续 feature 生命周期所需字段约定。
- `progress.md` 没有固定写法，容易逐步变成聊天摘要或流水账。
- `docs/testing/README.md` 只覆盖 Foundation 阶段，没有区分任务级、feature 级和阶段级验证。
- 仓库还没有一份专门说明 harness 治理规则本身的 feature 文档。

## 3. 目标

本规格为 Prompt Hub 建立一套中强度 harness。它要同时约束项目推进和 Agent 协作，使后续开发具备以下特征：

- 新功能先落规格、feature 范围和计划，再进入编码。
- 每个编码任务都能映射到 feature id。
- 状态、验证和未完成项能在仓库中追踪，而不是只存在于对话中。
- 多个 Agent 或多个会话接力时，能从仓库事实继续工作。
- 工程约束足够清晰，但不把具体实现细节写死。

## 4. 非目标

本次 harness 治理不做以下事情：

- 不开始公开页面、提示词库、AI 工具或管理后台的新功能开发。
- 不把每个小任务都强制改造成重型流程。
- 不要求所有 bugfix 都新建完整产品规格。
- 不引入新的项目管理平台替代仓库文档。
- 不改变 Prompt Hub v0.1 的产品范围。

## 5. 方案选择

### 方案 A：轻量 harness

只保留范围、规格和统一验证命令约束。

优点是简单，缺点是换 Agent、换电脑或并行推进时容易失去状态事实，仍可能出现“先编码再补规则”的漂移。

### 方案 B：中强度 harness

同时约束文档事实源、阶段门、任务流转、验证、review 和交接格式。

优点是能防住当前项目最容易出现的范围漂移和上下文丢失，同时保留实现自由度。

### 方案 C：重型 harness

将任务状态机、提交节奏、review 输出和交接字段全部强制模板化。

优点是最严，缺点是 Prompt Hub 仍在早期，流程重量会过早压过产品学习和工程迭代。

### 决策

采用方案 B。Prompt Hub 当前需要的是可执行的工程护栏，而不是把开发变成模板填空。

## 6. 文档事实系统

### 文档职责

| 文档 | 职责 |
| --- | --- |
| `AGENTS.md` | Agent 执行规则和硬门槛 |
| `docs/product/mvp_spec.md` | v0.1 产品范围事实源 |
| `docs/superpowers/specs/*.md` | 设计规格和设计取舍 |
| `docs/superpowers/plans/*.md` | 已确认规格的实施任务分解 |
| `docs/features/*.md` | 单个 feature 的范围、验收和验证事实源 |
| `feature_list.json` | 机器可读 feature 状态表 |
| `progress.md` | 人类可读当前阶段摘要 |
| `docs/testing/README.md` | 质量门槛和验证要求 |
| `docs/architecture/decisions/*.md` | 关键架构决策记录 |

### 冲突优先级

当仓库文档之间冲突时，按以下顺序处理：

1. 用户当前明确指令。
2. `AGENTS.md`。
3. `docs/product/mvp_spec.md`。
4. 当前 `docs/features/*.md`。
5. 当前 `docs/superpowers/specs/*.md`。
6. 当前 `docs/superpowers/plans/*.md`。
7. `progress.md` 与 `feature_list.json`。

`progress.md` 和 `feature_list.json` 只描述当前状态，不允许隐式改写范围。计划文档不能覆盖规格文档。代码已经存在，也不能作为继续扩范围的依据。

## 7. 开发阶段门

Prompt Hub 后续功能开发遵循以下主流程：

```text
产品范围
↓
设计规格
↓
Feature 文档
↓
实施计划
↓
任务执行
↓
验证
↓
Review
↓
进度同步与提交
```

### Scope Gate

- 先确认需求是否属于 v0.1。
- 若需求超出范围，先获得用户确认，并同步产品或 feature 文档。

### Spec Gate

- 新功能、关键行为变化和关键交互变化必须先有设计规格。
- 小范围 bugfix 可以绑定现有 feature 或显式 bug 目标，不强制新建大规格。

### Feature Gate

- 可开发 feature 必须有 feature id。
- feature 文档至少包含目标、范围、不做范围、验收标准和验证方式。

### Plan Gate

- 多步开发必须先有实施计划。
- 计划任务应尽量可独立验证、独立 review、独立提交。

### Execution Gate

- 执行任务时不得顺手实现计划外功能。
- 若发现计划缺口，先回到规格、feature 文档或计划修正，再继续编码。

### Verification Gate

- 任务级验证通过后，才能声称任务完成。
- feature 级验证与验收核对完成后，才能将 feature 标记为 `completed`。
- 阶段关闭前必须运行统一验证命令。

### Review Gate

- 重要任务至少经过规格符合性检查和代码质量检查。
- review 发现的问题必须修复、记录为后续项或显式阻塞，不能只留在聊天中。

### Progress Gate

- feature 状态变化时，同步 `feature_list.json` 和 `progress.md`。
- 关键架构决策变化时，补充 ADR。

## 8. Feature 状态约束

后续 `feature_list.json` 应支持至少以下状态：

- `backlog`
- `planned`
- `in_progress`
- `blocked`
- `review`
- `completed`
- `deferred`

每个 feature 条目应能表达以下信息：

- `id`
- `name`
- `status`
- `feature_doc`
- `spec`
- `plan`
- `files`
- `verification`
- `blocked_by`
- `notes`

字段可以按阶段逐步补齐，但不得让 feature 失去 id、状态和验收来源。

## 9. Agent 协作规则

### 启动读取顺序

每个 Agent 开始功能任务前至少读取：

1. `AGENTS.md`
2. `progress.md`
3. `feature_list.json`
4. `docs/product/mvp_spec.md`
5. 当前 feature 文档
6. 当前设计规格
7. 当前实施计划
8. 与任务相关的 ADR 和 testing 文档

如果当前 feature、规格或计划缺失，Agent 不得直接开始功能编码。

### 任务输入

派发给 Agent 的任务至少应包含：

- `feature_id`
- 任务目标
- 允许修改的文件范围
- 明确不做范围
- 必读文档
- 验收标准
- 验证命令
- 输出要求

### 任务输出

Agent 完成任务后至少回报：

- 已完成内容
- 修改文件
- 已运行验证和结果
- 是否偏离计划
- 风险、阻塞和后续项
- 当前分支或提交状态

### 并行规则

- 并行代码任务必须有清晰且尽量不重叠的写入范围。
- 共享 schema、公共类型、路由协议和 provider 契约优先串行定好。
- 子 Agent 不得回滚用户或其他 Agent 的改动。

### 交接模板

暂停、换会话或跨 Agent 交接时，至少使用以下格式：

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

## 10. 质量门槛

### 任务级

- 文档改动：检查文档一致性、范围一致性和占位内容。
- 工具函数与领域逻辑：新增或更新相关测试，并运行专项验证。
- UI 改动：至少运行 lint、typecheck 和相关测试；重要前端改动补浏览器检查。
- schema、AI provider、认证和限流改动：运行对应专项验证后，再进入 feature 或阶段验证。

### Feature 级

feature 进入 `review` 或 `completed` 前必须确认：

- 验收标准已逐项核对。
- 相关测试已运行。
- 文档状态已同步。
- 未完成项和风险已显式记录。

### 阶段级

- 阶段关闭前运行 `npm run verify`。
- 发布准备阶段后续再补环境变量、数据迁移、依赖安全和部署验证要求。

## 11. 文档同步规则

### 开始新 feature 前

- 创建或更新 feature 文档。
- 必要时创建设计规格。
- 创建实施计划。
- 在 `feature_list.json` 标记为 `planned`。

### 开始实现时

- 将 feature 状态标记为 `in_progress`。
- 在 `progress.md` 写清当前目标和下一步。

### 进入 review 时

- 将 feature 状态标记为 `review`。
- 记录验证命令与结果。
- 显式记录未完成项。

### 完成时

- 将 feature 状态标记为 `completed`。
- 更新 `progress.md` 的已完成事项和下一步。
- 必要时补 ADR。

### 被阻塞时

- 将 feature 状态标记为 `blocked`。
- 记录阻塞原因、需要的决策和恢复条件。

## 12. 本次落库改动范围

本规格通过后，下一步只收紧 harness，不进入产品功能实现。目标改动包括：

- 更新 `AGENTS.md`。
- 更新 `progress.md`。
- 更新 `feature_list.json`。
- 更新 `docs/testing/README.md`。
- 新增 `docs/features/M0-002-harness-governance.md`。
- 必要时在 `docs/product/mvp_spec.md` 说明 harness 治理不改变产品范围。

## 13. 验收标准

本次 harness 治理完成后，应满足：

- 仓库能明确指出后续功能编码前必须经过哪些文档和质量门。
- `AGENTS.md` 能独立指导新 Agent 启动、执行、review 和交接。
- `feature_list.json` 与 `progress.md` 的职责边界清晰。
- `docs/testing/README.md` 不再只覆盖 Foundation，而能支撑后续 feature 开发。
- 本次改动不引入新的产品功能范围。
