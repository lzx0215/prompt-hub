# Prompt Hub Harness 治理实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 将已确认的中强度 harness 规则落入 Prompt Hub 仓库，使后续 feature 开发在范围、规格、计划、验证、review 和交接上都有明确约束。

**架构：** 本计划只修改 harness 文档和状态文件，不实现产品功能。先创建 `M0-002` feature 文档并把状态切到 harness 治理中，再扩展 `AGENTS.md` 和测试门槛，最后运行文档与项目验证并同步完成状态。

**技术栈：** Markdown、JSON、PowerShell、Git、现有 Next.js/Vitest/Prisma 验证链。

---

## 0. 执行边界

- 先读已确认规格：`docs/superpowers/specs/2026-05-21-prompt-hub-harness-governance-design.zh-CN.md`。
- 本计划只改 harness，不新增公开页面、AI 工具、管理员功能、数据库字段或 UI 组件。
- 本计划不修改 `docs/product/mvp_spec.md`，因为 harness 治理不改变 v0.1 产品范围。
- 所有文档默认中文；路径、命令、字段名和平台 skill 名称可使用英文。

## 1. 文件结构

本计划会创建或修改：

```text
AGENTS.md
progress.md
feature_list.json
docs/
|-- features/
|   `-- M0-002-harness-governance.md
|-- testing/
|   `-- README.md
`-- superpowers/
    `-- plans/
        `-- 2026-05-21-prompt-hub-harness-governance.zh-CN.md
```

各文件职责：

| 文件 | 职责 |
| --- | --- |
| `docs/features/M0-002-harness-governance.md` | 固定本次 harness feature 的范围、验收和验证 |
| `feature_list.json` | 记录 M0-001 与 M0-002 的机器可读状态 |
| `progress.md` | 记录当前 harness 阶段、人类可读进度、阻塞和下一步 |
| `AGENTS.md` | 提供后续 Agent 必须遵守的执行规则 |
| `docs/testing/README.md` | 提供任务级、feature 级和阶段级验证门槛 |

### Task 1: 建立 M0-002 Feature 与进行中状态

**Files:**
- Create: `docs/features/M0-002-harness-governance.md`
- Modify: `feature_list.json`
- Modify: `progress.md`

- [ ] **Step 1: 创建 harness feature 文档**

创建 `docs/features/M0-002-harness-governance.md`：

```markdown
# M0-002 Harness 治理

## 功能目标

将 Prompt Hub 的 harness 从基础说明升级为可执行协作规则，使后续功能开发在范围、规格、计划、验证、review 和交接上有稳定依据。

## 依赖

- `M0-001` 基础工程骨架已完成。
- 已确认规格：`docs/superpowers/specs/2026-05-21-prompt-hub-harness-governance-design.zh-CN.md`。

## 范围

- 收紧 `AGENTS.md` 中的文档优先级、阶段门、任务执行、review、验证和 handoff 规则。
- 明确 workflow/skill 如何服从仓库规格、计划和验收要求。
- 明确最小可验证切片原则。
- 写入前端 UI 的项目级护栏，并保留页面级设计到对应 feature 规格。
- 让 `feature_list.json` 能记录 feature 文档、spec、plan、验证、阻塞和 notes。
- 让 `progress.md` 固定当前阶段、目标、完成项、阻塞、最近验证和下一步。
- 将 `docs/testing/README.md` 扩展到任务级、feature 级和阶段级门槛。

## 不做范围

- 不开发提示词库公开页面。
- 不开发图片转提示词或文本生成器功能。
- 不开发管理员登录和后台 CRUD。
- 不新增数据库 schema、AI provider 或前端组件。
- 不改变 v0.1 产品范围。

## 验收标准

- `AGENTS.md` 能独立指导新 Agent 启动、执行、review、验证和交接。
- `feature_list.json` 能区分 M0-001 与 M0-002 的状态事实，并保留 feature、spec、plan 和验证来源。
- `progress.md` 不再只是 Foundation 结束摘要，而能表达当前 harness 阶段和下一步。
- `docs/testing/README.md` 能说明任务级、feature 级和阶段级最低验证要求。
- 仓库能说明 workflow/skill 适配、最小代码生成和前端 UI 规则写入时机。

## 验证方式

