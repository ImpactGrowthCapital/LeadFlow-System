"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Something went wrong</h1>
        <p className="auth-description">The request could not be completed. Please retry.</p>
        <button className="button primary full" onClick={() => reset()}>Try again</button>
      </section>
    </main>
  );
}
