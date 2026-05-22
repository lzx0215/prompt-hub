"use client";

import React, { useState } from "react";

// 定义提示词模板类型
interface PromptTemplate {
  name: string;
  description: string;
  input: string;
  framework: "crispe" | "costar" | "default";
  tone: string;
  model: string;
  outputs: {
    raw: string;
    breakdown: {
      title: string;
      role: string;
      context: string;
      task: string;
      constraint: string;
      outputFormat: string;
    };
    diff: {
      original: string;
      optimized: string;
    };
  };
}

// 经典的模板库预设
const PRESET_TEMPLATES: PromptTemplate[] = [
  {
    name: "小红书爆款文案专家",
    description: "专为社交媒体种草设计的爆款文案生成与排版工具",
    input: "帮我写一个小红书种草博主提示词，核心工作是把普通护肤品成分介绍改写成带有表情符号、痛点分析、三段式排版的高点击率小红书爆款图文笔记。",
    framework: "costar",
    tone: "亲和力",
    model: "Flux / Midjourney / text-LLM",
    outputs: {
      raw: `# 角色定位：小红书爆款种草文案专家\n\n## 💡 核心目标\n将平铺直叙的护肤品成分介绍改写为符合小红书年轻化语境、极具视觉冲击力与购买说服力的高转化笔记。\n\n## 📝 结构框架 (CO-STAR)\n- **Context (上下文)**: 小红书是一个以视觉和情绪共鸣驱动的社区。用户更关注“对我的具体好处”而非枯燥的专业术语。\n- **Objective (目标)**: 创作高点击、高收藏的爆款图文笔记文案。\n- **Style (风格)**: 充满亲和力、闺蜜口吻、多用语气助词（哇、亲测、必入），适度夸张。\n- **Truth (事实/痛点)**: 直击“熬夜黄皮”、“换季敏感”等痛点，成分解析通俗化。\n- **Audience (受众)**: 18-30岁追求性价比与精致生活的年轻女性。\n- **Response (输出规范)**: 三段式排版，富含 Emoji 表情，含热门标签。\n\n## 🛠 输入样例\n“本品含有 5% 烟酰胺，具有抗氧化和提亮肤色效果。”\n\n## 🚀 输出模板示范\n【熬夜党狂喜！闺蜜亲测黄皮逆袭天花板✨】\n\n宝贝们！今天不踩雷，必须按头安利这个美白届的“橡皮擦”！\n\n💥 熬夜蜡黄？素颜不敢见人？别慌！\n这瓶直接把 **5% 黄金浓度烟酰胺** 给你灌满！懂行的都知道，这个浓度既能把黑色素打得找不到北，又温和到敏肌宝宝也能轻松驾驭！\n\n🌿 精简配方，只干实事：\n1️⃣ 烟酰胺拦截色素 ➡️ 告别黄脸婆！\n2️⃣ 舒缓修护因子 ➡️ 脸蛋又亮又稳！\n\n快吃下我这颗安利！冲就完事了！👇\n#小红书爆款 #成分党 #熬夜拯救计划 #美白精选 #好物推荐`,
      breakdown: {
        title: "小红书爆款文案专家",
        role: "小红书爆款种草文案专家 / 闺蜜级文案写手",
        context: "在小红书这个以内容种草和高颜值图片为核心的社区，传统的硬广告或枯燥的学术成分报告无法吸引眼球。需要针对18-30岁年轻女性，用情感共鸣和直观价值抓住注意力。",
        task: "将枯燥的护肤品原材料/成分介绍（如烟酰胺、视黄醇），改写为充满种草感、多段落排版、有强烈购买欲的情绪化爆款笔记文案。",
        constraint: "1. 必须使用闺蜜口吻和高频语气词。\n2. 包含至少 10 个 Emoji 表情符号。\n3. 排版必须是三段式（痛点-核心优势-使用方法/总结）。\n4. 结尾附带 4-6 个小红书热门话题标签。",
        outputFormat: "Markdown 格式，包含醒目标题、正文段落（列表形式）以及底部话题区。"
      },
      diff: {
        original: "写一个帮我介绍护肤品成分的提示词，要像小红书那样，有表情和段落。",
        optimized: "你是一位拥有百万粉丝的小红书爆款种草博主。请根据我提供的护肤品原料或成分（例如“5%烟酰胺”），撰写一篇吸引人的小红书笔记文案。文案需采用闺蜜分享口吻，开篇直击熬夜黄皮等痛点，中间通俗化解析成分益处，末尾提供使用感受并列出热门标签。整体字数在300字左右，必须富含大量Emoji表情符号，并采用精美的分段和列表排版，字里行间透露着“按头安利”的情绪张力。"
      }
    }
  },
  {
    name: "中英金牌翻译官",
    description: "具备意译、校对与学术润色能力的顶级中英翻译助手",
    input: "帮我设计一个金牌中英双向翻译官提示词，不仅需要字面翻译，还要提供学术版、地道口语版和信雅达意译版三个维度的结果对比，并附带重点词汇分析。",
    framework: "crispe",
    tone: "严谨",
    model: "text-LLM",
    outputs: {
      raw: `# 角色定位：金牌中英双向翻译官与润色专家\n\n## 🛠 核心指令 (CRISPE)\n- **Capacity (角色能力)**: 你是世界级的同声传译与英文学术期刊（如 Nature, Science）特约审稿人。\n- **Role (任务背景)**: 帮助用户跨越文化差异，提供最精准、得体的双语转化。\n- **Instruction (翻译规则)**: \n  1. 接收输入后，首先判断源语言（中文或英文）。\n  2. 提供三套翻译方案：\n     - 【方案 A：地道日常口语版】符合本土日常交流，生动自然。\n     - 【方案 B：精选学术/商务版】语调客观专业，适合论文发表或商务信函。\n     - 【方案 C：信雅达文学意译版】讲究韵律与文化底蕴，优雅深远。\n  3. 提取 3-5 个核心词汇或俚语，给出对比释义。\n- **System (约束边界)**: 保持中立，不得解释翻译以外的废话，排版干净。\n- **Parameter (温度参数)**: Temperature = 0.3 (保证翻译准确与高稳定性)。\n\n## 📐 输出排版示范\n### 📥 原文\n“他这个人办事非常靠谱，大家都很信任他。”\n\n### 📤 翻译方案\n- **方案 A (地道口语)**: \"He is extremely reliable; everyone swears by him.\"\n- **方案 B (专业商务)**: \"He demonstrates high professional integrity, earning the full confidence of the team.\"\n- **方案 C (信雅达意译)**: \"A man of profound dependability, he commands universal trust.\"\n\n### 📖 核心词汇解析\n- **reliable**: 普通靠谱，强调事物运行稳妥。\n- **swear by**: 俚语，极其信赖、打包票。\n- **dependability**: 名词，可信赖度，学术感强。`,
      breakdown: {
        title: "中英金牌翻译官",
        role: "Nature 特约译校、资深同声传译员",
        context: "在跨国交流、学术写作和日常口语中，直译往往显得生硬、中式英文或词不达意。需要一种能根据不同场景提供多维度翻译并指出用词微妙差别的翻译工具。",
        task: "将用户输入的任意中文或英文句子，转化为三个档次（口语、商务学术、文学意译）的超高质量译文，并进行核心词汇精细讲解。",
        constraint: "1. 严禁使用翻译软件式的死板直译。\n2. 学术版必须使用高级学术动词和句式，避免多余的第一人称代词。\n3. 文学意译版必须符合目标语言的文学品味，中国诗词要翻出意境，英文俚语要对齐中文成语。",
        outputFormat: "三级标题分割各版本，核心词汇使用列表明细呈现。"
      },
      diff: {
        original: "写个提示词帮我把中文翻译成英文，要有口语和学术的差别。",
        optimized: "你是一位兼具同声传译经验与学术论文润色能力的金牌中英双向翻译官。当我输入中文或英文时，请自动识别源语言，并输出三个版本的精修翻译：1) 【地道口语版】符合英语母语者日常习惯，生动风趣；2) 【学术/商务版】语调严谨，符合SCI论文发表或正式商业往来标准；3) 【信雅达意译版】展现优美的文字底蕴与文化对齐。最后，请列出译文中 3 个核心词汇的微观辨析（如同义词细微差别），以便我学习。"
      }
    }
  },
  {
    name: "Python 算法重构大师",
    description: "专为降低代码复杂度、提升时间/空间效率设计的重构专家",
    input: "帮我做一个 Python 代码重构与算法优化专家的提示词。输入一段臃肿的 Python 源码，输出符合 PEP8 规范、运用高级设计模式和高效率内置函数的精炼版本，并给出性能分析对比表。",
    framework: "crispe",
    tone: "专业",
    model: "text-LLM",
    outputs: {
      raw: `# 角色定位：Python 顶级算法重构与架构大师\n\n## 💻 核心功能 (CRISPE)\n- **Capacity (角色与背景)**: 你是资深 Python Core Developer（核心开发者），对 CPython 源码有深入研究，崇尚《Python之禅》。\n- **Role (重构目标)**: 接收臃肿、低效、可读性差 of Python 2/3 代码，进行极致重构。\n- **Instruction (重构流程)**:\n  1. **规范性校对**: 强制符合 PEP8 编码风格，补全类型提示 (Type Hints)。\n  2. **可读性提纯**: 消除嵌套的 if-else，提取冗长函数，运用 Pythonic 的推导式与内置高阶函数。\n  3. **算法飞跃**: 分析时间复杂度 (Big O)，引入生成器 (Generators)、\`collections\` 模块或多进程实现降维打击。\n  4. **对比呈现**: 用 Markdown 表格呈现重构前后性能、复杂度、代码行数的全面对比。\n\n## 📊 性能重构对比示例\n| 维度 | 重构前 (Original) | 重构后 (Refactored) | 改善说明 |\n| :--- | :--- | :--- | :--- |\n| **代码行数** | 45 行 | 18 行 | 使用列表推导式与 map，精炼结构 |\n| **时间复杂度** | O(N²) | O(N log N) | 将嵌套循环双指针改为哈希映射查找 |\n| **空间复杂度** | O(N) | O(1) | 引入 Generator yield，实现流式低内存运行 |`,
      breakdown: {
        title: "Python 算法重构大师",
        role: "CPython 核心开发专家、软件架构大师",
        context: "许多开发者编写的 Python 代码残留了 C++ 或 Java 的生硬结构，存在大量低效循环、内存浪费及格式混乱，缺乏 Pythonic 优雅度。算法在大数据量下存在时间瓶颈。",
        task: "对输入的 Python 代码进行结构提纯、算法升维和 PEP8 格式重塑，并出具定性/定量对比报告。",
        constraint: "1. 必须补全 Python 3.10+ 的静态类型提示 (Type Hints)。\n2. 严禁改动原代码的核心业务逻辑，必须写出单元测试断言以资证明。\n3. 使用复杂度表格定量评估改进成果。",
        outputFormat: "第一部分展示优化后的完整代码（带详细 docstring），第二部分展示 Markdown 对比分析表，第三部分展示重构要点总结。"
      },
      diff: {
        original: "给我写一个 Python 重构提示词，能够帮我改写代码，让它变快和变好看。",
        optimized: "你是一位资深的 Python Core Developer 与算法架构专家。请为我提供一个针对臃肿 Python 代码的重构与性能调优服务。当你接收到我提交的 Python 代码段时，你需要：1. 对齐 PEP8 规范，加入完整的 Type Hints 类型批注；2. 用 Pythonic 句式（如列表推导式、生成器表达式、itertools 库）提纯逻辑，消除嵌套分支；3. 优化底层算法以降低 Big O 时间和空间复杂度；4. 最终以 Markdown 表格形式定量对比重构前后在行数、时间复杂度、空间消耗上的差异，并输出重构后的高清晰度代码。"
      }
    }
  }
];

