import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { VideoGrid } from "@/components/video/VideoGrid";
import { FilterPanel } from "@/components/public/FilterPanel";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search and browse videos on ThreadClip",
};

const LIMIT = 12;

type PageProps = { searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = sp.q || "";
  const categorySlug = sp.category || "";
  const tagSlug = sp.tag || "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Record<string, unknown> = { status: "PUBLISHED" as const };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { excerpt: { contains: query, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (tagSlug) {
    where.tags = { some: { tag: { slug: tagSlug } } };
  }

  const [videos, total, categories, tags] = await Promise.all([
    prisma.videoPost.findMany({
      where,
      orderBy: { publishDate: "desc" },
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
      },
    }),
    prisma.videoPost.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="container search-page">
      <div className="search-page-header">
        <h1>{query ? `Results for "${query}"` : "Browse Videos"}</h1>
        <p className="search-page-count">{total} video{total !== 1 ? "s" : ""} found</p>
      </div>
      <div className="search-page-layout">
        <aside className="search-page-sidebar">
          <Suspense>
            <FilterPanel categories={categories} tags={tags} />
          </Suspense>
        </aside>
        <div className="search-page-content">
          <VideoGrid videos={videos} />
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
