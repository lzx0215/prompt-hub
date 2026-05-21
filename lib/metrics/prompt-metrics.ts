import { prisma } from "@/lib/db/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestableClient = any;

async function incrementPublishedPromptMetric(
  id: string,
  field: "copyCount" | "viewCount",
  client: TestableClient = prisma,
): Promise<boolean> {
  try {
    const result = await client.prompt.updateMany({
      where: { id, status: "PUBLISHED" },
      data:
        field === "viewCount"
          ? { viewCount: { increment: 1 } }
          : { copyCount: { increment: 1 } },
    });

    return result.count > 0;
  } catch {
    return false;
  }
}

export function recordPromptView(id: string, client: TestableClient = prisma) {
  return incrementPublishedPromptMetric(id, "viewCount", client);
}

export function recordPromptCopy(id: string, client: TestableClient = prisma) {
  return incrementPublishedPromptMetric(id, "copyCount", client);
}
