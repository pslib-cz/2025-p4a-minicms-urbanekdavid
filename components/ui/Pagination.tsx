"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function getUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  pages.push(1);

  if (currentPage > 3) pages.push("...");

  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={getUrl(currentPage - 1)} className="pagination-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Prev
        </Link>
      )}

      <div className="pagination-pages">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="pagination-dots">...</span>
          ) : (
            <Link
              key={page}
              href={getUrl(page)}
              className={cn("pagination-page", page === currentPage && "pagination-page-active")}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages && (
        <Link href={getUrl(currentPage + 1)} className="pagination-btn">
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
