# Prompt Hub Design Spec

## 1. Product Positioning

Prompt Hub is a Chinese-first AI prompt tool portal. It helps public users find curated prompts, learn why good prompts work, and generate or improve prompts with AI. The most distinctive v0.1 tool is image-to-prompt: users upload a reference image and receive an image-generation prompt, a structured JSON description, and a Chinese explanation.

The product should feel like a focused tool site rather than a broad community. The layout direction follows the tool-first pattern selected during brainstorming: an immediate action area at the top, supporting learning content below, SEO-friendly explanation sections, FAQ, and related tool links.

## 2. Target Users

### Public Users

Public users do not need accounts. They can:

- Browse curated prompts.
- Search and filter prompts.
- Copy prompts.
- Learn prompt structure through examples and breakdowns.
- Generate new prompts from text goals.
- Optimize existing prompts.
- Rewrite prompts from templates.
- Upload images to generate image prompts or design-analysis prompts.

### Administrator

The administrator signs in at `/admin/login` and maintains the prompt content. v0.1 supports a simple database-backed administrator account with bcrypt password hashing and HTTP-only cookie sessions.

## 3. v0.1 Scope

### In Scope

- Responsive public website.
- Tool-style homepage.
- Image-to-prompt page.
- Text prompt generator page.
- Curated prompt library with 20 high-quality prompts.
- Prompt detail page with learning breakdown.
- Admin login.
- Admin prompt management.
- Admin category and tag management.
- Seed content from files into MySQL.
- AI provider abstraction using an OpenAI-compatible API shape.
- Real image understanding through the configured vision provider.
- Simple IP-based rate limiting.
- Basic public statistics: view count and copy count.

### Out of Scope

- Public user accounts.
- Favorites.
- Comments.
- Ratings.
- Payments.
- Multi-admin permission roles.
- Long-term image storage.
- Community prompt publishing.
- Vector search or semantic recommendation.
- Full bilingual site content.
- Native mobile app.

## 4. Information Architecture

### Routes

```text
/                  Tool-style portal homepage
/image-to-prompt   Main image-to-prompt SEO tool page
/generator         Text prompt generator and optimizer
/prompts           Curated prompt library
/prompts/[slug]    Prompt detail and learning breakdown
/learn             Prompt writing guides
/admin/login       Admin login
/admin             Admin dashboard
/admin/prompts     Admin prompt management
/admin/categories  Admin category and tag management
```

### Homepage

The homepage is a tool portal, not a traditional directory page. It should use a tool-first layout inspired by the Genkee-style reference shared by the user, while keeping original copy, visual design, naming, and interaction details.

Homepage sections:

1. Top navigation: logo, Image to Prompt, Generator, Prompt Library, Learn, Login.
2. Hero: short value proposition and three primary entries.
3. Primary entries: Image to Prompt, Text Prompt Generator, Prompt Library.
4. Featured categories: office, study, coding, writing, marketing, image/video.
5. Featured and popular prompts: editor-selected prompts and high-copy prompts.
6. How it works: find prompts, inspect breakdowns, generate your own version.
7. FAQ.
8. Footer links.

### Image-To-Prompt Page

`/image-to-prompt` is the most complete SEO tool page in v0.1.

Page sections:

1. Tool title and concise explanation.
2. Upload area with drag-and-drop and click upload.
3. Supported formats: PNG, JPG, WEBP.
4. Mode selection:
   - Image-generation prompt.
   - Design-analysis prompt.
5. Result area:
   - Natural language prompt.
   - JSON structured description.
   - Chinese explanation and breakdown.
   - Copy buttons.
6. How it works.
7. Why use this tool.
8. Long-form SEO explanation.
9. FAQ.
10. Related tools.

Images are never stored long-term. The server receives the image buffer, validates it, sends it to the configured vision provider, returns the result, and discards the buffer.

### Generator Page

`/generator` has four modes:

- Generate new prompt.
- Optimize existing prompt.
- Rewrite with template.
- Image prompt entry.

The image prompt entry can link to `/image-to-prompt` to avoid duplicate implementation.

### Prompt Library

`/prompts` lists 20 curated prompts for v0.1. Search and filters should support category and task tags. The first content set should favor quality over quantity.

Initial content distribution:

```text
Office efficiency: 4
Learning growth: 3
Coding and agent workflows: 4
Writing and creation: 3
Marketing and e-commerce: 3
Image and video: 3
```

### Prompt Detail Page

`/prompts/[slug]` is the main learning surface.

Each prompt detail page includes:

- Title.
- Category and tags.
- Applicable scenario.
- Prompt body.
- Copy button.
- Example input.
- Example output.
- Structure card:
  - Role.
  - Task.
  - Context.
  - Constraints.
  - Output format.
- Weak prompt versus improved prompt.
- Explanation of why the improved version is better.
- Related prompts.

## 5. Language Strategy

The interface is Chinese-first.

Prompt generation output supports:

- Chinese.
- English.
- Chinese and English.

Image-to-prompt defaults to an English prompt because image-generation models generally respond well to English prompts, but the page also shows a Chinese explanation.

Prompt library explanations are Chinese-first. Prompt bodies may include English where that improves model performance.

## 6. Technical Architecture

### Stack

```text
Next.js App Router
TypeScript
MySQL
Prisma
Tailwind CSS
shadcn/ui
bcrypt
HTTP-only cookie sessions
OpenAI-compatible AI provider abstraction
```

### Proposed Directory Structure

