import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PromptForm } from "@/components/admin/PromptForm";

export const runtime = "nodejs";

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch prompt with category and tags
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!prompt) {
    notFound();
  }

  // 2. Fetch categories for select
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // 3. Format initialData
  const initialData = {
    id: prompt.id,
    title: prompt.title,
    slug: prompt.slug,
    summary: prompt.summary,
    content: prompt.content,
    exampleInput: prompt.exampleInput,
    exampleOutput: prompt.exampleOutput,
    structureRole: prompt.structureRole,
    structureTask: prompt.structureTask,
    structureContext: prompt.structureContext,
    structureConstraints: prompt.structureConstraints,
    structureOutputFormat: prompt.structureOutputFormat,
    weakPrompt: prompt.weakPrompt,
    improvedPrompt: prompt.improvedPrompt,
    improvementNotes: prompt.improvementNotes,
    language: prompt.language,
    status: prompt.status,
    isFeatured: prompt.isFeatured,
    categoryId: prompt.categoryId,
    tagsString: prompt.tags.map((pt) => pt.tag.name).join(", "),
  };

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
            编辑提示词 <span className="text-[#03B9B9] text-2xl font-mono">/ Edit Prompt</span>
          </h1>
          <p className="text-xs text-gray-500">对现有精选提示词资产的结构、文案或状态进行微调与管理</p>
        </section>

        {/* 核心表单区 */}
        <PromptForm categories={categories} initialData={initialData} />
      </div>
    </div>
  );
}
