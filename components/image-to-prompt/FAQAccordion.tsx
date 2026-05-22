"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "./icons";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion() {
  const faqs: FAQItem[] = [
    {
      question: "什么是图片转提示词生成器？",
      answer:
        "图片转提示词生成器利用先进的 AI 视觉模型分析您上传的图片，并反向工程出一句句描述精确的文本（提示词），帮助您在 Flux、DALL-E 3 或 Midjourney 等 AI 图像生成工具中重新创作或融合相似的图像。",
    },
    {
      question: "这个工具真的是免费的吗？",
      answer: "是的，完全免费。无需注册账号，无需消耗额度，且没有任何每日使用次数限制。",
    },
    {
      question: "支持哪些图片格式？",
      answer: "我们支持 PNG、JPG/JPEG、WEBP 和 HEIC 格式。上传的图片会自动进行端侧大小优化，以确保最佳的 AI 分析效果。",
    },
    {
      question: "什么是结构化 JSON 蓝图？",
      answer:
        "JSON 蓝图是原图片的结构化表达，包含 50+ 个细分参数（如画面构图比例、光源方向、色彩冷暖、镜头焦段、人物生物特征等），专为需要精确控制画面细节的高级创作工作流设计。",
    },
    {
      question: "生成的提示词可以在其他 AI 模型中使用吗？",
      answer:
        "完全可以！自然语言提示词适用于任何“文本生成图片”的 AI 模型（如 Midjourney, Stable Diffusion 等）。而结构化 JSON 蓝图则为高级参数化控制提供了完美的格式支持。",
    },
    {
      question: "生成的提示词有多准确？",
      answer:
        "我们的 AI 会从多维度深度解析画面的构图、光源、色彩、主体特征以及艺术风格，生成的提示词在还原度和细节饱满度上可达到 95% 以上。",
    },
  ];

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((faq, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div
            key={index}
            className="bg-[#111116] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
            >
              <span className="text-sm font-semibold text-white pr-4">{faq.question}</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[500px] border-t border-white/[0.04]" : "max-h-0"
              }`}
            >
              <div className="px-6 py-5">
                <p className="text-sm text-[#9BA1A6] leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
