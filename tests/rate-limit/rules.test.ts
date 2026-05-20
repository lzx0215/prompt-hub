import { describe, expect, it } from "vitest";
import { buildRateLimitKey, isWithinLimit } from "@/lib/rate-limit/rules";

describe("rate limit rules", () => {
  it("builds a stable key without storing the raw IP", () => {
    const key = buildRateLimitKey({
      ip: "127.0.0.1",
      type: "text",
      date: "2026-05-20",
    });

    expect(key).toContain("text:2026-05-20:");
    expect(key).not.toContain("127.0.0.1");
  });

  it("allows requests below the limit and rejects requests at the limit", () => {
    expect(isWithinLimit({ currentCount: 9, limit: 10 })).toBe(true);
    expect(isWithinLimit({ currentCount: 10, limit: 10 })).toBe(false);
  });
});
