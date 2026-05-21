import Link from "next/link";

interface FeaturedPromptsProps {
  prompts: Array<{
    slug: string;
    title: string;
    summary: string;
    category: { slug: string; name: string } | null;
  }>;
}

export function FeaturedPrompts({ prompts }: FeaturedPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-950">精选提示词</h2>
        <Link className="text-sm text-blue-600 hover:underline" href="/prompts">
          查看全部
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <Link
            key={prompt.slug}
            className="grid gap-2 rounded-lg border border-slate-200 bg-white p-4 transition hover:shadow-md"
            href={`/prompts/${prompt.slug}`}
          >
            <h3 className="font-semibold text-slate-950">{prompt.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">{prompt.summary}</p>
            {prompt.category && (
              <span className="w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {prompt.category.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
