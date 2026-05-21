import Link from "next/link";

export default function PromptNotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-950">提示词未找到</h1>
      <p className="mt-2 text-slate-600">该提示词可能已被移除或不存在。</p>
      <Link
        className="mt-6 inline-block rounded-md bg-slate-950 px-6 py-2 text-sm text-white hover:bg-slate-800"
        href="/prompts"
      >
        返回提示词库
      </Link>
    </div>
  );
}
