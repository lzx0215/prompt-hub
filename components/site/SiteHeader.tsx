import Link from "next/link";

const navItems = [
  { href: "/image-to-prompt", label: "图片转提示词" },
  { href: "/generator", label: "生成器" },
  { href: "/prompts", label: "提示词库" },
  { href: "/learn", label: "学习" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-slate-950">
          Prompt Hub
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
            管理后台
          </Link>
        </nav>
      </div>
    </header>
  );
}
