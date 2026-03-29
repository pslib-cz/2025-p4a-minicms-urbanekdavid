"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";

export function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " site-header-scrolled" : ""}`}>
      <div className="container site-header-inner">
        <Link href="/" className="site-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="4" width="28" height="24" rx="4" stroke="var(--color-accent)" strokeWidth="2" />
            <polygon points="13,10 23,16 13,22" fill="var(--color-accent)" />
          </svg>
          <span>ThreadClip</span>
        </Link>

        <nav className={`site-nav${menuOpen ? " site-nav-open" : ""}`}>
          <Suspense><SearchBar /></Suspense>
          <div className="site-nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/search" className="nav-link">Browse</Link>
            {session?.user ? (
              <Link href="/dashboard" className="nav-link nav-link-accent">Dashboard</Link>
            ) : (
              <Link href="/auth/signin" className="nav-link nav-link-accent">Sign In</Link>
            )}
          </div>
        </nav>

        <button
          className="site-header-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger${menuOpen ? " hamburger-open" : ""}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
}
