import { prisma } from "@/lib/db/prisma";
import { getDailyLimit, hashIp, type RateLimitType } from "./rules";

import { GenerationType } from "@prisma/client";

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",");
    return ips[0].trim();
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}

export async function checkRateLimit(
  request: Request,
  type: RateLimitType
): Promise<{ allowed: boolean; ipHash: string; currentCount: number; limit: number }> {
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const limit = getDailyLimit(type);

  // 获取今天的起止时间 (服务器本地/时区零点)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // 区分文本类型和图像类型的 GenerationType 分组
  const types: GenerationType[] =
    type === "image"
      ? [GenerationType.IMAGE_TO_PROMPT, GenerationType.DESIGN_ANALYSIS]
      : [GenerationType.TEXT_GENERATE, GenerationType.TEXT_OPTIMIZE, GenerationType.TEMPLATE_REWRITE];

  const currentCount = await prisma.generationRecord.count({
    where: {
      ipHash,
      type: {
        in: types,
      },
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  return {
    allowed: currentCount < limit,
    ipHash,
    currentCount,
    limit,
  };
}
