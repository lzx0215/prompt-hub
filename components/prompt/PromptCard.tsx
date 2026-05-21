import Link from "next/link";

interface PromptCardProps {
  prompt: {
    slug: string;
    title: string;
    summary: string;
    language: string;
    category: { slug: string; name: string } | null;
    tags: Array<{ tag: { slug: string; name: string } }>;
  };
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
      href={`/prompts/${prompt.slug}`}
    >
      <h3 className="text-lg font-semibold text-slate-950">{prompt.title}</h3>
      <p className="text-sm text-slate-600 line-clamp-2">{prompt.summary}</p>
      <div className="flex flex-wrap gap-2">
        {prompt.category && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {prompt.category.name}
          </span>
        )}
        {prompt.tags.map(({ tag }) => (
          <span key={tag.slug} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700">
            {tag.name}
          </span>
        ))}
        <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
          {prompt.language}
        </span>
      </div>
    </Link>
  );
}
