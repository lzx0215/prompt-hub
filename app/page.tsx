import Link from "next/link";

const entries = [
  {
    href: "/image-to-prompt",
    title: "图片转提示词",
    description: "上传参考图，生成图像创作提示词和结构化拆解。",
  },
  {
    href: "/generator",
    title: "文本提示词生成器",
    description: "根据目标生成、优化或改写提示词。",
  },
  {
    href: "/prompts",
    title: "精选提示词库",
    description: "浏览高质量提示词和学习拆解。",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-indigo-600">AI Prompt Tool Portal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          查找、学习并生成更好的 AI 提示词
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Prompt Hub 将提示词库、学习拆解和 AI 生成工具放在一个中文优先的工具型门户中。
        </p>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-950">{entry.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{entry.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
