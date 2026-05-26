import Link from "next/link";
import { Logo } from "@/components/logo";

export function AuthShell({
  title,
  description,
  children,
  footer
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <div className="auth-brand">
        <Logo />
      </div>
      <section className="auth-card">
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
      <Link href="/" className="text-link">Back to LeadFlow</Link>
    </main>
  );
}
