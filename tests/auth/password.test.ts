import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../../lib/auth/password";

describe("password utilities", () => {
  it("verifies a matching password and rejects a wrong password", async () => {
    const hash = await hashPassword("correct-password");

    await expect(verifyPassword("correct-password", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });
});
