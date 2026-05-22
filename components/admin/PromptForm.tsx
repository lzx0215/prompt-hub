"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface PromptData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  exampleInput: string;
  exampleOutput: string;
  structureRole: string;
  structureTask: string;
  structureContext: string;
  structureConstraints: string;
  structureOutputFormat: string;
  weakPrompt: string;
  improvedPrompt: string;
  improvementNotes: string;
  language: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  categoryId: string;
  tagsString: string;
}

interface PromptFormProps {
  categories: Category[];
  initialData?: PromptData;
}

export function PromptForm({ categories, initialData }: PromptFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [formData, setFormData] = useState<PromptData>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    exampleInput: "",
    exampleOutput: "",
    structureRole: "",
    structureTask: "",
    structureContext: "",
    structureConstraints: "",
    structureOutputFormat: "",
    weakPrompt: "",
    improvedPrompt: "",
    improvementNotes: "",
    language: "zh-CN",
    status: "DRAFT",
    isFeatured: false,
    categoryId: categories[0]?.id || "",
    tagsString: "",
    ...initialData,
  });

  const [isPristineSlug, setIsPristineSlug] = useState(!initialData?.slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from English title if slug is pristine and we are not in edit mode
      if (name === "title" && isPristineSlug && !isEdit) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric chars
          .replace(/\s+/g, "-")         // replace spaces with -
          .replace(/-+/g, "-");         // replace multiple - with single -
      }
      
      return updated;
    });

    if (name === "slug") {
      setIsPristineSlug(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Basic Validation
    if (!formData.title.trim()) {
      setErrorMsg("提示词名称为必填项");
      setIsSubmitting(false);
      return;
    }
    if (!formData.slug.trim()) {
      setErrorMsg("唯一 Slug 为必填项");
      setIsSubmitting(false);
      return;
    }
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      setErrorMsg("Slug 只能包含小写字母、数字和连字符 (例如: code-review-assistant)");
      setIsSubmitting(false);
      return;
    }
    if (!formData.content.trim()) {
      setErrorMsg("提示词内容主体为必填项");
      setIsSubmitting(false);
      return;
    }
    if (!formData.categoryId) {
      setErrorMsg("请选择提示词分类");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEdit
        ? `/api/admin/prompts/${initialData.id}`
        : "/api/admin/prompts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "保存失败，请检查数据完整性");
      }

      router.push("/admin");
      router.refresh();
    } catch (e: unknown) {
      console.error(e);
      const errMsg = e instanceof Error ? e.message : "服务器网络故障，请稍后重试";
      setErrorMsg(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 左侧主要填写区 (lg:col-span-9) */}
      <div className="lg:col-span-9 space-y-6">
        
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-xs font-semibold flex items-center gap-3">
            <span className="text-base">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 基础配置块 */}
        <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-[#03B9B9] uppercase tracking-wider border-b border-white/[0.04] pb-3">
            1. 基础信息配置
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">提示词名称 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="例如: 会议纪要整理助手"
                required
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">
                唯一 Slug (URL标识) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="例如: meeting-summary-assistant"
                required
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300 font-mono"
              />
              <p className="text-[10px] text-gray-500">
                URL 标识，只能使用小写字母、数字和中划线 -。
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400">简短摘要说明</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              placeholder="一句话介绍这个提示词的核心价值（例如：把零散会议记录整理为清晰的结论、行动项和风险提醒。）"
              className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* 提示词核心内容块 */}
        <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-[#03B9B9] uppercase tracking-wider border-b border-white/[0.04] pb-3">
            2. 提示词核心架构
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400">提示词内容主体 *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              required
              placeholder="请输入大模型执行的核心提示词文本，支持使用 Markdown 格式排版..."
              className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">示例输入 (用户输入样例)</label>
              <textarea
                name="exampleInput"
                value={formData.exampleInput}
                onChange={handleChange}
                rows={4}
                placeholder="例如：项目例会讨论了首页改版、图片上传限制和下周测试安排..."
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">示例输出 (模型输出样例)</label>
              <textarea
                name="exampleOutput"
                value={formData.exampleOutput}
                onChange={handleChange}
                rows={4}
                placeholder="例如：## 关键结论\n- 首页改版进入视觉确认阶段..."
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 结构拆解五要素 */}
        <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-[#03B9B9] uppercase tracking-wider border-b border-white/[0.04] pb-3">
            3. CRISPE/CO-STAR 结构拆解五要素
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">角色 (Role)</label>
              <textarea
                name="structureRole"
                value={formData.structureRole}
                onChange={handleChange}
                rows={2}
                placeholder="大模型需要扮演的角色。例如：专业会议纪要助手。"
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">任务 (Task)</label>
              <textarea
                name="structureTask"
                value={formData.structureTask}
                onChange={handleChange}
                rows={2}
                placeholder="提示词要完成的核心任务。例如：整理会议主题、关键结论、行动项和风险提醒。"
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">上下文 (Context)</label>
              <textarea
                name="structureContext"
                value={formData.structureContext}
                onChange={handleChange}
                rows={2}
                placeholder="背景环境或输入数据的特点。例如：用户提供的是原始会议记录，可能包含口语化表达和顺序混乱的信息。"
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">约束条件 (Constraints)</label>
              <textarea
                name="structureConstraints"
                value={formData.structureConstraints}
                onChange={handleChange}
                rows={2}
                placeholder="强制性限制与边界规范。例如：不要编造负责人和截止时间；缺失信息用「待确认」标注。"
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">输出格式 (Output Format)</label>
              <textarea
                name="structureOutputFormat"
                value={formData.structureOutputFormat}
                onChange={handleChange}
                rows={2}
                placeholder="希望模型呈现的格式排版。例如：使用 Markdown 分节标题和表格。"
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* 提示词对比与优化 */}
        <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-[#03B9B9] uppercase tracking-wider border-b border-white/[0.04] pb-3">
            4. 提示词优化与改进对比
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">不完美提示词 (Weak Prompt)</label>
              <textarea
                name="weakPrompt"
                value={formData.weakPrompt}
                onChange={handleChange}
                rows={3}
                placeholder="常规、模糊的不完美输入。例如：帮我总结会议。"
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400">改进版提示词 (Improved Prompt)</label>
              <textarea
                name="improvedPrompt"
                value={formData.improvedPrompt}
                onChange={handleChange}
                rows={3}
                placeholder="进行精细打磨后的提示词。例如：你是一名专业会议纪要助手..."
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400">优化解析说明 (Improvement Notes)</label>
            <textarea
              name="improvementNotes"
              value={formData.improvementNotes}
              onChange={handleChange}
              rows={3}
              placeholder="对不完美提示词和改进版提示词的差异分析。例如：优化版明确了角色、任务、字段和输出格式，因此结果更稳定。"
              className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl p-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* 右侧边栏控制面板 (lg:col-span-3) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* 操作卡片 */}
        <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">发布状态与动作</span>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] text-gray-500 uppercase font-semibold">当前状态</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#141516] border border-white/[0.08] text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#03B9B9]/50"
              >
                <option value="DRAFT">⚪ 草稿 (DRAFT)</option>
                <option value="PUBLISHED">🟢 已发布 (PUBLISHED)</option>
                <option value="ARCHIVED">🔴 已归档 (ARCHIVED)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="space-y-0.5">
                <span className="block text-xs font-semibold text-white">推荐至精选</span>
                <span className="block text-[10px] text-gray-500">在主站首页优先展示</span>
              </div>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleCheckboxChange}
                className="w-4 h-4 accent-[#03B9B9] rounded border-white/[0.08] bg-[#141516]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] hover:shadow-[0_0_20px_rgba(3,185,185,0.25)] text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "正在保存中..." : isEdit ? "保存提示词" : "创建提示词"}
            </button>
            
            <Link
              href="/admin"
              className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-center text-gray-400 hover:text-white font-bold text-xs tracking-wider uppercase transition-all duration-300"
            >
              取消并返回
            </Link>
          </div>
        </div>

        {/* 归属属性卡片 */}
        <div className="bg-[#111116] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">归属目录与标签</span>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400">分类目录 *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full bg-[#141516] border border-white/[0.08] text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#03B9B9]/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    📂 {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400">语言</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-[#141516] border border-white/[0.08] text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#03B9B9]/50"
              >
                <option value="zh-CN">🇨🇳 中文 (zh-CN)</option>
                <option value="en">🇺🇸 英文 (en)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400">关联标签 (Tags)</label>
              <input
                type="text"
                name="tagsString"
                value={formData.tagsString}
                onChange={handleChange}
                placeholder="例如: summary, work"
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
              <p className="text-[10px] text-gray-500">
                多个标签使用英文逗号分割。
              </p>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
