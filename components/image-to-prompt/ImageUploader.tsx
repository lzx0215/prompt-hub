"use client";

import React, { useState, useRef } from "react";
import { UploadIcon, SparklesIcon, FileTextIcon, SlidersIcon, CopyIcon, CheckIcon } from "./icons";

type UploadStatus = "idle" | "uploading" | "analyzing" | "completed";

export function ImageUploader() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<"flux" | "banana">("flux");
  
  const [fluxPrompt, setFluxPrompt] = useState("");
  const [bananaJson, setBananaJson] = useState("");
  const [, setExplanation] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      startAnalysis(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      startAnalysis(file);
    }
  };

  const startAnalysis = async (file: File) => {
    setErrorMsg(null);
    
    // Validate file size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg("图片文件过大，最大支持 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setStatus("uploading");
    setProgress(5);
    setStatusText("正在上传图片至安全提示词服务器...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", "image-generation");

    let simulatedProgress = 5;
    const progressInterval = setInterval(() => {
      if (simulatedProgress < 90) {
        simulatedProgress += Math.floor(Math.random() * 5) + 3;
        if (simulatedProgress > 90) simulatedProgress = 90;
        setProgress(simulatedProgress);

        if (simulatedProgress >= 20 && simulatedProgress < 45) {
          setStatusText("正在运行视觉神经网络解析...");
        } else if (simulatedProgress >= 45 && simulatedProgress < 65) {
          setStatusText("正在分析画面光照方向与色彩特征...");
        } else if (simulatedProgress >= 65 && simulatedProgress < 80) {
          setStatusText("正在提取语义 Token 与风格特征参数...");
        } else if (simulatedProgress >= 80) {
          setStatusText("正在生成自然语言描述词与结构化 JSON 蓝图...");
        }
      }
    }, 150);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `上传分析失败 (HTTP ${response.status})`);
      }

      const result = await response.json();
      setProgress(100);
      setStatusText("生成成功！");
      setFluxPrompt(result.naturalPrompt || "");
      setBananaJson(JSON.stringify(result.jsonBlueprint || {}, null, 2));
      setExplanation(result.chineseExplanation || "");
      
      setTimeout(() => {
        setStatus("completed");
      }, 500);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "未知分析错误，请稍后再试");
      setStatus("idle");
    }
  };

  const copyToClipboard = (text: string, type: "flux" | "banana") => {
    navigator.clipboard.writeText(text);
    if (type === "flux") {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const resetUploader = () => {
    setStatus("idle");
    setProgress(0);
    setImagePreview(null);
    setFluxPrompt("");
    setBananaJson("");
    setExplanation("");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  return (
    <div className="bg-[#111116] border border-white/[0.06] rounded-3xl p-6 sm:p-8 mt-8 shadow-2xl relative overflow-hidden group text-left">
      {/* 顶部精美渐变线条 */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#03B9B9]/30 to-transparent pointer-events-none" />
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#2F93C8]/5 via-transparent to-[#03B9B9]/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg,.webp,.heic"
        className="hidden"
      />

      {status === "idle" && (
        <div className="space-y-4 w-full">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-200 text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative w-full min-h-[260px] flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-[#03B9B9]/50 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 cursor-pointer p-6 text-center"
          >
          <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
            <UploadIcon className="w-6 h-6 text-gray-400 group-hover:text-[#03B9B9] transition-colors" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">点击或将图片拖拽到这里</p>
            <p className="text-xs text-[#9BA1A6]">支持 PNG, JPG, WEBP 或 HEIC 格式</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-[10px] font-semibold text-gray-400 uppercase tracking-widest border border-white/[0.03]">
            安全与隐私保护
          </div>
          </div>
        </div>
      )}

      {status === "uploading" && (
        <div className="w-full min-h-[260px] flex flex-col items-center justify-center p-6 text-center space-y-6">
          {imagePreview && (
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/[0.08] shadow-lg animate-pulse">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#0A0A0E]/30" />
            </div>
          )}
          
          <div className="w-full max-w-md space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#03B9B9] animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#03B9B9] animate-ping" />
                {statusText}
              </span>
              <span className="text-gray-400">{progress}%</span>
            </div>
            
            <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {status === "completed" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* 左侧：图片预览 & 重设 */}
          <div className="md:col-span-4 space-y-5">
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl group/preview">
                <img src={imagePreview} alt="Uploaded source" className="w-full h-auto object-cover max-h-[300px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-white/80 font-medium">原始图片</span>
                </div>
              </div>
            )}
            
            <button
              onClick={resetUploader}
              className="w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2"
            >
              <UploadIcon className="w-4 h-4" />
              重新上传图片
            </button>
          </div>

          {/* 右侧：提示词分析输出 */}
          <div className="md:col-span-8 space-y-6">
            {/* 标签页导航 */}
            <div className="flex border-b border-white/[0.08] gap-6">
              <button
                onClick={() => setActiveTab("flux")}
                className={`pb-3 text-sm font-semibold relative transition-all duration-300 ${
                  activeTab === "flux" ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Flux 大师级提示词 (英文)
                </div>
                {activeTab === "flux" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] rounded-full" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("banana")}
                className={`pb-3 text-sm font-semibold relative transition-all duration-300 ${
                  activeTab === "banana" ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" />
                  Nano Banana 结构化蓝图 (JSON)
                </div>
                {activeTab === "banana" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] rounded-full" />
                )}
              </button>
            </div>

            {/* 标签页内容 */}
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === "flux" && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
                    <p className="text-sm text-gray-300 leading-relaxed font-mono select-all">
                      {fluxPrompt}
                    </p>
                    
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => copyToClipboard(fluxPrompt, "flux")}
                        className="p-2 bg-white/[0.04] hover:bg-[#03B9B9]/15 border border-white/[0.08] hover:border-[#03B9B9]/30 text-gray-400 hover:text-white rounded-lg transition-all duration-300"
                        title="复制提示词"
                      >
                        {copiedPrompt ? <CheckIcon className="w-4 h-4 text-[#03B9B9]" /> : <CopyIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 py-3 px-4 bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] hover:opacity-95 text-white rounded-xl font-bold text-xs transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(3,185,185,0.15)]">
                      <SparklesIcon className="w-4 h-4" />
                      去 Flux AI 绘图
                    </button>
                    <button
                      onClick={() => copyToClipboard(fluxPrompt, "flux")}
                      className="py-3 px-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] text-white rounded-xl font-semibold text-xs transition-all duration-300"
                    >
                      {copiedPrompt ? "已复制！" : "复制提示词"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "banana" && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
                    <pre className="text-xs text-emerald-400 leading-relaxed font-mono select-all max-h-[300px] overflow-y-auto pr-10 custom-scrollbar">
                      {bananaJson}
                    </pre>
                    
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => copyToClipboard(bananaJson, "banana")}
                        className="p-2 bg-white/[0.04] hover:bg-[#03B9B9]/15 border border-white/[0.08] hover:border-[#03B9B9]/30 text-gray-400 hover:text-white rounded-lg transition-all duration-300"
                        title="复制 JSON 蓝图"
                      >
                        {copiedJson ? <CheckIcon className="w-4 h-4 text-[#03B9B9]" /> : <CopyIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 py-3 px-4 bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] hover:opacity-95 text-white rounded-xl font-bold text-xs transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(3,185,185,0.15)]">
                      <SlidersIcon className="w-4 h-4" />
                      去 Nano Banana Pro 生成
                    </button>
                    <button
                      onClick={() => copyToClipboard(bananaJson, "banana")}
                      className="py-3 px-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] text-white rounded-xl font-semibold text-xs transition-all duration-300"
                    >
                      {copiedJson ? "已复制！" : "复制 JSON"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
