import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { PromptTableRow } from "@/components/admin/PromptTableRow";

import { Prisma, PromptStatus } from "@prisma/client";

export const runtime = "nodejs";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const categorySlug = params.category || "";
  const statusFilter = params.status || "";

  // 1. Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // 2. Build where filter clauses
  const where: Prisma.PromptWhereInput = {};
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { slug: { contains: query } },
      { summary: { contains: query } },
    ];
  }
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (statusFilter) {
    where.status = statusFilter as PromptStatus;
  }

  // 3. Query prompts matching conditions
  const prompts = await prisma.prompt.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 4. Calculate metrics
  const totalPrompts = await prisma.prompt.count();
  
  const viewsAggregation = await prisma.prompt.aggregate({
    _sum: { viewCount: true },
  });
  const totalViews = viewsAggregation._sum.viewCount ?? 0;

  const copiesAggregation = await prisma.prompt.aggregate({
    _sum: { copyCount: true },
  });
  const totalCopies = copiesAggregation._sum.copyCount ?? 0;

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#03B9B9]/30">
      
      {/* 顶部通栏导航 */}
      <nav className="h-16 border-b border-white/[0.04] bg-[#0c0d0e] flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] bg-clip-text text-transparent">
            Prompt Hub <span className="text-xs text-gray-500 font-mono">ADMIN</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-white transition-colors">
            主站首页 ↗
          </Link>
          <form action="/api/admin/auth/logout" method="POST">
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-900/20 hover:border-red-500 text-red-400 hover:text-red-200 transition-all cursor-pointer"
            >
              安全登出
            </button>
          </form>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 md:px-12 py-10 space-y-10">
        
        {/* 顶部标题区 */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              工作台看板 <span className="text-[#03B9B9] text-2xl font-mono">/ Console</span>
            </h1>
            <p className="text-xs text-gray-500">提示词内容的高效管理与度量数据分析</p>
          </div>
          
          <Link
            href="/admin/new"
            className="w-fit px-5 py-3 rounded-xl bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] hover:shadow-[0_0_20px_rgba(3,185,185,0.25)] text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-0.5"
          >
            + 新建提示词
          </Link>
        </section>

        {/* 核心度量看板 (Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "提示词总量 (Prompts)", val: totalPrompts, icon: "📚", color: "from-[#2F93C8]/10 via-transparent to-[#03B9B9]/10" },
            { label: "累计浏览量 (Views)", val: totalViews, icon: "👁", color: "from-purple-500/10 via-transparent to-pink-500/10" },
            { label: "累计复制量 (Copies)", val: totalCopies, icon: "📋", color: "from-amber-500/10 via-transparent to-yellow-500/10" }
          ].map((stat, idx) => (
            <div key={idx} className={`relative bg-[#111116] border border-white/[0.06] rounded-2xl p-6 overflow-hidden group`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-30 pointer-events-none`} />
              <div className="flex justify-between items-center relative">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{stat.label}</span>
                  <p className="text-3xl font-extrabold text-white font-mono">{stat.val}</p>
                </div>
                <span className="text-3xl select-none">{stat.icon}</span>
              </div>
            </div>
          ))}
        </section>

        {/* 主工作区：双栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 左侧栏：快速分类与状态筛选器 */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* 分类筛选器 */}
            <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">分类目录筛选</span>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/admin?status=${statusFilter}&query=${query}`}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    !categorySlug
                      ? "bg-white/[0.04] text-[#03B9B9] border border-white/[0.08]"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  📁 全部公开分类
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/admin?category=${cat.slug}&status=${statusFilter}&query=${query}`}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      categorySlug === cat.slug
                        ? "bg-white/[0.04] text-[#03B9B9] border border-white/[0.08]"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    📂 {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 状态过滤选项 */}
            <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">发布状态筛选</span>
              <div className="flex flex-col gap-1">
                {[
                  { id: "", name: "🏳️ 全部状态" },
                  { id: "PUBLISHED", name: "🟢 已发布" },
                  { id: "DRAFT", name: "⚪ 草稿中" }
                ].map((statusOpt) => (
                  <Link
                    key={statusOpt.id}
                    href={`/admin?status=${statusOpt.id}&category=${categorySlug}&query=${query}`}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      statusFilter === statusOpt.id
                        ? "bg-white/[0.04] text-[#03B9B9] border border-white/[0.08]"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {statusOpt.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* 右侧主栏：提示词列表与查询栏 */}
          <main className="lg:col-span-9 bg-[#111116] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
            
            {/* 搜索/过滤控制条 */}
            <div className="p-5 border-b border-white/[0.04] bg-white/[0.01] flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* 搜索框 */}
              <form method="GET" action="/admin" className="w-full sm:max-w-md relative flex items-center">
                <input type="hidden" name="category" value={categorySlug} />
                <input type="hidden" name="status" value={statusFilter} />
                <input
                  type="text"
                  name="query"
                  defaultValue={query}
                  placeholder="搜索提示词名称或概况描述..."
                  className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
                />
                <button type="submit" className="absolute right-3 text-gray-500 hover:text-[#03B9B9] transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              <div className="text-xs text-gray-500 font-mono">
                已筛选出 <span className="text-white font-semibold">{prompts.length}</span> 条提示词
              </div>
            </div>

            {/* 提示词列表 Table */}
            {prompts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-500">
                  📚
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">暂未匹配到提示词记录</p>
                  <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                    当前筛选条件或搜索关键词下无数据，请尝试重置过滤器或添加新提示词。
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04] bg-white/[0.01] text-[10px] uppercase font-bold tracking-widest text-gray-500">
                      <th className="px-6 py-3.5">提示词名称 / Slug</th>
                      <th className="px-6 py-3.5">分类目录</th>
                      <th className="px-6 py-3.5">发布状态</th>
                      <th className="px-6 py-3.5">推荐精选</th>
                      <th className="px-6 py-3.5">分析指标</th>
                      <th className="px-6 py-3.5 text-right">操作管理</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prompts.map((prompt) => (
                      <PromptTableRow key={prompt.id} prompt={prompt as unknown as Parameters<typeof PromptTableRow>[0]["prompt"]} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
