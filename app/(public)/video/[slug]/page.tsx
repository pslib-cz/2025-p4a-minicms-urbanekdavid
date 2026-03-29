import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { VideoCard } from "@/components/video/VideoCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await prisma.videoPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true, thumbnailUrl: true, slug: true },
  });

  if (!video) return { title: "Not Found" };

  const url = `${process.env.NEXT_PUBLIC_URL}/video/${video.slug}`;
  return {
    title: video.title,
    description: video.excerpt,
    openGraph: {
      title: video.title,
      description: video.excerpt,
      images: [{ url: video.thumbnailUrl || "/og-default.jpg", width: 1200, height: 630 }],
      type: "video.other",
      url,
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: url },
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { slug } = await params;

  const video = await prisma.videoPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });

  if (!video) notFound();

  const related = await prisma.videoPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: video.id },
      categoryId: video.categoryId,
    },
    take: 4,
    orderBy: { publishDate: "desc" },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });

  return (
    <article className="video-detail">
      <div className="container">
        {video.videoUrl && (
          <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl || undefined} />
        )}

        <div className="video-detail-content">
          <div className="video-detail-main">
            <div className="video-detail-header">
              {video.category && (
                <Link href={`/category/${video.category.slug}`}>
                  <Badge variant="accent">{video.category.name}</Badge>
                </Link>
              )}
              <h1>{video.title}</h1>
              <p className="video-detail-excerpt">{video.excerpt}</p>
            </div>

            <div className="video-detail-meta">
              <div className="video-detail-author">
                {video.author.image && (
                  <Image
                    src={video.author.image}
                    alt={video.author.name || ""}
                    width={40}
                    height={40}
                    className="video-detail-avatar"
                  />
                )}
                <div>
                  <span className="video-detail-author-name">{video.author.name}</span>
                  <span className="video-detail-date">
                    {formatDate(video.publishDate || video.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="video-detail-body" dangerouslySetInnerHTML={{ __html: video.content }} />

            {video.tags.length > 0 && (
              <div className="video-detail-tags">
                {video.tags.map(({ tag }) => (
                  <Link key={tag.slug} href={`/tag/${tag.slug}`} className="filter-tag">
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="video-detail-related">
            <h2>Related Videos</h2>
            <div className="video-grid">
              {related.map((v) => (
                <VideoCard key={v.slug} video={v} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
