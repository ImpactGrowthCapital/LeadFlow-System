import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main navigation">
        <Logo />
        <div className="nav-links">
          <Link href="/#features">Features</Link>
          <Link href="/#integrations">Integrations</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#demo">Demo</Link>
        </div>
        <div className="nav-actions">
          <Link className="button secondary small" href="/login">
            Sign in
          </Link>
          <Link className="button primary small mobile-hide" href="/signup">
            Start free trial
          </Link>
        </div>
      </nav>
    </header>
  );
}
