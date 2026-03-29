"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Videos", icon: "M4 8h40M4 24h40M4 40h40" },
  { href: "/dashboard/new", label: "New Video", icon: "M24 8v32M8 24h32" },
  { href: "/dashboard/categories", label: "Categories", icon: "M4 4h16v16H4zM28 4h16v16H28zM4 28h16v16H4zM28 28h16v16H28z" },
  { href: "/dashboard/tags", label: "Tags", icon: "M4 12l16-8 16 8v24l-16 8-16-8z" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-header">
        <Link href="/" className="site-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="4" width="28" height="24" rx="4" stroke="var(--color-accent)" strokeWidth="2" />
            <polygon points="13,10 23,16 13,22" fill="var(--color-accent)" />
          </svg>
          <span>ThreadClip</span>
        </Link>
      </div>

      <nav className="dashboard-sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "dashboard-sidebar-link",
              pathname === link.href && "dashboard-sidebar-link-active"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d={link.icon} />
            </svg>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="dashboard-sidebar-footer">
        {session?.user && (
          <div className="dashboard-sidebar-user">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || ""}
                width={32}
                height={32}
                className="dashboard-sidebar-avatar"
              />
            )}
            <span>{session.user.name}</span>
          </div>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