- 对照 `docs/superpowers/specs/2026-05-21-prompt-hub-harness-governance-design.zh-CN.md` 逐项自审。
- 运行 `git diff --check` 检查文档 diff。
- 运行 PowerShell JSON 解析检查 `feature_list.json`。
- 运行 `npm run verify` 保持项目统一验证通过。
```

- [ ] **Step 2: 将 feature 状态切到进行中**

将 `feature_list.json` 替换为：

```json
{
  "project": "Prompt Hub",
  "stage": "harness-governance-in-progress",
  "last_updated": "2026-05-21",
  "tasks": [
    {
      "id": "M0-001",
      "name": "基础工程骨架",
      "status": "completed",
      "feature_doc": "docs/features/M0-001-foundation.md",
      "spec": "docs/superpowers/specs/2026-05-20-prompt-hub-design.zh-CN.md",
      "plan": "docs/superpowers/plans/2026-05-20-prompt-hub-foundation.zh-CN.md",
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
      "verification": [
        "npm run verify"
      ],
      "blocked_by": [],
      "notes": "Foundation 为后续 harness、公开页面、AI 工具和后台功能提供基础工程骨架。"
    },
    {
      "id": "M0-002",
      "name": "Harness 治理",
      "status": "in_progress",
      "feature_doc": "docs/features/M0-002-harness-governance.md",
      "spec": "docs/superpowers/specs/2026-05-21-prompt-hub-harness-governance-design.zh-CN.md",
      "plan": "docs/superpowers/plans/2026-05-21-prompt-hub-harness-governance.zh-CN.md",
      "files": [
        "AGENTS.md",
        "progress.md",
        "feature_list.json",
        "docs/features/M0-002-harness-governance.md",
        "docs/testing/README.md"
      ],
      "verification": [
        "git diff --check",
        "Get-Content -Raw -Encoding UTF8 'feature_list.json' | ConvertFrom-Json | Out-Null",
        "npm run verify"
      ],
      "blocked_by": [],
      "notes": "只收紧 harness，不进入产品功能实现。"
    }
  ]
}
```

- [ ] **Step 3: 验证 JSON 状态文件可解析**

运行：

```powershell
Get-Content -Raw -Encoding UTF8 'feature_list.json' | ConvertFrom-Json | Out-Null
```

预期：命令退出码为 `0`，没有 JSON 解析错误。

- [ ] **Step 4: 更新当前进度摘要**

将 `progress.md` 替换为：

```markdown
# Prompt Hub 进度记录

最后更新：2026-05-21

## 当前阶段

`harness-governance-in-progress`

## 当前目标

将已确认的中强度 harness 规则落入仓库，再按新规则进入后续 feature 规划和开发。

## 已完成事项

- 已完成 `M0-001` 基础工程骨架。
- 已确认 Prompt Hub 中文产品设计规格。
- 已确认 Harness 治理规格：`docs/superpowers/specs/2026-05-21-prompt-hub-harness-governance-design.zh-CN.md`。

## 当前阻塞

- 无。

## 最近验证

- 2026-05-21：Foundation worktree 已运行 `npm run verify`。

## 下一步

按 `docs/superpowers/plans/2026-05-21-prompt-hub-harness-governance.zh-CN.md` 收紧 Agent 工作规则和质量门槛。
```

- [ ] **Step 5: 检查 feature 文档引用已写入状态文件**

运行：

```powershell
rg -n "M0-002|harness-governance|2026-05-21-prompt-hub-harness-governance" feature_list.json progress.md docs/features/M0-002-harness-governance.md
```

预期：输出包含 `M0-002`、本计划路径和 harness 规格路径。

- [ ] **Step 6: 提交 feature 与进行中状态**

运行：

```powershell
git add docs/features/M0-002-harness-governance.md feature_list.json progress.md
git commit -m "docs: start harness governance feature"
```

### Task 2: 将执行规则写入 AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: 替换 Agent 工作规则**

将 `AGENTS.md` 替换为：

````markdown
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
````

- [ ] **Step 2: 检查 AGENTS 关键约束是否齐全**

运行：

```powershell
rg -n "Document Authority|Development Gates|Workflow And Skill Rules|最小可验证切片|Frontend UI Guardrails|Verification And Review Rules|State Sync Rules|Handoff" AGENTS.md
```

预期：输出覆盖文档优先级、阶段门、skill 适配、最小代码生成、UI 护栏、验证 review、状态同步和交接模板。

- [ ] **Step 3: 对照规格核对 AGENTS 边界**

手工核对以下条目后继续：

- `AGENTS.md` 没有让平台专属 skill 覆盖用户指令或仓库事实。
- `AGENTS.md` 没有提前写死某个页面的具体布局。
- `AGENTS.md` 明确说明没有 feature、规格或计划时不能直接开始功能编码。
- `AGENTS.md` 明确说明重要 UI 改动需要浏览器检查。

- [ ] **Step 4: 提交执行规则**

运行：

```powershell
git add AGENTS.md
git commit -m "docs: strengthen agent workflow rules"
```

### Task 3: 扩展测试与质量门槛

**Files:**
- Modify: `docs/testing/README.md`

- [ ] **Step 1: 替换测试门槛文档**

将 `docs/testing/README.md` 替换为：

````markdown
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
````

- [ ] **Step 2: 检查测试文档已覆盖三层门槛**

运行：

```powershell
rg -n "任务级最低门槛|Feature 级门槛|阶段级门槛|前端浏览器检查|JSON 解析检查|git diff --check" docs/testing/README.md
```

预期：输出包含文档验证、逻辑验证、UI 验证、阶段验证和浏览器检查章节。

- [ ] **Step 3: 提交质量门槛**

运行：

```powershell
git add docs/testing/README.md
git commit -m "docs: expand quality gates"
```

### Task 4: 验证并关闭 Harness 治理

**Files:**
- Modify: `feature_list.json`
- Modify: `progress.md`

- [ ] **Step 1: 运行文档 diff 检查**

运行：

```powershell
git diff --check HEAD~3..HEAD
```

预期：命令退出码为 `0`，没有空白和 patch 格式问题。

- [ ] **Step 2: 运行统一项目验证**

运行：

```powershell
npm run verify
```

预期：lint、Prisma validate、Prisma generate、typecheck、unit tests 和 production build 全部通过。

- [ ] **Step 3: 将 feature 状态更新为完成**

将 `feature_list.json` 替换为：

```json
{
  "project": "Prompt Hub",
  "stage": "harness-governance-completed",
  "last_updated": "2026-05-21",
  "tasks": [
    {
      "id": "M0-001",
      "name": "基础工程骨架",
      "status": "completed",
      "feature_doc": "docs/features/M0-001-foundation.md",
      "spec": "docs/superpowers/specs/2026-05-20-prompt-hub-design.zh-CN.md",
      "plan": "docs/superpowers/plans/2026-05-20-prompt-hub-foundation.zh-CN.md",
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
      "verification": [
        "npm run verify"
      ],
      "blocked_by": [],
      "notes": "Foundation 为后续 harness、公开页面、AI 工具和后台功能提供基础工程骨架。"
    },
    {
      "id": "M0-002",
      "name": "Harness 治理",
      "status": "completed",
      "feature_doc": "docs/features/M0-002-harness-governance.md",
      "spec": "docs/superpowers/specs/2026-05-21-prompt-hub-harness-governance-design.zh-CN.md",
      "plan": "docs/superpowers/plans/2026-05-21-prompt-hub-harness-governance.zh-CN.md",
      "files": [
        "AGENTS.md",
        "progress.md",
        "feature_list.json",
        "docs/features/M0-002-harness-governance.md",
        "docs/testing/README.md"
      ],
      "verification": [
        "git diff --check HEAD~3..HEAD",
        "Get-Content -Raw -Encoding UTF8 'feature_list.json' | ConvertFrom-Json | Out-Null",
        "npm run verify"
      ],
      "blocked_by": [],
      "notes": "中强度 harness 已写入执行规则、状态文件和质量门槛。"
    }
  ]
}
```

- [ ] **Step 4: 确认完成状态 JSON 可解析**

运行：

```powershell
Get-Content -Raw -Encoding UTF8 'feature_list.json' | ConvertFrom-Json | Out-Null
```

预期：命令退出码为 `0`，没有 JSON 解析错误。

- [ ] **Step 5: 更新最终进度摘要**

将 `progress.md` 替换为：

```markdown
# Prompt Hub 进度记录

