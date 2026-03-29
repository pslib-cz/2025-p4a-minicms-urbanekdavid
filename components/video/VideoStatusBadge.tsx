import { Badge } from "@/components/ui/Badge";

interface VideoStatusBadgeProps {
  status: "DRAFT" | "PUBLISHED";
}

export function VideoStatusBadge({ status }: VideoStatusBadgeProps) {
  if (status === "DRAFT") {
    return (
      <Badge variant="warning" className="status-badge status-badge-draft">
        <span className="status-dot status-dot-pulse" />
        Draft
      </Badge>
    );
  }

  return (
    <Badge variant="success" className="status-badge">
      <span className="status-dot status-dot-success" />
      Published
    </Badge>
  );
}
