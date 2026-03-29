import { prisma } from "@/lib/prisma";
import { VideoGrid } from "@/components/video/VideoGrid";
import { HeroSection } from "@/components/public/HeroSection";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const videos = await prisma.videoPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishDate: "desc" },
    take: 13,
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });

  const heroVideo = videos[0] || null;
  const gridVideos = videos.slice(1);

  return (
    <>
      <HeroSection video={heroVideo} />
      <section className="container" style={{ paddingTop: "var(--spacing-3xl)", paddingBottom: "var(--spacing-3xl)" }}>
        <div className="section-header">
          <h2>Latest Videos</h2>
          <Link href="/search" className="section-link">
            Browse All
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
        <VideoGrid videos={gridVideos} showFeatured />
      </section>
    </>
  );
}