最后更新：2026-05-21

## 当前阶段

`harness-governance-completed`

## 当前目标

Prompt Hub 的中强度 harness 已落入仓库。后续功能开发必须按范围、规格、feature、计划、验证和 review 门槛推进。

## 已完成事项

- 已完成 `M0-001` 基础工程骨架。
- 已完成 `M0-002` Harness 治理。
- 已收紧 Agent 启动、任务执行、workflow/skill、最小代码生成、UI 护栏和 handoff 规则。
- 已扩展任务级、feature 级和阶段级质量门槛。

## 当前阻塞

- 无。

## 最近验证

- 2026-05-21：`git diff --check HEAD~3..HEAD` 已通过。
- 2026-05-21：`feature_list.json` PowerShell JSON 解析检查已通过。
- 2026-05-21：`npm run verify` 已通过。

## 下一步

按新 harness 规则为公开页面与提示词库 feature 创建规格、feature 文档和实施计划。
```

- [ ] **Step 6: 检查状态文件与验收项对齐**

运行：

```powershell
rg -n "harness-governance-completed|M0-002|最近验证|下一步|Workflow And Skill Rules|最小可验证切片|任务级最低门槛" feature_list.json progress.md AGENTS.md docs/testing/README.md docs/features/M0-002-harness-governance.md
```

预期：输出能定位 M0-002 完成状态、最近验证、skill/workflow 规则、最小代码原则和质量门槛。

- [ ] **Step 7: 提交完成状态**

运行：

```powershell
git add feature_list.json progress.md
git commit -m "docs: close harness governance feature"
```

## 2. 最终检查

- [ ] 查看工作树状态。

```powershell
git status --short
```

预期：除计划执行中明确保留的变更外，没有意外未提交文件。

- [ ] 对照规格核对覆盖面。

核对：

- `AGENTS.md` 覆盖文档优先级、阶段门、协作规则、skill 适配、最小代码、UI 护栏、review、验证和 handoff。
- `feature_list.json` 覆盖 feature 状态、feature 文档、spec、plan、验证、阻塞和 notes。
- `progress.md` 覆盖当前阶段、目标、已完成、阻塞、最近验证和下一步。
- `docs/testing/README.md` 覆盖任务级、feature 级和阶段级验证。
- `docs/features/M0-002-harness-governance.md` 明确本次不进入产品功能实现。
