import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoGrid } from "@/components/video/VideoGrid";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

const LIMIT = 12;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Not Found" };
  return {
    title: category.name,
    description: `Browse ${category.name} videos on ThreadClip`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const where = { status: "PUBLISHED" as const, categoryId: category.id };

  const [videos, total] = await Promise.all([
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
  ]);

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-3xl)", paddingBottom: "var(--spacing-3xl)" }}>
      <h1>{category.name}</h1>
      <p className="search-page-count" style={{ marginBottom: "var(--spacing-xl)" }}>{total} video{total !== 1 ? "s" : ""}</p>
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={Math.ceil(total / LIMIT)} />
    </div>
  );
}
