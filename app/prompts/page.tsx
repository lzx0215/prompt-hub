import Link from "next/link";
import { getPublicPromptFilterOptions, getPublicPromptList } from "@/lib/prompts/public-query";
import type { PublicPromptListFilters } from "@/lib/prompts/public-types";
import { PromptCard } from "@/components/prompt/PromptCard";
import { PromptFilters } from "@/components/prompt/PromptFilters";

export const dynamic = "force-dynamic";

type PromptItem = Awaited<ReturnType<typeof getPublicPromptList>>[number];

interface PromptsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;
  const filters: PublicPromptListFilters = {
    query: typeof params.query === "string" ? params.query : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    tag: typeof params.tag === "string" ? params.tag : undefined,
  };

  const [{ categories, tags }, prompts] = await Promise.all([
    getPublicPromptFilterOptions(),
    getPublicPromptList(filters),
  ]);

  const hasFilters = Boolean(filters.query || filters.category || filters.tag);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-950">精选提示词库</h1>
      <p className="mt-2 text-slate-600">浏览、搜索和学习高质量 AI 提示词。</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <PromptFilters categories={categories} filters={filters} tags={tags} />

        <div>
          {prompts.length === 0 && hasFilters && (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">没有找到匹配的提示词。</p>
              <Link className="mt-2 inline-block text-sm text-blue-600 hover:underline" href="/prompts">
                清除所有筛选
              </Link>
            </div>
          )}

          {prompts.length === 0 && !hasFilters && (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">当前还没有可展示的提示词。</p>
            </div>
          )}

          {prompts.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {prompts.map((prompt: PromptItem) => (
                <PromptCard key={prompt.slug} prompt={prompt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
