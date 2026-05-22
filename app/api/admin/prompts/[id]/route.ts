import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifySession } from "@/lib/auth/session";

export const runtime = "nodejs";

// Helper to authenticate requests in admin endpoints
function checkAuth(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_session="))
    ?.split("=")[1];

  return verifySession(sessionCookie);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = checkAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status, isFeatured } = body;

    const data: { status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"; isFeatured?: boolean } = {};
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    const updated = await prisma.prompt.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, prompt: updated });
  } catch (error: unknown) {
    console.error("PATCH admin prompt error:", error);
    const message = error instanceof Error ? error.message : "Failed to update prompt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = checkAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
    const existing = await prisma.prompt.findFirst({
      where: {
        slug,
        NOT: { id },
      },
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

    // Delete existing PromptTag relationships first
    await prisma.promptTag.deleteMany({
      where: { promptId: id },
    });

    // Update prompt
    const updated = await prisma.prompt.update({
      where: { id },
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

    // Create new PromptTag relationships
    if (resolvedTags.length > 0) {
      await Promise.all(
        resolvedTags.map((tag) =>
          prisma.promptTag.create({
            data: {
              promptId: id,
              tagId: tag.id,
            },
          })
        )
      );
    }

    return NextResponse.json({ success: true, prompt: updated });
  } catch (error: unknown) {
    console.error("PUT admin prompt error:", error);
    const message = error instanceof Error ? error.message : "Failed to update prompt";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = checkAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete prompt (cascades automatically to PromptTag because of onDelete: Cascade in schema!)
    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Prompt deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE admin prompt error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete prompt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
