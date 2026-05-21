import Link from "next/link";
import type { PublicPromptListFilters } from "@/lib/prompts/public-types";

interface PromptFiltersProps {
  categories: Array<{ slug: string; name: string }>;
  filters: PublicPromptListFilters;
  tags: Array<{ slug: string; name: string }>;
}

export function PromptFilters({ categories, filters, tags }: PromptFiltersProps) {
  return (
    <form action="/prompts" className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>搜索提示词</span>
        <input
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
          defaultValue={filters.query}
          name="query"
          placeholder="搜索任务、标题或提示词正文"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>分类</span>
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
          defaultValue={filters.category ?? ""}
          name="category"
        >
          <option value="">全部分类</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>标签</span>
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
          defaultValue={filters.tag ?? ""}
          name="tag"
        >
          <option value="">全部标签</option>
          {tags.map((tag) => (
            <option key={tag.slug} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-md bg-slate-950 px-4 py-2 text-sm text-white" type="submit">
          应用筛选
        </button>
        <Link className="rounded-md border border-slate-300 px-4 py-2 text-sm" href="/prompts">
          清除筛选
        </Link>
      </div>
    </form>
  );
}