```text
D:\aiproject\prompt-hub
├── app/
│   ├── page.tsx
│   ├── image-to-prompt/page.tsx
│   ├── generator/page.tsx
│   ├── prompts/page.tsx
│   ├── prompts/[slug]/page.tsx
│   ├── learn/page.tsx
│   └── admin/
├── components/
│   ├── site/
│   ├── prompt/
│   ├── generator/
│   └── admin/
├── lib/
│   ├── ai/
│   ├── auth/
│   ├── db/
│   ├── rate-limit/
│   └── seed/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── content/
│   └── seed-prompts/
├── docs/
├── AGENTS.md
├── progress.md
└── feature_list.json
```

## 7. Data Model

### AdminUser

```text
id
username
passwordHash
createdAt
updatedAt
```

### Prompt

```text
id
slug
title
summary
content
exampleInput
exampleOutput
structureRole
structureTask
structureContext
structureConstraints
structureOutputFormat
weakPrompt
improvedPrompt
improvementNotes
language
status: draft / published / archived
isFeatured
copyCount
viewCount
categoryId
createdAt
updatedAt
```

### Category

```text
id
slug
name
description
sortOrder
```

### Tag

```text
id
slug
name
```

### PromptTag

```text
promptId
tagId
```

### GenerationRecord

```text
id
type: text_generate / text_optimize / template_rewrite / image_to_prompt / design_analysis
inputSummary
outputPrompt
outputJson
outputExplanation
language
providerName
modelName
ipHash
createdAt
```

There is no image table in v0.1. Uploaded images are not stored.

## 8. Content Management

The project uses a hybrid content workflow:

```text
content/seed-prompts/*.json or *.md
↓
Prisma seed script
↓
MySQL Prompt, Category, and Tag records
↓
Admin UI can edit, publish, archive, and feature records
```

This keeps the first version easy to seed while allowing ongoing content maintenance through the admin UI.

## 9. AI Provider Design

### Files

```text
lib/ai/types.ts
lib/ai/provider.ts
lib/ai/openai-compatible-provider.ts
lib/ai/prompt-builder.ts
lib/ai/mock-provider.ts
```

### Interface

```text
generateTextPrompt(input)
optimizePrompt(input)
rewriteWithTemplate(input)
generatePromptFromImage(input)
analyzeDesignFromImage(input)
```

### Environment Variables

```env
AI_PROVIDER=openai-compatible
AI_BASE_URL=
AI_API_KEY=
AI_TEXT_MODEL=
AI_VISION_MODEL=
AI_TIMEOUT_MS=30000
```

The implementation should not bind the product to a single model vendor. The first provider uses OpenAI-compatible request semantics, and environment variables choose the actual endpoint and models.

## 10. Image-To-Prompt Flow

```text
User uploads image
↓
Frontend previews image locally
↓
Server validates format and size
↓
Server reads temporary buffer without writing long-term storage
↓
Vision provider analyzes image
↓
Server returns:
  - naturalPrompt
  - jsonBlueprint
  - chineseExplanation
↓
Server stores GenerationRecord without saving the image
```

Validation rules:

- Accept PNG, JPG, JPEG, WEBP.
- Reject unsupported MIME types.
- Enforce a configurable maximum file size.
- Return clear Chinese error messages.

## 11. Rate Limiting

Public users are unauthenticated, so AI cost control is required.

Default behavior:

```text
Text generation: 10 requests per IP per day
Image analysis: 3 requests per IP per day
Admin: unrestricted
```

Environment variables:

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_TEXT_DAILY=10
RATE_LIMIT_IMAGE_DAILY=3
```

Rate limit records may be implemented with a simple database-backed counter keyed by hashed IP and date. Raw IP addresses should not be stored.

## 12. Admin Authentication

Admin login uses:

- Database-backed admin user.
- bcrypt password hash.
- HTTP-only cookie session.
- `/admin` route protection.

v0.1 does not include multiple roles, third-party login, public user login, or password reset.

## 13. Quality Gates

The project should expose one verification command:

```bash
npm run verify
```

The command should cover:

- `npm run lint`.
- `npm run typecheck`.
- `npm run test`.
- `npm run build`.
- `npx prisma validate`.

Recommended test coverage:

- AI provider mock tests.
- prompt-builder tests.
- rate-limit tests.
- auth/session tests.
- admin login flow E2E.
- image upload mock E2E.
- prompt copy and view count behavior.

## 14. Harness Requirements

The project should include the agent collaboration files from the user's harness style:

```text
AGENTS.md
progress.md
feature_list.json
docs/product/mvp_spec.md
docs/features/
docs/testing/README.md
docs/architecture/decisions/
```

Implementation should start only after:

- The design spec is reviewed.
- A detailed implementation plan is written.
- The MVP scope is reflected in harness documents.

## 15. Design Decisions

- Use Next.js full-stack architecture rather than Vue plus Spring Boot because this is a content/tool website with SEO needs and a compact first version.
- Use MySQL because the user prefers it and the v0.1 data is relational.
- Use Prisma to keep schema, migrations, and seed scripts easy for agents to understand.
- Use a tool-style portal instead of a broad directory homepage.
- Make `/image-to-prompt` the strongest SEO tool page.
- Do not store uploaded images.
- Keep public users anonymous in v0.1.
- Support copy counts and editor-featured prompts instead of ratings or comments.

## 16. Implementation Defaults

- Local development defaults to `AI_PROVIDER=mock` so the app can be built and tested without an API key.
- Real AI calls use `AI_PROVIDER=openai-compatible` with `AI_BASE_URL`, `AI_API_KEY`, `AI_TEXT_MODEL`, and `AI_VISION_MODEL` supplied through environment variables.
- The default maximum image upload size is 8 MB, configurable through `IMAGE_UPLOAD_MAX_MB`.
- v0.1 admin dashboard shows aggregate generation counts and the latest generation records, but it does not expose uploaded images because images are not stored.
- The first 20 seed prompts should be AI-assisted but human-reviewed before being marked as published.
