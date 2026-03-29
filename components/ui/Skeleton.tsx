import { cn } from "@/lib/utils";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width, height, borderRadius, className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      style={{ width, height, borderRadius }}
    />
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton" style={{ width: "100%", aspectRatio: "16/9" }} />
      <div style={{ padding: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
        <div className="skeleton" style={{ width: "80%", height: "20px" }} />
        <div className="skeleton" style={{ width: "60%", height: "16px" }} />
        <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
          <div className="skeleton" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
          <div className="skeleton" style={{ width: "100px", height: "16px" }} />
        </div>
      </div>
    </div>
  );
}
