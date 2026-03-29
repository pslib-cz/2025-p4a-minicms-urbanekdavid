"use client";

import { VideoCard } from "./VideoCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface VideoGridProps {
  videos: Array<{
    slug: string;
    title: string;
    excerpt: string;
    thumbnailUrl: string | null;
    duration: number | null;
    status: string;
    publishDate: Date | string | null;
    createdAt: Date | string;
    author: { name: string | null; image: string | null };
    category: { name: string; slug: string } | null;
    tags: { tag: { name: string; slug: string } }[];
  }>;
  showFeatured?: boolean;
}

export function VideoGrid({ videos, showFeatured = false }: VideoGridProps) {
  const ref = useIntersectionObserver();

  if (videos.length === 0) {
    return (
      <div className="video-grid-empty">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
          <rect x="8" y="12" width="48" height="40" rx="6" />
          <polygon points="28,22 42,32 28,42" fill="var(--color-text-muted)" />
        </svg>
        <p>No videos found</p>
      </div>
    );
  }

  const featured = showFeatured ? videos[0] : null;
  const rest = showFeatured ? videos.slice(1) : videos;

  return (
    <div ref={ref}>
      {featured && (
        <div className="video-grid-featured">
          <VideoCard video={featured} featured index={0} />
        </div>
      )}
      <div className="video-grid">
        {rest.map((video, i) => (
          <VideoCard key={video.slug} video={video} index={i + (featured ? 1 : 0)} />
        ))}
      </div>
    </div>
  );
}
