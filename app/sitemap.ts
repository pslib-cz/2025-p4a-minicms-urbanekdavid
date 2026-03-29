import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const videos = await prisma.videoPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const tags = await prisma.tag.findMany({
    select: { slug: true },
  });

  const videoEntries = videos.map((v) => ({
    url: `${baseUrl}/video/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tagEntries = tags.map((t) => ({
    url: `${baseUrl}/tag/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.7 },
    ...videoEntries,
    ...categoryEntries,
    ...tagEntries,
  ];
}
