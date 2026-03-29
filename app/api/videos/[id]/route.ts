import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { videoUpdateSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const video = await prisma.videoPost.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true, id: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(video);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const post = await prisma.videoPost.findUnique({ where: { id } });
  if (!post || post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = videoUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { tagIds, ...data } = parsed.data;

  if (tagIds !== undefined) {
    await prisma.tagsOnVideos.deleteMany({ where: { videoId: id } });
    if (tagIds.length > 0) {
      await prisma.tagsOnVideos.createMany({
        data: tagIds.map((tagId: string) => ({ videoId: id, tagId })),
      });
    }
  }

  const video = await prisma.videoPost.update({
    where: { id },
    data: {
      ...data,
      publishDate: data.publishDate ? new Date(data.publishDate) : data.status === "PUBLISHED" && !post.publishDate ? new Date() : undefined,
    },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(video);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const post = await prisma.videoPost.findUnique({ where: { id } });
  if (!post || post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.videoPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
