# Prompt Hub AI 真实接入与 IP 限流实施计划

日期：2026-05-22
关联 Feature：`M2-001`

**目标：** 实现统一的 AI 驱动接口，连接真实的 OpenAI 兼容大模型 API，打通文本提示词生成/优化流式接口和图片识图接口，并建立基于单向 IP 哈希的安全防刷限流屏障。

---

## 1. 详细任务分解

### Task 1: 真实 AI Provider 接入与驱动分发
- [ ] 新建 `lib/ai/openai-compatible-provider.ts`，使用原生 fetch 连接 `process.env.OPENAI_API_BASE`，实现文本生成/优化流式封装，以及 Vision 视觉识别 Base64 并输出自然语言描述和 JSON 结构体。
- [ ] 修改 `lib/ai/provider.ts` 支持实例化 `openai-compatible` 类型并使用对应的环境变量。

### Task 2: API 路由开发
- [ ] 创建 `/api/generate` 接口：
  - 校验 IP 限流是否到达阈值。
  - 获取 OpenAI 流式响应，将字节流转化为 Server-Sent Events (SSE) 持续下发。
  - 响应结束后，向 `GenerationRecord` 保存一条持久化生成记录。
- [ ] 创建 `/api/analyze-image` 接口：
  - 支持 `multipart/form-data` 上传文件，做类型 (PNG/JPG/WEBP) 与大小 (<=4MB) 验证。
  - 直接读取图片 File Buffer 并在内存转换为 Base64。
  - **绝对不向本地盘和云盘持久化写入任何图片**，保证隐私合规。
  - 校验 IP 限流后，调用 Vision API 获取 Flux 英文描述与 Banana JSON 蓝图，保存 `GenerationRecord`。

### Task 3: IP Hashed 每日限流机制
- [ ] 完善 `lib/rate-limit/rules.ts` 中的 `hashIp` 与拦截计数。
- [ ] 使用 SHA-256 加盐单向哈希隐藏 IP 明文。
- [ ] 在 `/api/generate` 和 `/api/analyze-image` 的入参过滤中，查询数据库中当日该哈希 IP 的调用次数，拦截超限请求（返 429）。

### Task 4: 前端交互真实打通
- [ ] 升级 `components/image-to-prompt/ImageUploader.tsx`，改用真实的上传 API 驱动，渲染真实的识别结果和 JSON 蓝图，打通一键复制。
- [ ] 升级 `app/generator/page.tsx`，读取 `/api/generate` 流式块并更新状态，取代原有的 Mock 倒计时和预设静态模板。

---

## 2. 验证步骤

- **自动化测试**：
  - 运行 `npx vitest run tests/ai/` 保证驱动封装完美。
  - 运行 `npx vitest run tests/rate-limit/` 验证 Hashed 逻辑安全无虞。
- **构建保证**：
  - 运行 `npm run verify`。
