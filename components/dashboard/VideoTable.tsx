"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate, truncate } from "@/lib/utils";
import { VideoStatusBadge } from "@/components/video/VideoStatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Video {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  publishDate: string | null;
  category: { name: string } | null;
}

interface VideoTableProps {
  videos: Video[];
}

export function VideoTable({ videos }: VideoTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);

    const res = await fetch(`/api/videos/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      addToast("Video deleted", "success");
      router.refresh();
    } else {
      addToast("Failed to delete video", "error");
    }

    setDeleting(false);
    setDeleteId(null);
  }

  if (videos.length === 0) {
    return (
      <div className="video-table-empty">
        <p>No videos yet.</p>
        <Link href="/dashboard/new" className="btn btn-primary">Create Your First Video</Link>
      </div>
    );
  }

  return (
    <>
      <div className="video-table-wrapper">
        <table className="video-table">
          <thead>
            <tr>
              <th>Video</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td>
                  <div className="video-table-title">
                    {video.thumbnailUrl && (
                      <Image
                        src={video.thumbnailUrl}
                        alt=""
                        width={80}
                        height={45}
                        className="video-table-thumb"
                      />
                    )}
                    <span>{truncate(video.title, 50)}</span>
                  </div>
                </td>
                <td>{video.category?.name || "-"}</td>
                <td><VideoStatusBadge status={video.status} /></td>
                <td>{formatDate(video.publishDate || video.createdAt)}</td>
                <td>
                  <div className="video-table-actions">
                    <Link href={`/dashboard/edit/${video.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <Link href={`/video/${video.slug}`} className="btn btn-ghost btn-sm" target="_blank">View</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(video.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Video">
        <p>Are you sure you want to delete this video? This action cannot be undone.</p>
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete} className="shake-target">
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
