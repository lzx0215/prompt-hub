import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/prisma";
import { loadSeedPrompts } from "../lib/seed/load-seed-prompts";

const categories = [
  { slug: "office", name: "办公效率", description: "会议、汇报、总结、邮件和日常办公提示词。", sortOrder: 10 },
  { slug: "learning", name: "学习成长", description: "学习规划、复盘和知识理解提示词。", sortOrder: 20 },
  { slug: "coding-agent", name: "编程和 Agent 工作流", description: "编程、调试和 Agent 协作提示词。", sortOrder: 30 },
  { slug: "writing", name: "写作创作", description: "写作、改写和内容构思提示词。", sortOrder: 40 },
  { slug: "marketing", name: "营销和电商", description: "营销策划、商品表达和转化文案提示词。", sortOrder: 50 },
  { slug: "image-video", name: "图像和视频", description: "图像、视频和视觉创作提示词。", sortOrder: 60 },
];

async function main() {
  const password = process.env.ADMIN_INITIAL_PASSWORD ?? "prompt-hub-admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }

  const prompts = await loadSeedPrompts("content/seed-prompts/public-library.json");

  for (const prompt of prompts) {
    const categoryId = categoryMap.get(prompt.category);
    if (!categoryId) {
      throw new Error(`Unknown category: ${prompt.category}`);
    }

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
        status: prompt.status,
        categoryId,
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
        status: prompt.status,
        categoryId,
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
