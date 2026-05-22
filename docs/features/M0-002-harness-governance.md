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
- 将前端设计前置门写入 harness：整页设计先确认参考素材，有参考素材走 `ai-website-cloner-template`，无参考素材和局部 UI 修改走 `awesome-design-md`。
- 明确 Chrome 设计预览获用户确认前，不写正式前端 feature 规格、实施计划或实现代码。
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
- 仓库能说明整页 UI、有参考素材、无参考素材和局部 UI 修改各自应走的设计流程，并指向 `ai-website-cloner-template` 或 `awesome-design-md`。
- 仓库能在指定 skill 缺失时把 Agent 停在设计门前，并要求先补齐对应 skill。
- Chrome 设计预览未获用户确认前，前端任务不会进入正式规格、计划或代码实现。

## 验证方式

- 对照 `docs/superpowers/specs/2026-05-21-prompt-hub-harness-governance-design.zh-CN.md` 逐项自审。
- 运行 `git diff --check` 检查文档 diff。
- 运行 PowerShell JSON 解析检查 `feature_list.json`。
- 运行 `npm run verify` 保持项目统一验证通过。
