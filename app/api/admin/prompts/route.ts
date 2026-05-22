import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifySession } from "@/lib/auth/session";

export const runtime = "nodejs";

function checkAuth(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_session="))
    ?.split("=")[1];

  return verifySession(sessionCookie);
}

export async function POST(request: Request) {
  try {
    const session = checkAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      summary,
      content,
      exampleInput,
      exampleOutput,
      structureRole,
      structureTask,
      structureContext,
      structureConstraints,
      structureOutputFormat,
      weakPrompt,
      improvedPrompt,
      improvementNotes,
      language,
      status,
      isFeatured,
      categoryId,
      tagsString,
    } = body;

    // Validate required fields
    if (!title || !slug || !categoryId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.prompt.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    // Resolve Tags
    const tagNames = (tagsString || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const resolvedTags = await Promise.all(
      tagNames.map(async (name: string) => {
        // Generate a clean slug for the tag
        const tagSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9-_\u4e00-\u9fa5]/g, "-")
          .replace(/-+/g, "-");
        
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name },
          create: { slug: tagSlug, name },
        });
      })
    );

    // Create prompt within a transaction to ensure integrity
    const createdPrompt = await prisma.prompt.create({
      data: {
        title,
        slug,
        summary: summary || "",
        content,
        exampleInput: exampleInput || "",
        exampleOutput: exampleOutput || "",
        structureRole: structureRole || "",
        structureTask: structureTask || "",
        structureContext: structureContext || "",
        structureConstraints: structureConstraints || "",
        structureOutputFormat: structureOutputFormat || "",
        weakPrompt: weakPrompt || "",
        improvedPrompt: improvedPrompt || "",
        improvementNotes: improvementNotes || "",
        language: language || "zh-CN",
        status: status || "DRAFT",
        isFeatured: !!isFeatured,
        categoryId,
      },
    });

    // Create prompt tag associations
    if (resolvedTags.length > 0) {
      await Promise.all(
        resolvedTags.map((tag) =>
          prisma.promptTag.create({
            data: {
              promptId: createdPrompt.id,
              tagId: tag.id,
            },
          })
        )
      );
    }

    return NextResponse.json({ success: true, prompt: createdPrompt });
  } catch (error: unknown) {
    console.error("POST admin prompt error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create prompt" },
      { status: 500 }
    );
  }
}
