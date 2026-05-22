# Prompt Hub AI 真实接入与 IP 限流设计规格

日期：2026-05-22
关联 Feature：`M2-001`

## 1. 背景

Prompt Hub 目前处于首发版本，公开页面 `/prompts` 提示词库内容可用，但核心的 AI 文本生成器 (`/generator`) 与 AI 图片转提示词工具 (`/image-to-prompt`) 依旧使用 Mock 定时器模拟生成流程。

为正式交付可用的 v0.1 版本，本设计规格将明确如何将 Mock 替换为真实的多模态与大语言模型 AI 服务，并解决开放 AI 访问后所需的流量防刷限流与匿名用户隐私合规（IP 限流安全防泄）问题。

## 2. 核心架构设计

### 2.1 统一 AI Provider 抽象

通过 `lib/ai/types.ts` 定义接口，隔离业务端与具体大模型底座：

```typescript
export interface AIProvider {
  name: string;
  modelName: string;
  generateTextPrompt(input: TextPromptInput): Promise<TextPromptResult>;
  optimizePrompt(input: OptimizePromptInput): Promise<TextPromptResult>;
  rewriteWithTemplate(input: TemplateRewriteInput): Promise<TextPromptResult>;
  generatePromptFromImage(input: ImagePromptInput): Promise<ImagePromptResult>;
  analyzeDesignFromImage(input: ImagePromptInput): Promise<ImagePromptResult>;
}
```

配置 `lib/ai/provider.ts` 做工厂分发，依赖环境变量 `AI_PROVIDER`：
- `mock`：分发至 `createMockAIProvider()`，提供单元测试和本地零环境运行时。
- `openai-compatible`：分发至 `createOpenAICompatibleProvider()`，支持使用第三方 OpenAI 兼容网关 (如 DeepSeek, OneAPI, Azure OpenAI, 官方 OpenAI 等)。

#### 2.2 环境变量定义
```bash
AI_PROVIDER=openai-compatible
OPENAI_API_KEY=sk-...
OPENAI_API_BASE=https://api.openai.com/v1
TEXT_MODEL=gpt-4o-mini
VISION_MODEL=gpt-4o-mini
RATE_LIMIT_TEXT_DAILY=10
RATE_LIMIT_IMAGE_DAILY=3
```

---

### 2.3 图像反向提取设计 (Vision Integration)

`/image-to-prompt` 的核心大模型交互基于多模态视觉 API：
1. **多模态输入**：图像转换为 Base64 格式，同 Prompt 一并组装发送至 OpenAI Vision 接口：
   ```json
   {
     "role": "user",
     "content": [
       { "type": "text", "text": "系统级指令..." },
       { "type": "image_url", "image_url": { "url": "data:image/png;base64,..." } }
     ]
   }
   ```
2. **零物理存储保护 (Privacy Guard)**：
   - Next.js API `/api/analyze-image` 接收客户端发来的 `multipart/form-data`。
   - 在内存中读取为 `Buffer`，立即编码为 Base64，调用 API。
   - **绝对不写入服务器本地磁盘，也不上传任何长期云存储（如 OSS/S3）**。
3. **输出模式**：
   - **Flux 风格大师级提示词**：返回经过结构优化的英文自然语言长句。
   - **Nano Banana 结构化蓝图**：要求模型以 JSON 格式返回构图、光影、色彩等 50+ 个细分字段，通过 System Prompt 强制规范 JSON Schema。

---

### 2.4 流式文本生成设计 (Streaming Architecture)

`/generator` 涉及长时间的文本生成与优化。为保障高实时交互体验，采用 Server-Sent Events (SSE) 或 `ReadableStream` 流式接口：
1. **流式 API 路由 `/api/generate`**：
   - 检查 IP 限流是否超出。
   - 调用 OpenAI 兼容的 `stream` 模式。
   - 将流式的 Chunk 数据转发给客户端，保持 Keep-Alive 头部：
     ```text
     Content-Type: text/event-stream
     Cache-Control: no-cache
     Connection: keep-alive
     ```
