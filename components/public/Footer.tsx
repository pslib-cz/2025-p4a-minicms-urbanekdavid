import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="4" width="28" height="24" rx="4" stroke="var(--color-accent)" strokeWidth="2" />
              <polygon points="13,10 23,16 13,22" fill="var(--color-accent)" />
            </svg>
            <span>ThreadClip</span>
          </Link>
          <p>Video publishing platform for creators.</p>
        </div>
        <div className="site-footer-links">
          <div className="site-footer-col">
            <h4>Browse</h4>
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
            <Link href="/category/technology">Technology</Link>
            <Link href="/category/music">Music</Link>
          </div>
          <div className="site-footer-col">
            <h4>Categories</h4>
            <Link href="/category/sports">Sports</Link>
            <Link href="/category/art">Art</Link>
            <Link href="/category/education">Education</Link>
          </div>
          <div className="site-footer-col">
            <h4>Account</h4>
            <Link href="/auth/signin">Sign In</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="site-footer-bottom">
        <div className="container">
          <span>ThreadClip {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
