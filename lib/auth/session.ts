import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "prompt-hub-default-secret-key-123456";

export interface SessionPayload {
  username: string;
  expiresAt: number;
}

export function signSession(username: string): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 1 day
  const payload: SessionPayload = { username, expiresAt };
  const payloadStr = JSON.stringify(payload);
  const signature = createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("hex");
  return `${Buffer.from(payloadStr).toString("base64")}.${signature}`;
}

export function verifySession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadBase64, signature] = parts;
  try {
    const payloadStr = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const payload = JSON.parse(payloadStr) as SessionPayload;
    
    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    
    // Check signature securely
    const expectedSignature = createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("hex");
    
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}
