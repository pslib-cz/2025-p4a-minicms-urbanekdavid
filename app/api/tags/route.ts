import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { tagSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { videos: true } } },
  });
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.tag.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
  }

  const tag = await prisma.tag.create({
    data: { name: parsed.data.name, slug },
  });

  return NextResponse.json(tag, { status: 201 });
}
