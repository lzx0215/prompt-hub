# Prompt Hub 管理员安全登录与内容维护后台设计规格

日期：2026-05-22
关联 Feature：`M2-002`

## 1. 背景

Prompt Hub v0.1 公开提示词库的内容目前仅依赖在工程初始化阶段导入的 20 条静态 Seed 数据。为了能让管理员在线补充新内容、编辑现有提示词的五要素结构及优化对比、控制上架下架状态，系统必须提供一个安全的、完全隔离的内容管理后台。

普通用户应当保持完全免登录，整个管理后台均围绕单管理员账号的安全登录机制展开，满足 v0.1 轻量但高保真的安全规范。

---

## 2. 核心架构设计

### 2.1 单管理员密码安全设计 (Cryptography)

1. **强哈希保护**：管理员的密码并不在数据库中明文保存，而是使用 `bcryptjs` 执行 12 轮 (Salt Rounds) 的不可逆哈希运算，得到 60 位的密码哈希串保存于 `AdminUser.passwordHash` 字段中。
2. **种子导入支持**：在 `prisma/seed.ts` 中提供单管理员的初始化导入逻辑，当表为空时，自动写入默认账号：
   - 默认账号：`admin`
   - 默认密码：`admin123`（在生产环境启动时必须使用环境变量或后续后台修改强制更换密码以确保安全）。

---

### 2.2 HTTP-only Session 会话管理 (Session Management)

为了防范 XSS（跨站脚本攻击），会话令牌以 **HTTP-only Cookie** 形式下发，客户端 JavaScript 脚本无法读取。

1. **Session 凭证下发**：
   - 用户访问 `/api/admin/auth/login` 进行账户匹配。
   - 登录验证成功后，使用签名或高强度随机 UUID（或轻量级 JSON Web Token）作为 Session ID。
   - 考虑到 v0.1 的简洁度与无状态属性，采用加密/签名的 **JWT** 或简单的数据库 Session 均可。这里推荐采用轻量级 **JWT**（包含账号、ID 及签名），或用简单的高安全随机值，本规格采用基于 Cookie 的 Session Token，设置安全选项：
     - `httpOnly: true` (防脚本盗用)
     - `secure: process.env.NODE_ENV === "production"` (仅在 HTTPS 下传输)
     - `sameSite: "lax"` (防止 CSRF 跨站请求伪造)
     - `path: "/"` (整站生效)
     - `maxAge: 60 * 60 * 2` (会话有效时长 2 小时)
2. **会话校验拦截 (Middleware Guard)**：
   - 编写 Next.js Middleware (位于根目录 `middleware.ts`)，拦截所有访问 `/admin` 开头的子路由请求：
     - 如果请求未携带有效的 Session Cookie，且访问的不是 `/admin/login`，则统一返回 `302 Found` 重定向至 `/admin/login`。
     - 如果访问的是 `/admin/login` 且请求携带有效 Session 证明，则重定向至 `/admin` 看板页。

---

### 2.3 内容 CRUD 管理看板设计 (Backoffice UX)

管理员后台位于 `/admin` 主体，提供完整的桌面端流畅维护体验：
1. **工作台看板**：
   - 清晰列表显示 `Prompt` 数据，分页展示，呈现核心属性：标题、Slug、关联分类、状态标签（DRAFT, PUBLISHED, ARCHIVED）、是否精选（Featured）。
   - 展示公开累计浏览数与复制数。
2. **新建/编辑表单 (Responsive Form Layout)**：
   - 双栏响应式表单，包含内容区与配置侧边栏。
   - **基础设置**：标题、唯一 Slug（自动根据标题转换拼音/英文并允许自定义）、分类下拉选择、标签文本框（支持英文或中文逗号分割）。
   - **核心内容设置**：提示词正文大文本域、示例输入、示例输出。
   - **结构拆解五要素**：角色 (Role)、任务 (Task)、上下文 (Context)、约束条件 (Constraints)、输出格式 (Output Format)。
   - **优化对比**：普通版提示词、优化版提示词、改进解析说明。
   - **状态发布控制**：状态选择器（DRAFT/PUBLISHED/ARCHIVED）、是否精选 (Featured) 开关。
3. **数据关联及清理逻辑**：
   - 标签处理：提交提示词表单时，服务器端自动解析标签字符串：
     - 精准拆分为标签数组，过滤重复与空值。
     - 在数据库中对已存在的 Tag 进行关联 (Connect)；若 Tag 不存在，则先在 Tag 表中创建 (Create)，再行关联。
     - 清除此前关联但已被删除的标签，避免产生标签悬空。

---

## 3. 前端与 API 规范

### 3.1 鉴权 API：`/api/admin/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  { "username": "admin", "password": "..." }
  ```
- **Response (Success)**:
  - Headers: `Set-Cookie: admin_session=...; HttpOnly; SameSite=Lax; Path=/`
  - Body: `{ "success": true, "message": "登录成功" }`
- **Response (Failure)**:
  - Status `401`: `{ "success": false, "message": "用户名或密码错误" }`

### 3.2 CRUD 提示词 API (或 Next.js Server Actions)
为了实现极其清爽的数据交互，推荐使用 Server Actions：
- `createPrompt(formData)`: 创建新 Prompt，自动校验 Slug 冲突。
- `updatePrompt(id, formData)`: 更新 Prompt。
- `deletePrompt(id)`: 标记状态为 `ARCHIVED` 或彻底从数据库物理删除。

---

## 4. 验证计划

### 4.1 会话安全测试
- 使用未认证的无痕浏览器直接访问 `/admin`，预期被拦截并跳转回 `/admin/login`。
- 登录认证成功后，再次访问 `/admin` 成功加载后台主页。
- 点击注销，验证 Cookie 是否被成功清除，重新访问后台被阻断。

### 4.2 提示词内容上架状态测试
1. 在后台新建一条草稿提示词 `status = DRAFT`，在公开页 `/prompts` 进行全局搜索，验证该提示词绝不能出现。
2. 在后台编辑该提示词，将状态改为 `PUBLISHED`，返回公开页刷新，验证提示词能够被正常搜索到、查看详情，并能成功点击复制。
3. 在后台将该提示词改回 `DRAFT` 或 `ARCHIVED`，再次刷新公开页，验证详情页返回 404 (Not Found)。

### 4.3 统一自动化测试
- 确保 `tests/auth/password.test.ts` 以及后续新增的后台鉴权测试全部 100% 绿色通过。
- 运行 `npm run verify` 以完成整体编译和静态类型检查。
