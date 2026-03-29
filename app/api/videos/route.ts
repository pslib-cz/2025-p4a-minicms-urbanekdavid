import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { videoCreateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 12));
  const search = sp.get("search") || "";
  const categoryId = sp.get("categoryId") || "";
  const tagSlug = sp.get("tagSlug") || "";
  const status = sp.get("status") || "PUBLISHED";

  const where: Record<string, unknown> = {};

  if (status === "PUBLISHED") {
    where.status = "PUBLISHED";
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (tagSlug) {
    where.tags = { some: { tag: { slug: tagSlug } } };
  }

  const [data, total] = await Promise.all([
    prisma.videoPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true, id: true } },
        tags: { include: { tag: { select: { name: true, slug: true, id: true } } } },
      },
    }),
    prisma.videoPost.count({ where }),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = videoCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { tagIds, ...data } = parsed.data;

  let slug = slugify(data.title);
  const existing = await prisma.videoPost.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const video = await prisma.videoPost.create({
    data: {
      ...data,
      slug,
      publishDate: data.publishDate ? new Date(data.publishDate) : data.status === "PUBLISHED" ? new Date() : null,
      authorId: session.user.id,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(video, { status: 201 });
}
