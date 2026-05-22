"use client";

import React from "react";
import Link from "next/link";
import { ImageUploader } from "@/components/image-to-prompt/ImageUploader";
import { FAQAccordion } from "@/components/image-to-prompt/FAQAccordion";
import {
  UploadIcon,
  SparklesIcon,
  FileTextIcon,
  RepeatIcon,
  ZapIcon,
  LayersIcon,
  ImageIcon,
  SlidersIcon,
  SearchIcon,
} from "@/components/image-to-prompt/icons";

export default function ImageToPromptPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white overflow-x-hidden selection:bg-[#03B9B9]/30 selection:text-white font-sans">
      <div className="w-full px-6 md:px-12 lg:px-16 py-12 space-y-20">
        
        {/* 英雄宣传区域 */}
        <section className="text-center space-y-8 mt-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-[#03B9B9]">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>AI 视觉解析大模型 v2.4 现已发布</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
              免费 AI 图片转提示词生成器
            </h1>
            
            <p className="text-sm sm:text-base text-[#9BA1A6] leading-relaxed max-w-2xl mx-auto">
              上传任意图片，瞬间获取 AI 生成的提示词。将图片转换为详细的自然语言描述词与高度结构化的 JSON 蓝图。
            </p>
          </div>

          {/* 核心多功能交互上传区 */}
          <div className="w-full">
            <ImageUploader />
          </div>
        </section>

        {/* 使用步骤 (How It Works) */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">使用步骤</h2>
            <p className="text-sm text-[#9BA1A6]">只需四步，反向工程任何创意视觉画面</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "上传图片",
                desc: "拖入或选择任意图片 —— 支持照片、插画、截图或 AI 艺术图。",
                icon: <UploadIcon className="w-6 h-6 text-[#2F93C8]" />,
              },
              {
                step: "02",
                title: "AI 智能分析",
                desc: "视觉神经网络深度解析构图、色彩冷暖、光影布局与艺术风格。",
                icon: <SparklesIcon className="w-6 h-6 text-[#03B9B9]" />,
              },
              {
                step: "03",
                title: "获取提示词",
                desc: "获取详细的自然语言大师级描述词与高度结构化的 JSON 蓝图。",
                icon: <FileTextIcon className="w-6 h-6 text-[#2F93C8]" />,
              },
              {
                step: "04",
                title: "创作与迭代",
                desc: "在任何 AI 图像/视频生成器中，使用生成的提示词无缝还原或重混图片。",
                icon: <RepeatIcon className="w-6 h-6 text-[#03B9B9]" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111116] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 text-center space-y-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group"
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06] group-hover:scale-110 group-hover:bg-[#03B9B9]/10 group-hover:border-[#03B9B9]/20 transition-all duration-300">
                  {item.icon}
                </div>
                <div className="text-[10px] font-bold text-gray-500 tracking-widest">{item.step}</div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-[#9BA1A6] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 核心产品优势 */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">为什么创作者选择此工具</h2>
            <p className="text-sm text-[#9BA1A6] max-w-xl mx-auto">从极速分析到双重输出格式，每一个细节都旨在帮助您高效提取准确、易用的 AI 提示词。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "100% 完全免费",
                desc: "无需注册登录，无需消耗额度，无任何使用限制。",
                icon: <ZapIcon className="w-5 h-5 text-[#2F93C8]" />,
              },
              {
                title: "瞬时分析响应",
                desc: "由领先视觉模型驱动，数秒内即可反馈提取结果。",
                icon: <SparklesIcon className="w-5 h-5 text-[#03B9B9]" />,
              },
              {
                title: "双重输出体验",
                desc: "同时输出自然语言 Master 描述与结构化 JSON 蓝图。",
                icon: <LayersIcon className="w-5 h-5 text-[#2F93C8]" />,
              },
              {
                title: "支持多种格式",
                desc: "完美兼容 PNG、JPG、WEBP 以及 HEIC 格式图片。",
                icon: <ImageIcon className="w-5 h-5 text-[#03B9B9]" />,
              },
              {
                title: "模型专属优化",
                desc: "生成词针对 Flux、Midjourney 和 DALL-E 进行了多重调校。",
                icon: <SlidersIcon className="w-5 h-5 text-[#2F93C8]" />,
              },
              {
                title: "超高细节维度",
                desc: "涵盖光影方向、焦距、色温、主体特征等 50+ 参数。",
                icon: <SearchIcon className="w-5 h-5 text-[#03B9B9]" />,
              },
              {
                title: "即拖即用体验",
                desc: "支持拖入即刻自动处理，精简每一步多余的操作环节。",
                icon: <UploadIcon className="w-5 h-5 text-[#2F93C8]" />,
              },
              {
                title: "任何图像与风格",
                desc: "无论是写实照片、CG 渲染还是手绘插画，均能完美适配。",
                icon: <RepeatIcon className="w-5 h-5 text-[#03B9B9]" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111116] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex gap-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300"
              >
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#2F93C8]">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-[#9BA1A6] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 深度双栏图文解析 */}
        <section className="space-y-24">
          
          {/* Block 1 */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-5/12 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">什么是图片转提示词？</h2>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                图片转提示词是一款强大的 AI 视觉反向工程工具，能够深入解析包括写实照片、插画、3D 渲染图、甚至屏幕截图在内的任意图片。它通过高级视觉深度神经网络，精准提取原图的构图要素、光源布局、色调冷暖、镜头焦距、相机视角以及复杂的艺术风格，并自动转化为可以再次生成该画面的高精度文本提示词。
              </p>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                生成的提示词适用于任何主流的 AI 图像生成模型。您可以直接在我们的 <span className="text-[#03B9B9] font-medium hover:underline cursor-pointer">AI 图像生成器</span> 中使用它们，或是将其应用到 Midjourney、DALL-E 3、Stable Diffusion 等外部图像生成工具中。
              </p>
            </div>
            <div className="md:w-7/12 rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <img
                src="/images/what-is.jpg"
                alt="AI 图片转提示词对比展示"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Block 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="md:w-5/12 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">为什么要使用图片转提示词生成器？</h2>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                撰写高质量且精准的提示词是 AI 绘图领域中最大的门槛。一个细微的词汇差异可能直接决定画面品质是平庸还是震撼大片。本工具为您架起了沟通创意与代码的桥梁 —— 上传任何令您赞叹的参考图片，一键获取描述它的精准文本，随后在这个基础上微调细节，就能极速创作出独具个性的视觉衍生画作。
              </p>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                典型应用场景包括：研读精美 AI 画作的提示词构成模式、为企业提取品牌统一的风格参数以保持视觉一致性、构建团队专属的提示词库，以及快速开始迭代脑海中的创意，告别在空白文本框前冥思苦想的尴尬。
              </p>
            </div>
            <div className="md:w-7/12 rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <img
                src="/images/why-use.jpg"
                alt="原始图片与 AI 提示词重塑版本对比"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Block 3 */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-5/12 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Nano Banana Pro —— 结构化 JSON 蓝图</h2>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                结构化 JSON 蓝图是专为 Nano Banana Pro 的参数精准控制系统研发的。它将一张图像的多维特征拆解为构图、光影参数、精细色值、主体生物特征和场景氛围等 50+ 个核心字段。
              </p>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                当您将提取出的 JSON 蓝图粘贴至我们的 <span className="text-[#03B9B9] font-medium hover:underline cursor-pointer">Nano Banana Pro</span> 工具中时，原图里的皮肤质感、光源投射方向、相机焦距等极难通过自然语言控制的微小参数，都将得到完美的超高保真度重现。
              </p>
            </div>
            <div className="md:w-7/12 rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <img
                src="/images/nano-banana.jpg"
                alt="Nano Banana Pro 结构化蓝图对比"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Block 4 */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="md:w-5/12 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Flux AI —— 自然语言大师级描述</h2>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                Flux 大师级自然语言提示词专为高级文本大模型和视觉模型调校。它将镜头类型、画面主体特征、光影氛围和精细艺术风格完美融合到一段逻辑顺畅、高密度的叙事段落中。
              </p>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                Flux 极度擅长解析具有精准空间和语义关系的自然语言。因此，如果您追求更丰富的创意发挥空间和极致的艺术诠释，自然语言 Master 描述将是您的最佳选择。
              </p>
            </div>
            <div className="md:w-7/12 rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <img
                src="/images/flux-ai.jpg"
                alt="Flux AI 提示词重组画作效果"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Block 5 */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-5/12 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">专为设计师、创作者与 AI 艺术家打造</h2>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                无论您是资深创意设计师、新媒体内容创作者还是 AI 艺术极客，这款工具都能帮您直接省去数小时的提示词调校试错成本。设计师可以轻松保持系列作品的视觉连贯性：上传已确认的视觉样图，提取关键的风格特征参数，便能迅速运用到后续的视觉延展设计中。
              </p>
              <p className="text-sm text-[#9BA1A6] leading-relaxed">
                对于 AI 图像新手，它更是绝佳的实战圣经：无需查阅复杂的指令说明书，直接导入您喜爱的 AI 艺术作品，研读系统反馈的提示词，便能迅速融会贯通，成为提示词操控大师。
              </p>
            </div>
            <div className="md:w-7/12 rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <img
                src="/images/who-should-use.jpg"
                alt="专业设计师与艺术家使用场景"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </section>

        {/* 探索更多 AI 核心工具 */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">探索更多 AI 创作工具</h2>
            <p className="text-sm text-[#9BA1A6]">搭配使用我们先进的创意套件，随时开启您的全景化 AI 创作旅程</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "AI 图像生成器", path: "/generate-image", desc: "输入提示词一键创作精美高品质画作" },
              { name: "AI 视频生成器", path: "/generate-video", desc: "使用多模态模型创作电影级震撼镜头" },
              { name: "文本生成图像", path: "/effects/text-to-image", desc: "将精彩的文字构想直接具象为画卷" },
              { name: "图片生成视频", path: "/effects/image-to-video", desc: "完美激活静止画面以生成流畅动画" },
              { name: "Nano Banana Pro", path: "/models/nano-banana", desc: "极具张力的超写实级图像渲染模型" },
              { name: "Flux AI", path: "/models/flux-ai", desc: "极速、超清的先锋一代大视觉模型" },
              { name: "可灵 Kling AI", path: "/models/kling-ai", desc: "影院级长视频渲染及精细生成模型" },
              { name: "Sora 2", path: "/models/sora-2", desc: "OpenAI 最新一代现象级视频生成模型" },
            ].map((tool, idx) => (
              <Link
                key={idx}
                href={tool.path}
                className="bg-[#111116] rounded-2xl p-5 border border-white/[0.06] hover:border-[#03B9B9]/50 hover:shadow-[0_4px_20px_rgba(3,185,185,0.08)] transition-all duration-300 group"
              >
                <h3 className="text-xs sm:text-sm font-bold text-white mb-1 group-hover:text-[#03B9B9] transition-colors">{tool.name}</h3>
                <p className="text-[11px] text-[#9BA1A6] leading-snug">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 常见问题解答区 */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">常见问题</h2>
            <p className="text-sm text-[#9BA1A6]">解答您关于本工具的常见疑问</p>
          </div>

          <FAQAccordion />
        </section>

        {/* 底部醒目 CTA 区域 */}
        <section className="bg-gradient-to-br from-[#111116] to-[#0A0A0E] border border-white/[0.06] rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#03B9B9]/5 blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">准备好启动您的视觉灵感了吗？</h2>
          <p className="text-sm text-[#9BA1A6] max-w-xl mx-auto leading-relaxed">
            立即配合我们先进的多模态图像与视频渲染系统，将反向工程获取的珍贵提示词转化为震撼的全新视觉资产。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button className="px-8 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] hover:opacity-95 rounded-xl transition-all shadow-[0_0_25px_rgba(3,185,185,0.2)]">
              开启 AI 图像创作
            </button>
            <button className="px-8 py-3.5 text-xs font-bold text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all">
              开启 AI 视频创作
            </button>
          </div>
        </section>

        {/* 网站脚注 */}
        <footer className="py-12 border-t border-white/[0.08] text-center space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-left max-w-4xl mx-auto">
            {[
              {
                title: "产品",
                links: [
                  { name: "AI 视频生成器", path: "/generate-video" },
                  { name: "AI 图像生成器", path: "/generate-image" },
                  { name: "订阅与方案", path: "/subscription" },
                ],
              },
              {
                title: "发现",
                links: [
                  { name: "AI 先锋模型", path: "/models" },
                  { name: "AI 特效相机", path: "/effects" },
                ],
              },
              {
                title: "公司",
                links: [
                  { name: "关于我们", path: "/about/team" },
                  { name: "联系方式", path: "/contact" },
                  { name: "更新日志", path: "/changelog" },
                ],
              },
              {
                title: "法律条款",
                links: [
                  { name: "服务条款", path: "/terms" },
                  { name: "隐私政策", path: "/privacy" },
                  { name: "退款规则", path: "/refund" },
                ],
              },
            ].map((col, idx) => (
              <div key={idx} className="space-y-4">
                <span className="text-white font-semibold text-xs tracking-wider uppercase">{col.title}</span>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.path} className="text-[#9BA1A6] text-xs hover:text-white transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/[0.04] text-xs text-[#5C6166]">
            &copy; {new Date().getFullYear()} Prompt Hub AI. 保留所有权利。
          </div>
        </footer>
        
      </div>
    </div>
  );
}
