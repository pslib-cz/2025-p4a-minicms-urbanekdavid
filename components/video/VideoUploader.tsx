"use client";

import { useRef, useState } from "react";
import { useTusUpload } from "@/hooks/useTusUpload";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface VideoUploaderProps {
  onComplete: (url: string) => void;
}

export function VideoUploader({ onComplete }: VideoUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { status, progress, speed, eta, error, startUpload, pause, resume, cancel } = useTusUpload({
    endpoint: "/api/upload",
    onComplete,
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowed.includes(file.type)) {
      return;
    }

    setFileName(file.name);
    startUpload(file);
  }

  function formatEta(seconds: number): string {
    if (seconds <= 0) return "--";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
  }

  return (
    <div className="video-uploader">
      {status === "idle" && (
        <div
          className="video-uploader-dropzone"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
            <path d="M24 32V16m0 0l-8 8m8-8l8 8" />
            <path d="M8 32v4a4 4 0 004 4h24a4 4 0 004-4v-4" />
          </svg>
          <p>Click to select a video file</p>
          <span className="video-uploader-hint">MP4, WebM, or QuickTime (max 2GB)</span>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            hidden
          />
        </div>
      )}

      {(status === "uploading" || status === "paused") && (
        <div className="video-uploader-progress">
          <div className="video-uploader-file">{fileName}</div>
          <div className="video-uploader-bar">
            <div className="video-uploader-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="video-uploader-stats">
            <span className="video-uploader-percent">{progress}%</span>
            <span>{formatBytes(speed)}/s</span>
            <span>ETA: {formatEta(eta)}</span>
          </div>
          <div className="video-uploader-actions">
            {status === "uploading" ? (
              <Button variant="secondary" size="sm" onClick={pause}>Pause</Button>
            ) : (
              <Button variant="primary" size="sm" onClick={resume}>Resume</Button>
            )}
            <Button variant="danger" size="sm" onClick={cancel}>Cancel</Button>
          </div>
        </div>
      )}

      {status === "complete" && (
        <div className="video-uploader-complete">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--color-success)" strokeWidth="2">
            <circle cx="16" cy="16" r="14" />
            <polyline points="10,16 14,20 22,12" />
          </svg>
          <span>Upload complete</span>
        </div>
      )}

      {status === "error" && (
        <div className="video-uploader-error">
          <p>{error}</p>
          <Button variant="secondary" size="sm" onClick={cancel}>Try Again</Button>
        </div>
      )}
    </div>
  );
}