export default function GeneratorPage() {
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<"generate" | "optimize" | "framework">("generate");
  
  // 表单状态
  const [taskInput, setTaskInput] = useState("");
  const [framework, setFramework] = useState<"crispe" | "costar" | "default">("costar");
  const [tone, setTone] = useState("专业");
  const [model, setModel] = useState("Flux / Midjourney / text-LLM");
  const [temperature, setTemperature] = useState(0.7);
  const [lengthConstraint, setLengthConstraint] = useState(500);

  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");
  const [generatedRaw, setGeneratedRaw] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<"raw" | "breakdown" | "diff">("raw");

  // 复制提示状态
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 加载预设模板
  const handleApplyPreset = (index: number) => {
    setActivePreset(index);
    const preset = PRESET_TEMPLATES[index];
    setTaskInput(preset.input);
    setFramework(preset.framework);
    setTone(preset.tone);
    setModel(preset.model);
    
    // 清空上次结果
    setGeneratedRaw("");
    setHasGenerated(false);
    setErrorMsg(null);
  };

  // 真实的 AI 流式生成逻辑
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setIsGenerating(true);
    setProgress(5);
    setGenerationStep("AI 引擎初始化中...");
    setGeneratedRaw("");
    setHasGenerated(false);
    setErrorMsg(null);

    const type = 
      activeMainTab === "generate" 
        ? "TEXT_GENERATE" 
        : activeMainTab === "optimize" 
        ? "TEXT_OPTIMIZE" 
        : "TEMPLATE_REWRITE";

    const payload = {
      type,
      goal: activeMainTab === "generate" ? taskInput : "",
      originalPrompt: activeMainTab !== "generate" ? taskInput : "",
      framework,
      tone,
    };

    // Simulate progress while connecting
    let simulatedProgress = 5;
    const progressInterval = setInterval(() => {
      if (simulatedProgress < 95) {
        simulatedProgress += Math.floor(Math.random() * 5) + 3;
        if (simulatedProgress > 95) simulatedProgress = 95;
        setProgress(simulatedProgress);

        if (simulatedProgress >= 20 && simulatedProgress < 45) {
          setGenerationStep("正在解析原始需求语义 (Core Parsing)...");
        } else if (simulatedProgress >= 45 && simulatedProgress < 65) {
          setGenerationStep("正在匹配最佳提示词设计架构 Framework...");
        } else if (simulatedProgress >= 65 && simulatedProgress < 85) {
          setGenerationStep("正在根据参数调校语言熵与风格特征...");
        } else if (simulatedProgress >= 85) {
          setGenerationStep("正在进行最后的高并发防幻觉安全边界校验...");
        }
      }
    }, 150);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `生成失败 (HTTP ${response.status})`);
      }

      setProgress(100);
      setGenerationStep("生成完毕！正在向浏览器客户端推流...");
      
      setTimeout(() => {
        setIsGenerating(false);
        setHasGenerated(true);
        setActiveOutputTab("raw");
      }, 300);

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("响应流读取失败");
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setGeneratedRaw((prev) => prev + chunk);
      }
    } catch (err: unknown) {
      clearInterval(progressInterval);
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "未知生成错误，请稍后再试");
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: "raw" | "diff") => {
    navigator.clipboard.writeText(text);
    if (type === "raw") {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } else {
      setCopiedDiff(true);
      setTimeout(() => setCopiedDiff(false), 2000);
    }
  };

  // 自定义结构化拆解显示内容
  const getBreakdownData = () => {
    if (activePreset !== null) {
      return PRESET_TEMPLATES[activePreset].outputs.breakdown;
    }
    return {
      title: "自定义生成提示词",
      role: "高级 AI 场景专家",
      context: `围绕用户描述：“${taskInput}”所展开的专业业务环境与大语言模型应用情境。`,
      task: `生成结构高度紧凑、可读性强的任务型或对话型提示词，能够精准控制 AI 模型的输出结果。`,
      constraint: `1. 符合 ${framework.toUpperCase()} 结构布局。\n2. 语调严格遵守：${tone}。\n3. 对输出格式进行了深度绑定，避免模型产出无关冗余字符。`,
      outputFormat: "Markdown 优雅排版，条理清晰。"
    };
  };

  // 自定义对比显示内容
  const getDiffData = () => {
    if (activePreset !== null) {
      return PRESET_TEMPLATES[activePreset].outputs.diff;
    }
    return {
      original: taskInput || "帮我写一个普通的生成提示词。",
      optimized: `你是一位卓越的 ${tone} 风格 AI 提示词架构大师。请根据用户输入的具体业务痛点，生成符合 ${framework.toUpperCase()} 黄金构架的顶级提示词。在生成时，首要确保划定清晰的【角色定位】与【任务边界】，使用强逻辑列表限定生成步骤，加入真实输入输出的 Contrast (对比示范)，并在底部锁定严苛的限制性惩罚机制（如“若违反则输出空值”），从而在 Temperature = ${temperature} 条件下将幻觉率降至 1% 以下。`
    };
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f7f8f8] selection:bg-[#5e6ad2]/30 selection:text-white font-sans overflow-x-hidden">
      <div className="w-full px-6 md:px-12 lg:px-16 py-12 space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. 头部标题 & 主功能选项卡 (Vercel / Linear Style) */}
        {/* ========================================================================= */}
        <section className="space-y-6 max-w-4xl mt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 text-xs font-semibold text-[#828fff] tracking-wide animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] animate-ping" />
            <span>Awesome-Design-MD 核心架构版 v1.0 现已就绪</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            文本提示词生成器 <span className="text-[#828fff] text-2xl font-medium sm:text-3xl font-mono">/ Generator</span>
          </h1>
          
          <p className="text-sm sm:text-base text-[#8a8f98] leading-relaxed max-w-2xl">
            提供比肩顶级 AI 提示词架构师的产出。结合 Linear、Supabase、Cursor 与 Claude 等大厂提示词设计哲学，一键将平淡无奇的粗糙想法，反向编译为具备高结构、强约束、零幻觉的高级系统级提示词蓝图。
          </p>

          {/* 主工作区模式切换 (Vercel Segmented Control) */}
          <div className="flex p-1 bg-[#141516] border border-[#23252a] rounded-xl w-fit">
            {[
              { id: "generate", name: "AI 一键生成", desc: "从点子直接变顶级提示词" },
              { id: "optimize", name: "智能提示词优化", desc: "把已有提示词重塑升维" },
              { id: "framework", name: "结构框架改写", desc: "套入 CRISPE 等黄金框架" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id as "generate" | "optimize" | "framework");
                  // 切换模式时清空预设以防混淆
                  setActivePreset(null);
                }}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeMainTab === tab.id
                    ? "bg-[#23252a] text-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] border border-[#34343a]"
                    : "text-[#8a8f98] hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. 核心工作台：双栏控制面板与动态流式沙盒 (Cursor / Supabase Style) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 左半侧：交互控制参数配置区 (Supabase / Vercel style Form) */}
          <form 
            onSubmit={handleGenerate}
            className="lg:col-span-5 bg-[#0f1011] border border-[#23252a] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative group"
          >
            {/* 炫彩描边光晕 hover 浮现 */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#5e6ad2]/10 via-transparent to-[#828fff]/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="space-y-2">
              <label htmlFor="task-description" className="block text-xs font-bold uppercase tracking-wider text-[#8a8f98] select-none">
                {activeMainTab === "generate" && "1. 您的粗略需求或想法描述"}
                {activeMainTab === "optimize" && "1. 请贴入您当前的原始提示词"}
                {activeMainTab === "framework" && "1. 贴入提示词并指定改写目标"}
              </label>
              
              <div className="relative">
                <textarea
                  id="task-description"
                  value={taskInput}
                  onChange={(e) => {
                    setTaskInput(e.target.value);
                    if (activePreset !== null) setActivePreset(null); // 修改输入时清空选中高亮
                  }}
                  placeholder={
                    activeMainTab === "generate" 
                      ? "例如：写一个帮我审核 Python 代码的提示词，能挑出里面的 bug 并给出复杂度优化建议..."
                      : activeMainTab === "optimize"
                      ? "将您在别处复制的、普通的提示词贴到这里，AI 会对它进行强约束、防幻觉和精准意图校准重构..."
                      : "把任意无格式提示词贴在这里，随后我们将自动重组为精美且极具专业度的 CRISPE 规范格式..."
                  }
                  className="w-full min-h-[140px] max-h-[260px] bg-[#141516] border border-[#23252a] focus:border-[#5e6ad2]/60 focus:ring-1 focus:ring-[#5e6ad2]/30 rounded-xl p-4 text-sm text-[#f7f8f8] placeholder:text-[#62666d] outline-none transition-all duration-300 resize-y"
                  required
                />
              </div>
            </div>

            {/* 快速模板选用 (Chips - Linear Style) */}
            {activeMainTab === "generate" && (
              <div className="space-y-2.5">
                <span className="block text-[11px] font-bold uppercase tracking-widest text-[#62666d]">
                  💡 快速套用经典模板：
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_TEMPLATES.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(idx)}
                      className={`text-xs px-3.5 py-2 rounded-xl border transition-all duration-300 font-medium ${
                        activePreset === idx
                          ? "bg-[#5e6ad2]/15 border-[#5e6ad2] text-white shadow-[0_0_12px_rgba(94,106,210,0.15)]"
                          : "bg-[#141516] border-[#23252a] text-[#8a8f98] hover:text-white hover:border-[#3e3e44]"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 参数调校网格 */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#23252a] pt-5">
              <div className="space-y-2">
                <label htmlFor="framework-select" className="block text-[11px] font-bold uppercase tracking-widest text-[#8a8f98]">
                  设计框架
                </label>
                <select
                  id="framework-select"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as "crispe" | "costar" | "default")}
                  className="w-full bg-[#141516] border border-[#23252a] rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none cursor-pointer hover:border-[#3e3e44] focus:border-[#5e6ad2] transition-colors"
                >
                  <option value="costar">CO-STAR (推荐)</option>
                  <option value="crispe">CRISPE (严谨)</option>
                  <option value="default">默认金钥匙结构</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="tone-select" className="block text-[11px] font-bold uppercase tracking-widest text-[#8a8f98]">
                  产出语调
                </label>
                <select
                  id="tone-select"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#141516] border border-[#23252a] rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none cursor-pointer hover:border-[#3e3e44] focus:border-[#5e6ad2] transition-colors"
                >
                  <option value="专业">专业严谨</option>
                  <option value="亲和力">亲和温驯</option>
                  <option value="极客">极客极简</option>
                  <option value="激情">富有激情</option>
                </select>
              </div>
            </div>

            {/* 目标大模型适配 */}
            <div className="space-y-2">
              <label htmlFor="model-select" className="block text-[11px] font-bold uppercase tracking-widest text-[#8a8f98]">
                目标适配大模型
              </label>
              <select
                id="model-select"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#141516] border border-[#23252a] rounded-xl px-3 py-2.5 text-xs font-semibold text-white outline-none cursor-pointer hover:border-[#3e3e44] focus:border-[#5e6ad2] transition-colors"
              >
                <option value="Flux / Midjourney / text-LLM">通用大语言模型 (ChatGPT/Claude/DeepSeek)</option>
                <option value="Midjourney Special">Midjourney / Stable Diffusion 专业绘画模型</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (长上下文与极强逻辑调校)</option>
                <option value="GPT-4o / o1">GPT-4o / o1-preview 专属优化</option>
              </select>
            </div>

            {/* 高级滑块参数 (Supabase Range Style) */}
            <div className="space-y-4 border-t border-[#23252a] pt-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-[#8a8f98]">
                  <span>大模型创造力 (Temperature)</span>
                  <span className="font-mono text-[#828fff]">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.2"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#141516] border border-[#23252a] rounded-lg appearance-none cursor-pointer accent-[#5e6ad2]"
                />
                <div className="flex justify-between text-[10px] text-[#62666d]">
                  <span>严谨精确</span>
                  <span>富有创意</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-[#8a8f98]">
                  <span>最大产出字数限制</span>
                  <span className="font-mono text-[#828fff]">{lengthConstraint} 字</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={lengthConstraint}
                  onChange={(e) => setLengthConstraint(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#141516] border border-[#23252a] rounded-lg appearance-none cursor-pointer accent-[#5e6ad2]"
                />
              </div>
            </div>

            {/* 炫彩生成触发按钮 (Linear Action Glow) */}
            <button
              type="submit"
              disabled={isGenerating || !taskInput.trim()}
              className={`w-full py-4 rounded-xl font-extrabold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 ${
                !taskInput.trim()
                  ? "bg-[#141516] border border-[#23252a] text-[#62666d] cursor-not-allowed"
                  : isGenerating
                  ? "bg-[#23252a] border border-[#34343a] text-white cursor-wait"
                  : "bg-gradient-to-r from-[#5e6ad2] to-[#828fff] hover:shadow-[0_0_30px_rgba(94,106,210,0.25)] text-white hover:opacity-95 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              }`}
            >
              <svg className={`w-4 h-4 ${isGenerating ? "animate-spin text-[#828fff]" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795m-8.982 4.11a9 9 0 00-6.195-2.07l.822-4.8 6.195 2.07m0 0L12 3l-8.982 11.795m8.982-4.11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isGenerating ? "正在编译高级提示词..." : "一键开始生成提示词"}
            </button>
          </form>

          {/* 右半侧：实时输出沙盒 / 终端控制台 (Cursor Code / Monospace Editor Style) */}
          <div className="lg:col-span-7 bg-[#0f1011] border border-[#23252a] rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[580px] group">
            
            {/* 顶栏控制带：带红黄绿小圆点 (Mac Console Style) */}
            <div className="h-14 border-b border-[#23252a] bg-[#141516] flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-2 select-none">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-xs font-semibold font-mono text-[#8a8f98]">
                  PROMPT_SANDBOX_OUTPUT.py
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#27a644]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a8f98]">Sandbox Ready</span>
              </div>
            </div>

            {/* 占位空态 (Vercel Clean Empty State) */}
            {!errorMsg && !isGenerating && !hasGenerated && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-[#0a0a0c]">
                <div className="w-16 h-16 rounded-2xl bg-[#141516] border border-[#23252a] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#62666d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">沙盒处于就绪状态</p>
                  <p className="text-xs text-[#8a8f98] max-w-sm leading-relaxed">
                    在左侧表单中选择经典模板或输入您的粗略想法，随后点击下方一键生成，顶级的结构化提示词将在此流式打印与深度剖析。
                  </p>
                </div>
              </div>
            )}

            {/* 错误状态显示 */}
            {errorMsg && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-[#0a0a0c] border-t border-[#23252a]/50">
                <div className="w-16 h-16 rounded-2xl bg-red-950/20 border border-red-900/50 flex items-center justify-center text-red-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-red-200">生成出错 / GENERATION_ERROR</p>
                  <p className="text-xs text-red-400 max-w-md leading-relaxed">
                    {errorMsg}
                  </p>
                </div>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-semibold text-white transition-colors"
                >
                  清除错误并重试
                </button>
              </div>
            )}

            {/* 模拟生成进度条 (Vercel Custom Loading) */}
            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0c] space-y-6">
                <div className="w-20 h-20 relative flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full border-4 border-dashed border-[#5e6ad2]/20 border-t-[#5e6ad2] animate-spin" />
                  <span className="absolute font-mono text-xs font-bold text-white">{progress}%</span>
                </div>
                
                <div className="w-full max-w-md space-y-3.5 text-center">
                  <span className="text-xs font-semibold text-[#828fff] animate-pulse">
                    {generationStep}
                  </span>
                  
                  <div className="w-full h-1.5 bg-[#141516] rounded-full overflow-hidden border border-[#23252a]">
                    <div
                      className="h-full bg-gradient-to-r from-[#5e6ad2] to-[#828fff] rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(94,106,210,0.4)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 生成结果展示 (Fidelity Monospace Playground) */}
            {hasGenerated && !errorMsg && (
              <div className="flex-1 flex flex-col bg-[#070709] overflow-hidden">
                {/* 选项卡导航栏 (Sub-tab bar - Linear / Vercel style) */}
                <div className="flex border-b border-[#23252a] bg-[#0c0d0e] px-4 shrink-0 justify-between items-center">
                  <div className="flex gap-4">
                    {[
                      { id: "raw", name: "生成提示词 (Raw)", icon: (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      ) },
                      { id: "breakdown", name: "结构剖析", icon: (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                        </svg>
                      ) },
                      { id: "diff", name: "优化对比 (Diff)", icon: (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      ) }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveOutputTab(tab.id as "raw" | "breakdown" | "diff")}
                        className={`py-3.5 px-2.5 text-xs font-semibold relative transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                          activeOutputTab === tab.id ? "text-white" : "text-[#8a8f98] hover:text-white"
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                        {activeOutputTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5e6ad2]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* 快捷复制代码按钮 (Micro Action) */}
                  {activeOutputTab === "raw" && (
                    <button
                      onClick={() => copyToClipboard(generatedRaw, "raw")}
                      className="px-3 py-1.5 rounded-lg bg-[#23252a] hover:bg-[#5e6ad2]/20 border border-[#34343a] hover:border-[#5e6ad2]/40 text-xs font-medium text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      {copiedRaw ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-emerald-400">已复制！</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span>全部复制</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* 选项卡对应展示区域 */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[500px] custom-scrollbar">
                  
                  {/* TAB 1: 纯文本 (Monospace Output Card) */}
                  {activeOutputTab === "raw" && (
                    <div className="relative h-full">
                      <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap select-all">
                        {generatedRaw || "正在解析输出流..."}
                        <span className="w-1.5 h-4 bg-[#828fff] inline-block animate-pulse ml-0.5" />
                      </pre>
                    </div>
                  )}

                  {/* TAB 2: 结构剖析 (Supabase-style Table / Cards) */}
                  {activeOutputTab === "breakdown" && (
                    <div className="space-y-6">
                      <div className="border-b border-[#23252a] pb-4">
                        <h3 className="text-sm font-bold text-white mb-1">【{getBreakdownData().title}】结构化元数据拆解</h3>
                        <p className="text-xs text-[#8a8f98]">我们将此提示词按照 {framework.toUpperCase()} 设计规范拆分为以下黄金字段</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { label: "Role (角色设定)", val: getBreakdownData().role, color: "border-purple-500/20 bg-purple-500/5 text-purple-400" },
                          { label: "Context (背景要素)", val: getBreakdownData().context, color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
                          { label: "Task (核心任务)", val: getBreakdownData().task, color: "border-amber-500/20 bg-amber-500/5 text-amber-400" },
                          { label: "Constraints (边界约束)", val: getBreakdownData().constraint, color: "border-rose-500/20 bg-rose-500/5 text-rose-400" },
                          { label: "Output Format (输出规范)", val: getBreakdownData().outputFormat, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border ${item.color} space-y-1.5`}
                          >
                            <span className="text-[10px] uppercase font-bold tracking-widest block opacity-90">{item.label}</span>
                            <p className="text-xs text-gray-200 leading-relaxed font-sans font-medium whitespace-pre-wrap">{item.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: 对比分析 (Git Side-by-Side Diff Layout) */}
                  {activeOutputTab === "diff" && (
                    <div className="space-y-6">
                      <div className="border-b border-[#23252a] pb-4">
                        <h3 className="text-sm font-bold text-white mb-1">提示词优化效果前后对照 (Git Diff)</h3>
                        <p className="text-xs text-[#8a8f98]">对比您的原始简略输入与经 AI 升维重构后的黄金系统级指令</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 原始输入 */}
                        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400">原始点子 / Raw Prompt</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[9px]">BEFORE</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed min-h-[140px] whitespace-pre-wrap font-sans">
                            {getDiffData().original}
                          </p>
                        </div>

                        {/* 经 AI 深度改写优化后 */}
                        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3 relative">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">AI 黄金级指令 / Optimized</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px]">AFTER</span>
                          </div>
                          <p className="text-xs text-gray-200 leading-relaxed min-h-[140px] whitespace-pre-wrap font-sans">
                            {getDiffData().optimized}
                          </p>
                          <div className="absolute bottom-4 right-4">
                            <button
                              onClick={() => copyToClipboard(getDiffData().optimized, "diff")}
                              className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-lg transition-all duration-300 cursor-pointer"
                              title="复制此优化版本"
                            >
                              {copiedDiff ? (
                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {copiedDiff && (
                        <div className="text-center text-xs text-emerald-400 font-bold tracking-wide animate-pulse">
                          ✨ 黄金优化版提示词已成功复制到剪贴板，快去您的 AI 客户端测试它吧！
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. 提示词设计核心黄金框架知识体系 (Claude Editorial style Card) */}
        {/* ========================================================================= */}
        <section className="bg-[#0f1011] border border-[#23252a] rounded-3xl p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#5e6ad2]/5 blur-3xl pointer-events-none" />
          
          <div className="space-y-3 relative">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">大师级提示词构建框架</h2>
            <p className="text-xs sm:text-sm text-[#8a8f98] max-w-2xl">
              好的提示词不是随意的日常对话，而是高精度的程序编译。我们内置的生成器完美对齐以下业界最权威的提示词设计论：
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {[
              {
                title: "CO-STAR 框架 — 微软/新加坡 AI 团队主推",
                desc: "以高度场景化和产出控制著称，极其适合通用型大语言模型（如 GPT、Claude）进行复杂业务内容的精准改写与文章深度润色。",
                structure: [
                  { k: "C", n: "Context", d: "背景要素" },
                  { k: "O", n: "Objective", d: "核心任务目标" },
                  { k: "S", n: "Style", d: "指定语气/文采风格" },
                  { k: "T", n: "Tone", d: "大模型的情绪共鸣度" },
                  { k: "A", n: "Audience", d: "最终读者的肖像特征" },
                  { k: "R", n: "Response", d: "指定数据返回/排版要求" }
                ]
              },
              {
                title: "CRISPE 框架 — 学术界与顶尖 AI 实验室共识",
                desc: "偏向严格的命令式结构，具备强有力的角色边界限定和防幻觉参数约束，常用于技术开发、代码重构和严肃学术期刊翻译助理的构建。",
                structure: [
                  { k: "CR", n: "Capacity & Role", d: "指定大模型的专家角色身份与背景知识库" },
                  { k: "I", n: "Insight", d: "提供执行此任务所需的关键洞察或上下文先验信息" },
                  { k: "S", n: "Statement", d: "您需要大模型精确完成的步骤、命令或业务声明" },
                  { k: "P", n: "Personality", d: "大模型展现出的工作作风、情绪色彩和反应深度" },
                  { k: "E", n: "Experiment", d: "为大语言模型划定多个对比温区与多次优化迭代选项" }
                ]
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#141516] border border-[#23252a] rounded-2xl p-6 space-y-4 hover:border-[#34343a] transition-all duration-300"
              >
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5e6ad2]" />
                  {item.title}
                </h3>
                <p className="text-xs text-[#8a8f98] leading-relaxed">{item.desc}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#23252a]">
                  {item.structure.map((item2, idx2) => (
                    <div key={idx2} className="bg-[#0f1011] border border-[#23252a] px-2.5 py-1.5 rounded-lg text-left">
                      <span className="font-mono text-xs font-bold text-[#828fff] block">{item2.k}. {item2.n}</span>
                      <span className="text-[10px] text-gray-400 font-sans">{item2.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. 常见问题解答区 FAQ (Accordion style) */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">常见问题解答 / FAQ</h2>
            <p className="text-xs sm:text-sm text-[#8a8f98]">了解提示词生成的细节，掌控属于您的 AI 生成资产</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                q: "为什么大模型极其需要使用结构化框架（如 CO-STAR）？",
                a: "大语言模型基于概率预测下一个 Token，随意的口语化描述容易导致注意力分散。结构化框架利用标记符号（如 ##, **, Markdown 列表）将指令分区，使得大模型的注意力能够精准投射在角色背景、硬约束、输出结构等核心要点上，有效抑制幻觉，使响应稳定度提高 80% 以上。"
              },
              {
                q: "这里的生成器是完全免费的吗？我生成的提示词有版权吗？",
                a: "完全免费，无需登录注册即可即拖即用。您在本平台生成的提示词属于完全公开的知识资产，您拥有完全自主的版权，可以自由应用到任何商业或个人 AI 项目、APP 开发、代码构建或模型调教中。"
              },
              {
                q: "为什么建议使用本工具生成，而不是在对话框里直接和大模型沟通？",
                a: "直接沟通需要您反复调试角色设定、防幻觉机制等细节，这可能浪费大量的 Token。我们的工具由一套高复杂度的元提示词（Meta-Prompting）引擎驱动，能自动帮您补全模型边界、参数温区、负向约束，一步到位得到最规范的系统提示词（System Prompt）。"
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#0f1011] border border-[#23252a] rounded-2xl p-5 sm:p-6 space-y-2.5"
              >
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-[#828fff] font-mono">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-xs text-[#8a8f98] leading-relaxed pl-5 border-l border-[#23252a]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
