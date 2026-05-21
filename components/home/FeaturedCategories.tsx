import Link from "next/link";

interface FeaturedCategoriesProps {
  categories: Array<{ slug: string; name: string; description?: string | null }>;
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold text-slate-950">精选分类</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
            href={`/prompts?category=${cat.slug}`}
          >
            <h3 className="font-medium text-slate-950">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
