import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { PromptForm } from "@/components/admin/PromptForm";

export const runtime = "nodejs";

export default async function NewPromptPage() {
  // Fetch categories to pass to the form select
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#03B9B9]/30">
      {/* 顶部通栏导航 */}
      <nav className="h-16 border-b border-white/[0.04] bg-[#0c0d0e] flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] bg-clip-text text-transparent"
          >
            Prompt Hub <span className="text-xs text-gray-500 font-mono">ADMIN</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← 返回工作台
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 md:px-12 py-10 space-y-8">
        {/* 顶部标题区 */}
        <section className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            新建提示词 <span className="text-[#03B9B9] text-2xl font-mono">/ New Prompt</span>
          </h1>
          <p className="text-xs text-gray-500">为精选提示词库注入全新的结构化 AI 提示词资产</p>
        </section>

        {/* 核心表单区 */}
        <PromptForm categories={categories} />
      </div>
    </div>
  );
}
