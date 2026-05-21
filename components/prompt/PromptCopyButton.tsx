"use client";

import { useState } from "react";
import { recordPromptCopyAction } from "@/app/actions/prompt-metrics";

interface PromptCopyButtonProps {
  content: string;
  promptId: string;
}

export function PromptCopyButton({ content, promptId }: PromptCopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setStatus("copied");
      recordPromptCopyAction(promptId).catch(() => {});
    } catch {
      setStatus("failed");
    }

    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      className="rounded-md bg-slate-950 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-800"
      onClick={handleCopy}
      type="button"
    >
      {status === "copied" ? "已复制" : status === "failed" ? "复制失败，请手动选择" : "复制提示词"}
    </button>
  );
}
