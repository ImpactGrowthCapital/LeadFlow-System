import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="auth-page">
      <div className="auth-brand"><Logo /></div>
      <section className="auth-card">
        <h1>Page not found</h1>
        <p className="auth-description">The page you requested is not available.</p>
        <Link className="button primary full" href="/">Return home</Link>
      </section>
    </main>
  );
}
