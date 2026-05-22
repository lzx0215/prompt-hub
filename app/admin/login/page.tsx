"use client";

import React, { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "登录失败，请检查用户名或密码");
      }

      // Success, redirect to dashboard
      window.location.href = "/admin";
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "无法连接到服务器");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 selection:bg-[#03B9B9]/30">
      <div className="w-full max-w-md bg-[#111116] border border-white/[0.06] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
        {/* Top Glow Lines */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#03B9B9]/40 to-transparent pointer-events-none" />
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#2F93C8]/5 via-transparent to-[#03B9B9]/5 pointer-events-none" />

        <div className="space-y-6 relative">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Prompt Hub 管理后台
            </h1>
            <p className="text-xs text-gray-500">请输入管理员凭据以进入控制面板</p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                管理员账号
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                安全密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                className="w-full bg-[#141516] border border-white/[0.08] focus:border-[#03B9B9]/50 focus:ring-1 focus:ring-[#03B9B9]/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 text-white ${
                isLoading
                  ? "bg-[#23252a] border border-[#34343a] cursor-wait"
                  : "bg-gradient-to-r from-[#2F93C8] to-[#03B9B9] hover:shadow-[0_0_20px_rgba(3,185,185,0.25)] hover:opacity-95 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              }`}
            >
              {isLoading ? "正在验证身份..." : "安全登录"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
