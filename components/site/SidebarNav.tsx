"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 定义导航菜单项
const navItems = [
  {
    href: "/image-to-prompt",
    label: "图片转提示词",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/generator",
    label: "生成器",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    href: "/prompts",
    label: "提示词库",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: "/learn",
    label: "学习",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 判断是否为暗色调专题页面（图片转提示词 & 文本生成器）
  const isDarkPage = pathname.startsWith("/image-to-prompt") || pathname.startsWith("/generator");

  // 主题样式匹配表
  const theme = {
    aside: isDarkPage 
      ? "bg-[#0A0A0E] border-white/[0.08] text-white" 
      : "bg-white border-slate-200 text-slate-900 shadow-sm",
    logoText: isDarkPage
      ? "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
      : "text-slate-900 font-extrabold",
    itemInactive: isDarkPage
      ? "text-gray-400 hover:text-white hover:bg-white/[0.04]"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
    itemActive: isDarkPage
      ? "bg-gradient-to-r from-[#2F93C8]/15 to-[#03B9B9]/15 border border-[#2F93C8]/30 text-white shadow-[0_0_15px_rgba(47,147,200,0.08)]"
      : "bg-indigo-50/80 border border-indigo-100 text-indigo-600 font-semibold",
    iconInactive: isDarkPage ? "text-gray-500" : "text-slate-400",
    iconActive: isDarkPage ? "text-[#03B9B9]" : "text-indigo-600",
    adminBtn: isDarkPage
      ? "border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.04]"
      : "border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50",
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. 桌面端常驻左侧侧边栏 */}
      {/* ========================================================================= */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 border-r hidden md:flex flex-col z-40 transition-colors duration-500 ${theme.aside}`}
      >
        {/* 顶部 Logo & 品牌区 */}
        <div className="h-16 flex items-center px-6 border-b border-inherit gap-3 select-none">
          <svg className={`w-7 h-7 ${isDarkPage ? "text-[#03B9B9]" : "text-indigo-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className={`font-bold text-base tracking-wide transition-all ${theme.logoText}`}>
            Prompt Hub
          </span>
        </div>

        {/* 主导航链接列表 */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm group ${
                  isActive ? theme.itemActive : theme.itemInactive
                }`}
              >
                <span
                  className={`transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                    isActive ? theme.iconActive : theme.iconInactive
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 底部管理后台快捷链接 */}
        <div className="p-4 border-t border-inherit">
          <Link
            href="/admin"
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-semibold tracking-wider transition-all duration-300 ${theme.adminBtn}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>管理后台</span>
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. 移动端顶栏 Header */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 border-b z-40 md:hidden transition-colors duration-500 ${theme.aside}`}
      >
        <Link href="/" className="flex items-center gap-2 select-none">
          <svg className={`w-6 h-6 ${isDarkPage ? "text-[#03B9B9]" : "text-indigo-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className={`font-bold text-sm tracking-wide ${theme.logoText}`}>
            Prompt Hub
          </span>
        </Link>

        {/* 移动端汉堡菜单触发按钮 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-white/[0.05] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 3. 移动端滑动抽屉菜单 Drawer & 遮罩层 */}
      {/* ========================================================================= */}
      {isOpen && (
        <>
          {/* 半透明模糊遮罩背景 */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-45 backdrop-blur-sm md:hidden animate-fade-in transition-all duration-300"
          />

          {/* 滑动抽屉 */}
          <div
            className={`fixed top-16 left-0 bottom-0 w-[270px] border-r z-48 p-5 flex flex-col justify-between md:hidden animate-in slide-in-from-left duration-300 ${theme.aside}`}
          >
            <div className="space-y-6">
              <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 pl-4 select-none">
                主要导航
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                        isActive ? theme.itemActive : theme.itemInactive
                      }`}
                    >
                      <span className={isActive ? theme.iconActive : theme.iconInactive}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* 抽屉底部 */}
            <div className="border-t border-inherit pt-5">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-semibold tracking-wider transition-all duration-300 ${theme.adminBtn}`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>进入管理后台</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
