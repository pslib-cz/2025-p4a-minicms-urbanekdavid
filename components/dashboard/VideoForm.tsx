"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { VideoUploader } from "@/components/video/VideoUploader";
import { useToast } from "@/hooks/useToast";
import { TiptapEditor } from "./TiptapEditor";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface VideoFormProps {
  video?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    duration: number | null;
    status: "DRAFT" | "PUBLISHED";
    categoryId: string | null;
    tags: { tag: { id: string; name: string } }[];
  };
  categories: Category[];
  tags: Tag[];
}

export function VideoForm({ video, categories, tags }: VideoFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const isEdit = !!video;

  const [title, setTitle] = useState(video?.title || "");
  const [excerpt, setExcerpt] = useState(video?.excerpt || "");
  const [content, setContent] = useState(video?.content || "");
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnailUrl || "");
  const [duration, setDuration] = useState(video?.duration?.toString() || "");
  const [status, setStatus] = useState(video?.status || "DRAFT");
  const [categoryId, setCategoryId] = useState(video?.categoryId || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    video?.tags.map((t) => t.tag.id) || []
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const body = {
      title,
      excerpt,
      content,
      videoUrl: videoUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      duration: duration ? Number(duration) : null,
      status,
      categoryId: categoryId || null,
      tagIds: selectedTags,
    };

    const url = isEdit ? `/api/videos/${video.id}` : "/api/videos";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      addToast(isEdit ? "Video updated" : "Video created", "success");
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      if (data.error?.fieldErrors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(data.error.fieldErrors).forEach(([key, val]) => {
          fieldErrors[key] = Array.isArray(val) ? val[0] : String(val);
        });
        setErrors(fieldErrors);
      } else {
        addToast(data.error || "Failed to save", "error");
      }
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="video-form">
      <div className="video-form-grid">
        <div className="video-form-main">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />
          <Textarea
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            error={errors.excerpt}
            rows={3}
            required
          />
          <div className="form-field">
            <label className="form-label">Content</label>
            <TiptapEditor content={content} onChange={setContent} />
            {errors.content && <span className="form-error">{errors.content}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Video</label>
            {videoUrl ? (
              <div className="video-form-uploaded">
                <span className="form-hint">{videoUrl}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setVideoUrl("")}>
                  Remove
                </button>
              </div>
            ) : (
              <VideoUploader onComplete={(url) => setVideoUrl(url)} />
            )}
          </div>
        </div>

        <div className="video-form-sidebar">
          <div className="video-form-card">
            <h4>Publish</h4>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" },
              ]}
            />
            <Button type="submit" loading={saving}>
              {isEdit ? "Update" : "Create"} Video
            </Button>
          </div>

          <div className="video-form-card">
            <h4>Details</h4>
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={[
                { value: "", label: "No category" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <Input
              label="Thumbnail URL"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
            />
            <Input
              label="Duration (seconds)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="video-form-card">
            <h4>Tags</h4>
            <div className="video-form-tags">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className={`filter-tag${selectedTags.includes(tag.id) ? " filter-tag-active" : ""}`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
