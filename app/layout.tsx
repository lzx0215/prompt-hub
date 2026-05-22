import type { Metadata } from "next";
import "./globals.css";
import { SidebarNav } from "@/components/site/SidebarNav";

export const metadata: Metadata = {
  title: "Prompt Hub",
  description: "中文优先的 AI 提示词工具型门户。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-950 antialiased font-sans">
        <div className="flex min-h-screen flex-col md:flex-row">
          <SidebarNav />
          <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-w-0 transition-all duration-300">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
