"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PromptTableRowProps {
  prompt: {
    id: string;
    slug: string;
    title: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isFeatured: boolean;
    viewCount: number;
    copyCount: number;
    category: {
      name: string;
      slug: string;
    };
  };
}

export function PromptTableRow({ prompt: initialPrompt }: PromptTableRowProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const toggleStatus = async () => {
    setIsUpdatingStatus(true);
    const nextStatus = prompt.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/prompts/${prompt.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();
      setPrompt((prev) => ({ ...prev, status: data.prompt.status }));
    } catch (e) {
      console.error(e);
      alert("状态修改失败，请重试");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const toggleFeatured = async () => {
    try {
      const res = await fetch(`/api/admin/prompts/${prompt.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured: !prompt.isFeatured }),
      });

      if (!res.ok) {
        throw new Error("Failed to update featured status");
      }

      const data = await res.json();
      setPrompt((prev) => ({ ...prev, isFeatured: data.prompt.isFeatured }));
    } catch (e) {
      console.error(e);
      alert("推荐修改失败，请重试");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`您确定要删除提示词“${prompt.title}”吗？`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/prompts/${prompt.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete prompt");
      }

      setIsDeleted(true);
    } catch (e) {
      console.error(e);
      alert("删除失败，请重试");
      setIsDeleting(false);
    }
  };

  if (isDeleted) return null;

  return (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors group">
      {/* 标题 */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm select-all">
              {prompt.title}
            </span>
            {prompt.isFeatured && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[9px] uppercase tracking-wider font-bold">
                精选
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-mono select-all">/{prompt.slug}</p>
        </div>
      </td>

      {/* 分类 */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-gray-400">
          {prompt.category.name}
        </span>
      </td>

      {/* 状态 */}
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={toggleStatus}
          disabled={isUpdatingStatus}
          className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer select-none transition-all duration-300 flex items-center gap-1.5 ${
            prompt.status === "PUBLISHED"
              ? "bg-[#03B9B9]/10 border-[#03B9B9]/20 text-[#03B9B9] hover:bg-[#03B9B9]/20"
              : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:bg-gray-800/80"
          }`}
        >
          {isUpdatingStatus ? (
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${prompt.status === "PUBLISHED" ? "bg-[#03B9B9]" : "bg-gray-500"}`} />
          )}
          {prompt.status === "PUBLISHED" ? "已发布" : "草稿"}
        </button>
      </td>

      {/* 推荐切换 */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={toggleFeatured}
          className={`p-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
            prompt.isFeatured
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              : "bg-white/[0.02] border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/[0.15]"
          }`}
          title={prompt.isFeatured ? "取消精选推荐" : "设为精选推荐"}
        >
          <svg className="w-4 h-4" fill={prompt.isFeatured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.564-.37-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.519-4.674z" />
          </svg>
        </button>
      </td>

      {/* 数据度量 */}
      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400 space-y-0.5">
        <div>👁 浏览: <span className="text-white font-semibold">{prompt.viewCount}</span></div>
        <div>📋 复制: <span className="text-white font-semibold">{prompt.copyCount}</span></div>
      </td>

      {/* 操作 */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
        <Link
          href={`/admin/edit/${prompt.id}`}
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#03B9B9]/30 text-gray-300 hover:text-white transition-all duration-300 inline-block"
        >
          编辑
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-900/20 hover:border-red-500 hover:bg-red-900/30 text-red-400 hover:text-red-200 transition-all duration-300 cursor-pointer ${
            isDeleting ? "opacity-50 cursor-wait" : ""
          }`}
        >
          {isDeleting ? "正在删除..." : "删除"}
        </button>
      </td>
    </tr>
  );
}
