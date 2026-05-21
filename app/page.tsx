import { getFeaturedPublicPrompts, getPublicPromptFilterOptions } from "@/lib/prompts/public-query";
import { ToolEntryGrid } from "@/components/home/ToolEntryGrid";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedPrompts } from "@/components/home/FeaturedPrompts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ categories }, featuredPrompts] = await Promise.all([
    getPublicPromptFilterOptions(),
    getFeaturedPublicPrompts(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-indigo-600">Prompt Hub</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          找提示词、看拆解、复制使用
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Prompt Hub 是中文优先的 AI 提示词工具型门户。浏览精选提示词库，学习提示词结构和优化技巧，直接复制高质量提示词使用。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-slate-950">核心工具</h2>
        <ToolEntryGrid />
      </section>

      <section className="mt-12">
        <FeaturedCategories categories={categories} />
      </section>

      <section className="mt-12">
        <FeaturedPrompts prompts={featuredPrompts} />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold text-slate-950">使用流程</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-5">
            <div className="text-2xl font-bold text-indigo-600">1</div>
            <h3 className="mt-2 font-semibold text-slate-950">搜索和筛选</h3>
            <p className="mt-1 text-sm text-slate-600">按关键词、分类或标签找到需要的提示词。</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-5">
            <div className="text-2xl font-bold text-indigo-600">2</div>
            <h3 className="mt-2 font-semibold text-slate-950">学习拆解</h3>
            <p className="mt-1 text-sm text-slate-600">看懂提示词结构、示例和优化前后对比。</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-5">
            <div className="text-2xl font-bold text-indigo-600">3</div>
            <h3 className="mt-2 font-semibold text-slate-950">复制使用</h3>
            <p className="mt-1 text-sm text-slate-600">一键复制提示词，直接粘贴到 AI 对话中使用。</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold text-slate-950">常见问题</h2>
        <dl className="grid gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="font-semibold text-slate-950">提示词库里的内容是谁写的？</dt>
            <dd className="mt-1 text-sm text-slate-600">所有提示词经过人工筛选和拆解，覆盖办公、学习、编程、写作、营销和图像视频等常见场景。</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="font-semibold text-slate-950">需要注册或付费吗？</dt>
            <dd className="mt-1 text-sm text-slate-600">不需要。提示词库完全免费，无需注册即可浏览、学习和复制。</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dt className="font-semibold text-slate-950">复制提示词后在哪里使用？</dt>
            <dd className="mt-1 text-sm text-slate-600">可以粘贴到任何 AI 对话工具中使用，比如 ChatGPT、Claude、DeepSeek 等。</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
