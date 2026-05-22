# Feature: M2-002 Admin Auth & Content Management

## 1. 范围 (Scope)

本 Feature 实现单管理员登录保护、管理后台 Session 鉴权、以及对提示词库内容的完整增删改查 (CRUD) 维护后台。

### 包含 (In Scope)
1. **管理员登录与鉴权**：
   - 建立 `/admin/login` 页面，提供管理员账号、密码输入框，采用极致的暗黑主题风格与输入反馈。
   - 实现管理后台登录 API。在服务器端读取数据库中的 `AdminUser`，使用 `bcryptjs` 进行密码哈希校验。
   - 登录成功后，下发 HTTP-only、Secure、SameSite=Lax 的 Session Cookie，用于凭证维持。
   - 退出登录 API，清除 Session Cookie。
2. **管理后台访问保护**：
   - 使用 Next.js Middleware 或 Server-side Layout Session 校验，保护所有以 `/admin` 开头的子路由（除了 `/admin/login`）。
   - 未登录的请求访问 `/admin` 时，自动重定向到 `/admin/login`；已登录的请求在 `/admin/login` 时自动重定向到 `/admin`。
3. **内容管理看板**：
   - 实现 `/admin` 首页列表展示，包括所有状态的提示词（DRAFT, PUBLISHED, ARCHIVED），支持按分类、状态、精选标记进行过滤，并清晰显示浏览计数与复制计数。
4. **提示词 CRUD 表单功能**：
   - **新建提示词** (`/admin/new`)：提供完整的输入表单，支持设置标题、Slug、摘要、正文、分类选择（读取数据库 Category 列表）、标签（多选或逗号输入自动创建/关联）、示例输入、示例输出、结构化拆解五要素、对比优化前后及说明、发布状态（草稿/发布/归档）。
   - **编辑提示词** (`/admin/edit/[id]`)：回显数据并支持完整更新保存。
   - 表单提交时进行严格的前后端验证，如 Slug 唯一性校验，防止数据库冲突。
5. **数据自动关联维护**：
   - 添加或修改 Prompt 时，能自动关联已存在的 Tag；若遇到新标签，在后台直接生成对应记录并关联。

### 不包含 (Out of Scope)
- 不做多管理员账号体系与 RBAC 细粒度权限控制。
- 不集成复杂的富文本编辑器（普通 Markdown 支持的 Textarea 已足够满足提示词的管理需求）。
- 不支持分类 (Category) 的独立后台编辑，仅支持提示词与分类的关联选择。
- 不支持历史版本回滚或多人协同编辑冲突锁。

## 2. 验收标准 (Acceptance Criteria)

- **强登录保护**：在未登录状态下，尝试手动在浏览器访问 `/admin` 或 `/admin/edit/1`，必须被强制拦截重定向至 `/admin/login`。
- **密码防泄露**：密码在数据库中以 `bcrypt` 高强度哈希存储，不可逆向泄露明文。
- **发布逻辑生效**：管理员在后台将提示词状态设为 `DRAFT` 时，公开首页、`/prompts` 及详情页不可读取；设为 `PUBLISHED` 时公开立即可见；设为 `ARCHIVED` 时归档隐藏。
- **完整编辑链路**：支持从“后台新建 -> 设置为 PUBLISHED -> 公开页面搜索并复制 -> 后台编辑改名 -> 公开页同步更新”的闭环测试，确保数据库级联操作正常（如 Tag 关联不丢失）。
- **验证通过**：运行 `npm run verify` 全部通过，密码校验与会话拦截运行平稳。

## 3. 验证方式 (Verification Methods)

- **自动化测试**：
  - `npx vitest run tests/auth/`：验证管理员密码 Hash 加盐与校验过程。
- **手动浏览器检查**：
  - 登录保护测试：未登录拦截，已登录畅行，注销彻底。
  - 内容闭环验证：发布/下架/精选标记在首页与列表页实时渲染比对。
- **统一验证**：
  - 必须通过 `npm run verify`。
