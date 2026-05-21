import { prisma } from "@/lib/db/prisma";
import type { PublicPromptListFilters, RelatedPromptInput } from "./public-types";

const promptCardInclude = {
  category: true,
  tags: { include: { tag: true } },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestableClient = any;

export async function getFeaturedPublicPrompts(client: TestableClient = prisma) {
  return client.prompt.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: promptCardInclude,
    orderBy: [{ copyCount: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
}

export async function getPublicPromptList(
  filters: PublicPromptListFilters,
  client: TestableClient = prisma,
) {
  const query = filters.query?.trim();
  const where = {
    status: "PUBLISHED" as const,
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.tag ? { tags: { some: { tag: { slug: filters.tag } } } } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { summary: { contains: query } },
            { content: { contains: query } },
          ],
        }
      : {}),
  };

  return client.prompt.findMany({
    where,
    include: promptCardInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getPublicPromptBySlug(slug: string, client: TestableClient = prisma) {
  return client.prompt.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: promptCardInclude,
  });
}

export async function getRelatedPublicPrompts(
  input: RelatedPromptInput,
  client: TestableClient = prisma,
) {
  return client.prompt.findMany({
    where: {
      id: { not: input.id },
      status: "PUBLISHED",
      OR: [
        { categoryId: input.categoryId },
        { tags: { some: { tagId: { in: input.tagIds } } } },
      ],
    },
    include: promptCardInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 4,
  });
}

export async function getPublicPromptFilterOptions(client: TestableClient = prisma) {
  const [categories, tags] = await Promise.all([
    client.category.findMany({
      where: { prompts: { some: { status: "PUBLISHED" } } },
      orderBy: { sortOrder: "asc" },
    }),
    client.tag.findMany({
      where: { prompts: { some: { prompt: { status: "PUBLISHED" } } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { categories, tags };
}
