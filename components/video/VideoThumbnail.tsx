import Image from "next/image";

interface VideoThumbnailProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export function VideoThumbnail({ src, alt, width, height, fill, priority }: VideoThumbnailProps) {
  if (!src) {
    return (
      <div className="video-thumbnail-placeholder">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
          <rect x="4" y="8" width="40" height="32" rx="4" />
          <polygon points="20,16 34,24 20,32" fill="var(--color-text-muted)" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : (width || 640)}
      height={fill ? undefined : (height || 360)}
      fill={fill}
      sizes={fill ? "(max-width: 768px) 100vw, 640px" : undefined}
      style={fill ? { objectFit: "cover" } : undefined}
      priority={priority}
    />
  );
}