2. **记录生成指标**：
   - 生成流结束后，异步或同步在数据库 `GenerationRecord` 中新增一条记录。
   - 保存字段：类型（文本生成/优化）、输入摘要、输出结果、消耗耗时等。

---

### 2.5 Hashed IP 每日限流设计 (Hashed IP Rate Limiting)

为防止接口被高并发恶意消耗，且不违反 GDPR 等隐私条例，本设计方案如下：
1. **IP 单向哈希**：
   - 提取请求头中的客户端 IP（处理 `x-forwarded-for` 和 `connection.remoteAddress` 组合）。
   - 使用 SHA-256 对 IP 字符串进行单向加盐哈希，并截取前 24 位十六进制作为 `ipHash`，彻底杜绝在数据库中存有真实 IP 的明文：
     ```typescript
     import { createHash } from "node:crypto";
     export function hashIp(ip: string): string {
       return createHash("sha256").update(ip).digest("hex").slice(0, 24);
     }
     ```
2. **频率控制与数据库校验**：
   - 限流判定不引入 Redis，避免架构过重，直接使用现有 MySQL 中的 `GenerationRecord` 表进行计数。
   - 拦截请求时，查询当前 `ipHash` 在当天零点（基于服务器时区）之后创建的 `GenerationRecord` 记录数：
     ```typescript
     const todayCount = await prisma.generationRecord.count({
       where: {
         ipHash: ipHash,
         createdAt: {
           gte: startOfToday
         },
         type: typeGroup // 'TEXT' 或 'IMAGE'
       }
     });
     ```
   - 若 `todayCount >= getDailyLimit(type)`，直接返回 `429 Too Many Requests`。

---

## 3. 前端交互接口规范

### 3.1 文本提示词生成 `/api/generate`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "type": "TEXT_GENERATE" | "TEXT_OPTIMIZE" | "TEMPLATE_REWRITE",
    "goal": "提示词目标",
    "framework": "crispe" | "costar" | "default",
    "tone": "专业" | "亲和力" | "严谨",
    "originalPrompt": "优化前的提示词 (仅当类型为 OPTIMIZE 时使用)"
  }
  ```
- **Response**: SSE 流式文本，每一段输出直接代表增量文本。
- **Errors**:
  - `420` / `429`: "今日文本生成额度 (10次) 已用尽，请明天再试"

### 3.2 图片转提示词 `/api/analyze-image`
- **Method**: `POST`
- **Request Body**: `multipart/form-data`（包含字段 `file`: Image File, `mode`: "image-generation" | "design-analysis"）
- **Response**:
  ```json
  {
    "naturalPrompt": "Flux AI description...",
    "jsonBlueprint": { ... },
    "chineseExplanation": "识图辅助中文分析说明..."
  }
  ```
- **Errors**:
  - `400`: "图片格式不支持或文件过大（超 4MB）"
  - `429`: "今日图片分析额度 (3次) 已用尽，请明天再试"

---

## 4. 验证计划

### 4.1 自动化单元测试
- 编写 `tests/ai/openai-compatible.test.ts`：验证 API Gateway 正确拼装和 Fetch 调用逻辑。
- 完善 `tests/rate-limit/rules.test.ts`：确保不同 IP 和相同 IP 在不同日期下算出来的 Hash 唯一且隔离，限流阈值正确拦截。

### 4.2 模拟生产环境手动验证
- 在 `.env.local` 配置真实 API 钥匙，触发 `/generator` 生成 11 次，验证第 11 次是否被正确返回 429。
- 上传不同大小和格式的图片，测试视觉识别流，并验证数据库 `GenerationRecord` 中图片 Base64 绝不留底。
- 执行 `npm run verify` 以保证无编译级降级。
