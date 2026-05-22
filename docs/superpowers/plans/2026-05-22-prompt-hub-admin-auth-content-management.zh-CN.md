# Prompt Hub 管理员安全登录与内容维护后台实施计划

日期：2026-05-22
关联 Feature：`M2-002`

**目标：** 实现单管理员的 Bcrypt 强校验安全登录、基于 HTTP-only Cookie 的全局会话维持与路由拦截，并在此基础上构建对提示词库内容的完整管理工作台（增删改查 CRUD 并支持分类及标签级联）。

---

## 1. 详细任务分解

### Task 1: 默认管理员加盐 Seed 预设
- [ ] 修改 `prisma/seed.ts`：使用 `bcryptjs` 库计算默认账号 `admin` 与默认密码 `admin123` 的 12 轮哈希值，当管理员表为空时，预写入该账号信息以供登录。

### Task 2: 管理后台登录鉴权 API
- [ ] 编写 `/api/admin/auth/login` 端点，验证提交的用户名及密码。
- [ ] 密码使用 `bcrypt.compare` 执行高安全度匹配。
- [ ] 匹配成功后，下发加密的管理员 Token Cookie。Cookie 必须设为 `httpOnly: true`、`secure: true` (在生产环境)、`sameSite: "lax"`，阻止客户端脚本窃取。
- [ ] 编写 `/api/admin/auth/logout` 清除该 Cookie。

### Task 3: 路由访问防火墙 (Middleware Router Guards)
- [ ] 在根目录创建 `middleware.ts`。
- [ ] 对 `/admin` 子路径（除 `/admin/login`）拦截检查 Cookie，无凭证者 `302` 重定向跳转至 `/admin/login`。
- [ ] 登录成功后试图访问 `/admin/login` 者，重定向回 `/admin` 工作台。

### Task 4: 工作台看板开发
- [ ] 重构 `app/admin/page.tsx`：
  - 加载暗黑主题，以精美卡片表格展示所有 Prompt 属性。
  - 支持按发布状态（DRAFT/PUBLISHED/ARCHIVED）和分类过滤。
  - 清晰显示对应提示词被公开复制和浏览的累计计数。

### Task 5: 提示词增删改查表单 (Prompt CRUD Form)
- [ ] 新建 `app/admin/new/page.tsx` 与 `app/admin/edit/[id]/page.tsx`：
  - 使用双栏响应式表单，一侧配置主体文字及拆解，另一侧配置发布属性和分类。
  - 实现标签 (Tag) 逗号分割输入合并逻辑：在入库时，解析并关联已有 Tag；若 Tag 不存在则自动新增再关联，级联保存。
  - 上架与下架切换：设置状态后即刻在公开页和数据库表现中联动生效。

---

## 2. 验证步骤

- **单元测试**：
  - 运行 `npx vitest run tests/auth/` 确保 Bcrypt 哈希及比对工具正确无误。
- **手动检查**：
  - 验证未授权拦截与注销失效。
  - 验证草稿与归档的提示词，在公开列表中无论通过搜索还是链接访问均不可见。
- **构建保证**：
  - 运行 `npm run verify` 以打包无误。
