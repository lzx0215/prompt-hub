import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/prisma";
import { loadSeedPrompts } from "../lib/seed/load-seed-prompts";

async function main() {
  const password = process.env.ADMIN_INITIAL_PASSWORD ?? "prompt-hub-admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });

  const category = await prisma.category.upsert({
    where: { slug: "office" },
    update: {
      name: "办公效率",
      description: "会议、汇报、总结、邮件和日常办公提示词。",
      sortOrder: 10,
    },
    create: {
      slug: "office",
      name: "办公效率",
      description: "会议、汇报、总结、邮件和日常办公提示词。",
      sortOrder: 10,
    },
  });

  const prompts = await loadSeedPrompts("content/seed-prompts/foundation.json");

  for (const prompt of prompts) {
    const createdPrompt = await prisma.prompt.upsert({
      where: { slug: prompt.slug },
      update: {
        title: prompt.title,
        summary: prompt.summary,
        content: prompt.content,
        exampleInput: prompt.exampleInput,
        exampleOutput: prompt.exampleOutput,
        structureRole: prompt.structureRole,
        structureTask: prompt.structureTask,
        structureContext: prompt.structureContext,
        structureConstraints: prompt.structureConstraints,
        structureOutputFormat: prompt.structureOutputFormat,
        weakPrompt: prompt.weakPrompt,
        improvedPrompt: prompt.improvedPrompt,
        improvementNotes: prompt.improvementNotes,
        language: prompt.language,
        isFeatured: prompt.isFeatured,
        status: "PUBLISHED",
        categoryId: category.id,
      },
      create: {
        slug: prompt.slug,
        title: prompt.title,
        summary: prompt.summary,
        content: prompt.content,
        exampleInput: prompt.exampleInput,
        exampleOutput: prompt.exampleOutput,
        structureRole: prompt.structureRole,
        structureTask: prompt.structureTask,
        structureContext: prompt.structureContext,
        structureConstraints: prompt.structureConstraints,
        structureOutputFormat: prompt.structureOutputFormat,
        weakPrompt: prompt.weakPrompt,
        improvedPrompt: prompt.improvedPrompt,
        improvementNotes: prompt.improvementNotes,
        language: prompt.language,
        isFeatured: prompt.isFeatured,
        status: "PUBLISHED",
        categoryId: category.id,
      },
    });

    for (const tagSlug of prompt.tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name: tagSlug },
        create: { slug: tagSlug, name: tagSlug },
      });

      await prisma.promptTag.upsert({
        where: {
          promptId_tagId: {
            promptId: createdPrompt.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          promptId: createdPrompt.id,
          tagId: tag.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
