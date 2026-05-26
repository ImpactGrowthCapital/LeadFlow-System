import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  ["/dashboard", "Overview"],
  ["/dashboard/leads", "Leads"],
  ["/dashboard/cadences", "Cadences"],
  ["/dashboard/settings", "Settings"]
];

export function DashboardShell({
  name,
  email,
  children
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="workspace">
      <aside className="sidebar">
        <Logo href="/dashboard" />
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {links.map(([href, title]) => (
            <Link key={href} href={href}>{title}</Link>
          ))}
        </nav>
        <div className="user-card">
          <span className="avatar">{initials || "LF"}</span>
          <div>
            <strong>{name}</strong>
            <small>{email}</small>
          </div>
        </div>
        <form action="/auth/signout" method="post">
          <button className="sidebar-logout" type="submit">Sign out</button>
        </form>
      </aside>
      <header className="mobile-dashboard-header">
        <Logo href="/dashboard" />
        <nav>
          {links.map(([href, title]) => <Link key={href} href={href}>{title}</Link>)}
        </nav>
      </header>
      <section className="workspace-content">{children}</section>
    </div>
  );
}
