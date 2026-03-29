import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  video: {
    slug: string;
    title: string;
    excerpt: string;
    thumbnailUrl: string | null;
    author: { name: string | null };
    category: { name: string } | null;
  } | null;
}

export function HeroSection({ video }: HeroSectionProps) {
  if (!video) return null;

  return (
    <section className="hero">
      <div className="hero-bg">
        {video.thumbnailUrl && (
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div className="hero-overlay" />
      </div>
      <div className="container hero-content">
        <div className="hero-text">
          {video.category && (
            <span className="hero-category">{video.category.name}</span>
          )}
          <h1 className="hero-title">{video.title}</h1>
          <p className="hero-excerpt">{video.excerpt}</p>
          <div className="hero-actions">
            <Link href={`/video/${video.slug}`} className="btn btn-primary btn-lg">
              Watch Now
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <polygon points="6,3 17,10 6,17" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
