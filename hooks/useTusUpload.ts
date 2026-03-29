"use client";

import { useState, useRef, useCallback } from "react";
import * as tus from "tus-js-client";

export interface TusUploadState {
  status: "idle" | "uploading" | "paused" | "complete" | "error";
  progress: number;
  speed: number;
  eta: number;
  videoUrl: string | null;
  error: string | null;
}

interface UseTusUploadOptions {
  endpoint: string;
  onComplete?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useTusUpload({ endpoint, onComplete, onError }: UseTusUploadOptions) {
  const [state, setState] = useState<TusUploadState>({
    status: "idle",
    progress: 0,
    speed: 0,
    eta: 0,
    videoUrl: null,
    error: null,
  });

  const uploadRef = useRef<tus.Upload | null>(null);
  const lastLoadedRef = useRef(0);
  const lastTimeRef = useRef(0);

  const startUpload = useCallback((file: File) => {
    lastLoadedRef.current = 0;
    lastTimeRef.current = Date.now();

    const upload = new tus.Upload(file, {
      endpoint,
      retryDelays: [0, 1000, 3000, 5000],
      chunkSize: 5 * 1024 * 1024,
      metadata: {
        filename: file.name,
        filetype: file.type,
        filesize: String(file.size),
      },
      onError(err) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: err.message || "Upload failed",
        }));
        onError?.(err.message || "Upload failed");
      },
      onProgress(bytesUploaded, bytesTotal) {
        const now = Date.now();
        const elapsed = (now - lastTimeRef.current) / 1000;
        const bytesNew = bytesUploaded - lastLoadedRef.current;

        const speed = elapsed > 0 ? bytesNew / elapsed : 0;
        const remaining = bytesTotal - bytesUploaded;
        const eta = speed > 0 ? remaining / speed : 0;

        lastLoadedRef.current = bytesUploaded;
        lastTimeRef.current = now;

        setState((prev) => ({
          ...prev,
          status: "uploading",
          progress: Math.round((bytesUploaded / bytesTotal) * 100),
          speed,
          eta,
        }));
      },
      onSuccess() {
        const url = upload.url || "";
        setState({
          status: "complete",
          progress: 100,
          speed: 0,
          eta: 0,
          videoUrl: url,
          error: null,
        });
        onComplete?.(url);
      },
    });

    uploadRef.current = upload;
    setState((prev) => ({ ...prev, status: "uploading", progress: 0, error: null }));
    upload.start();
  }, [endpoint, onComplete, onError]);

  const pause = useCallback(() => {
    uploadRef.current?.abort();
    setState((prev) => ({ ...prev, status: "paused" }));
  }, []);

  const resume = useCallback(() => {
    uploadRef.current?.start();
    setState((prev) => ({ ...prev, status: "uploading" }));
  }, []);

  const cancel = useCallback(() => {
    uploadRef.current?.abort();
    uploadRef.current = null;
    setState({
      status: "idle",
      progress: 0,
      speed: 0,
      eta: 0,
      videoUrl: null,
      error: null,
    });
  }, []);

  return { ...state, startUpload, pause, resume, cancel };
}
