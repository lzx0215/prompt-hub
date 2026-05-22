# Feature: M2-001 AI Integration & Rate Limiting

## 1. 范围 (Scope)

本 Feature 实现 AI 真实生成流程、图片转提示词的视觉大模型处理、以及基于 IP 哈希的匿名用户每日限流控制。

### 包含 (In Scope)
1. **统一 AI Provider 抽象与实现**：
   - 增加 OpenAI 兼容的真实多模态/文本 AI 接口实现 (`lib/ai/openai-compatible-provider.ts`)。
   - 通过环境变量控制开关 (`AI_PROVIDER=mock|openai-compatible`)。
   - 支持主流文本提示词生成/优化以及基于 OpenAI 视觉 API (`gpt-4o-mini` 或其他兼容视觉模型) 进行反向提示词提取。
2. **文本生成流式 API**：
   - 实现 `/api/generate` Route Handler，接收用户表单输入，校验限流后，调用 AI Provider，并将结果实时以 JSON 块或 SSE 方式返回。
   - 生成成功后自动向数据库 `GenerationRecord` 表写入记录（包括 `ipHash`、生成类型、输入摘要、输出结果等）。
3. **图像反向提取 API**：
   - 实现 `/api/analyze-image` Route Handler，接收 Multipart 格式上传的图片，限制文件最大为 4MB，仅支持 PNG, JPG, JPEG, WEBP, HEIC。
   - 读取图片 File Buffer 并转成 Base64，调用 AI Provider Vision 接口。
   - **安全与隐私**：绝不在服务器本地或云端长期存储用户上传的图片文件，处理完即丢弃。
   - 分析成功后记录数据库 `GenerationRecord`。
4. **基于 IP 哈希的每日限流 Guardrails**：
   - 实现 `lib/rate-limit/rules.ts` 中的限流判断。
   - 匿名用户每日限额：文本提示词 10 次，图片转提示词 3 次。
   - 使用 SHA-256 单向哈希计算访客 IP 并附加当前日期，在数据库 `GenerationRecord` 中统计当天已消耗频次，防止 GDPR/PII 泄露。
5. **前端界面真实连接**：
   - 重构 `/generator` 页面，将模拟打字效果替换为真实的 Server 流式响应展示，实现真正的 CRISPE / CO-STAR 提示词生成和优化。
   - 重构 `/image-to-prompt` 页面的 `ImageUploader`，真正通过 `multipart/form-data` 上传文件到 API，提取真实的自然语言描述和 JSON 结构蓝图，并支持真正的复制与二次应用。

### 不包含 (Out of Scope)
- 不保存用户上传的原始图片（只做内存/临时 Buffer 处理，不写磁盘，不上盘云存储）。
- 不引入普通用户登录、历史记录看板、收藏或付费额度体系。
- 图像提取过程中不包含图像编辑、剪裁、分辨率放大或多图合并分析。

## 2. 验收标准 (Acceptance Criteria)

- **AI 兼容**：当 `AI_PROVIDER=mock` 时，前端所有功能稳定使用 Mock 静态返回值；当 `AI_PROVIDER=openai-compatible` 且配置 API Key 后，能够调用真实的 OpenAI/DeepSeek/OneAPI 服务并成功生成内容。
- **流式体验**：文本生成在前端以流式字符动态展示，无明显卡顿，支持随时复制已生成的部分。
- **识图功能**：上传有效 PNG/JPG 图片后，数秒内展示对应的 Flux 自然语言描述与 Nano Banana 格式 JSON 蓝图，无报错。
- **严格限流**：同一 IP 在一天内（按服务器时区日期）请求 `/api/generate` 超过 10 次、或 `/api/analyze-image` 超过 3 次时，接口直接返回 `429 Too Many Requests`，前端友好显示“今日额度已用完，请明天再试”。
- **隐私合规**：数据库中没有任何 IP 明文记录，全部哈希化为 24 位十六进制 SHA-256 字符串，且无图片物理存储。
- **测试通过**：所有的 AI Provider 测试、密码验证测试、限流规则测试、API 路由测试全部 100% 通过。

## 3. 验证方式 (Verification Methods)

- **自动化测试**：
  - `npx vitest run tests/ai/`：验证统一 AI Provider 行为。
  - `npx vitest run tests/rate-limit/`：验证每日限流 Key 生成及限流拦截器逻辑。
- **构建与校验**：
  - 运行 `npm run verify` 确保 Lint、Prisma Schema、Typecheck、Vitest 与 Next.js Production Build 全部一次性通过。
