import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicPromptBySlug, getRelatedPublicPrompts } from "@/lib/prompts/public-query";
import { recordPromptView } from "@/lib/metrics/prompt-metrics";
import { PromptCopyButton } from "@/components/prompt/PromptCopyButton";
import { PromptStructure } from "@/components/prompt/PromptStructure";
import { PromptComparison } from "@/components/prompt/PromptComparison";
import { PromptCard } from "@/components/prompt/PromptCard";

export const dynamic = "force-dynamic";

type PromptDetail = NonNullable<Awaited<ReturnType<typeof getPublicPromptBySlug>>>;

interface PromptDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { slug } = await params;
  const prompt = await getPublicPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  recordPromptView(prompt.id).catch(() => {});

  const relatedPrompts = await getRelatedPublicPrompts({
    id: prompt.id,
    categoryId: prompt.categoryId,
    tagIds: prompt.tags.map((t: { tagId: string }) => t.tagId),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-6 text-sm text-slate-500">
        <Link className="hover:text-slate-700" href="/prompts">提示词库</Link>
        <span className="mx-2">/</span>
        <span>{prompt.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-950">{prompt.title}</h1>
        <p className="mt-2 text-slate-600">{prompt.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {prompt.category && (
            <Link
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
              href={`/prompts?category=${prompt.category.slug}`}
            >
              {prompt.category.name}
            </Link>
          )}
          {prompt.tags.map(({ tag }: { tag: { slug: string; name: string } }) => (
            <Link
              key={tag.slug}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
              href={`/prompts?tag=${tag.slug}`}
            >
              {tag.name}
            </Link>
          ))}
          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">
            {prompt.language}
          </span>
        </div>
      </header>

      <section className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-950">提示词正文</h2>
          <PromptCopyButton content={prompt.content} promptId={prompt.id} />
        </div>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="whitespace-pre-wrap text-sm text-slate-950">{prompt.content}</p>
        </div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-semibold text-slate-950">示例输入</h2>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="whitespace-pre-wrap text-sm text-slate-700">{prompt.exampleInput}</p>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-semibold text-slate-950">示例输出</h2>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="whitespace-pre-wrap text-sm text-slate-700">{prompt.exampleOutput}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-slate-950">结构拆解</h2>
        <PromptStructure
          role={prompt.structureRole}
          task={prompt.structureTask}
          context={prompt.structureContext}
          constraints={prompt.structureConstraints}
          outputFormat={prompt.structureOutputFormat}
        />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-slate-950">优化对比</h2>
        <PromptComparison
          weakPrompt={prompt.weakPrompt}
          improvedPrompt={prompt.improvedPrompt}
          improvementNotes={prompt.improvementNotes}
        />
      </section>

      {relatedPrompts.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-950">相关提示词</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedPrompts.map((related: PromptDetail) => (
              <PromptCard key={related.slug} prompt={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
