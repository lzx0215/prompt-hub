import { createHash } from "node:crypto";

export type RateLimitType = "text" | "image";

export interface RateLimitKeyInput {
  ip: string;
  type: RateLimitType;
  date: string;
}

export interface LimitCheckInput {
  currentCount: number;
  limit: number;
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export function buildRateLimitKey(input: RateLimitKeyInput): string {
  return `${input.type}:${input.date}:${hashIp(input.ip)}`;
}

export function isWithinLimit(input: LimitCheckInput): boolean {
  return input.currentCount < input.limit;
}

export function getDailyLimit(type: RateLimitType): number {
  if (type === "image") {
    return Number(process.env.RATE_LIMIT_IMAGE_DAILY ?? 3);
  }

  return Number(process.env.RATE_LIMIT_TEXT_DAILY ?? 10);
}
