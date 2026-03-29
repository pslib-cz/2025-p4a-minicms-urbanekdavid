import Link from "next/link";
import Image from "next/image";
import { formatDate, formatDuration, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface VideoCardProps {
  video: {
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
  };
  index?: number;
  featured?: boolean;
}

export function VideoCard({ video, index = 0, featured = false }: VideoCardProps) {
  return (
    <Link
      href={`/video/${video.slug}`}
      className={`video-card reveal reveal-delay-${Math.min(index % 4, 3) + 1}${featured ? " video-card-featured" : ""}`}
    >
      <div className="video-card-thumbnail">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="video-card-placeholder">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="8" width="40" height="32" rx="4" />
              <polygon points="20,16 34,24 20,32" fill="currentColor" />
            </svg>
          </div>
        )}
        <div className="video-card-overlay">
          <svg className="video-card-play" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2" />
            <polygon points="20,16 34,24 20,32" fill="currentColor" />
          </svg>
        </div>
        {video.category && (
          <Badge variant="accent" className="video-card-category">{video.category.name}</Badge>
        )}
        {video.duration && (
          <span className="video-card-duration">{formatDuration(video.duration)}</span>
        )}
      </div>
      <div className="video-card-body">
        <h3 className="video-card-title">{truncate(video.title, 80)}</h3>
        <p className="video-card-excerpt">{truncate(video.excerpt, 120)}</p>
        <div className="video-card-meta">
          <div className="video-card-author">
            {video.author.image && (
              <Image
                src={video.author.image}
                alt={video.author.name || ""}
                width={28}
                height={28}
                className="video-card-avatar"
              />
            )}
            <span>{video.author.name}</span>
          </div>
          <span className="video-card-date">
            {formatDate(video.publishDate || video.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
