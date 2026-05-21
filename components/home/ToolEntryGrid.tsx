import Link from "next/link";

const tools = [
  {
    href: "/prompts",
    title: "找提示词",
    description: "浏览精选提示词库，搜索、筛选并学习高质量提示词。",
    ready: true,
  },
  {
    href: "/generator",
    title: "文本提示词生成器",
    description: "根据目标自动生成、优化或改写提示词。（即将上线）",
    ready: false,
  },
  {
    href: "/image-to-prompt",
    title: "图片转提示词",
    description: "上传参考图，生成图像创作提示词。（即将上线）",
    ready: false,
  },
];

export function ToolEntryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tools.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-950">{tool.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{tool.description}</p>
          {!tool.ready && (
            <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
              即将上线
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
