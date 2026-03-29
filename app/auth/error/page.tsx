import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Authentication Error</h1>
        <p>Something went wrong during authentication.</p>
        <Link href="/auth/signin" className="btn btn-primary">
          Try Again
        </Link>
      </div>
    </div>
  );
}
