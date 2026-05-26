import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="LeadFlow home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="m4 10 4 4 8-9" />
        </svg>
      </span>
      <span>LeadFlow</span>
    </Link>
  );
}
