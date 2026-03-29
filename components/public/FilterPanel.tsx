"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  categories: { slug: string; name: string; _count?: { videoPosts: number } }[];
  tags: { slug: string; name: string; _count?: { videos: number } }[];
}

export function FilterPanel({ categories, tags }: FilterPanelProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeTag = searchParams.get("tag");

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h4 className="filter-title">Categories</h4>
        <div className="filter-list">
          <Link
            href="/search"
            className={cn("filter-chip", !activeCategory && "filter-chip-active")}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className={cn("filter-chip", activeCategory === cat.slug && "filter-chip-active")}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h4 className="filter-title">Tags</h4>
        <div className="filter-list">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/search?tag=${tag.slug}`}
              className={cn("filter-tag", activeTag === tag.slug && "filter-tag-active")}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
