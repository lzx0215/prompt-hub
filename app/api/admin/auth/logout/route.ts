import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "登出成功" });
    
    // Clear HTTP-only Cookie
    response.cookies.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Immediately expire
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "服务器内部错误，登出失败" }, { status: 500 });
  }
}
