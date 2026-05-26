import { deleteCadence, updateCadenceStatus } from "@/app/dashboard/cadences/actions";
import { CadenceBuilder } from "@/components/cadence-builder";
import { createClient } from "@/lib/supabase/server";
import type { Cadence } from "@/lib/types";

export const metadata = { title: "Cadences" };

export default async function CadencesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("cadences").select("*").order("created_at", { ascending: false });
  const cadences = (data ?? []) as Cadence[];

  return (
    <>
      <div className="page-head">
        <div>
          <p className="overline">Automation</p>
          <h1>Email cadences</h1>
          <p>Draft and manage the follow-up sequences connected to your pipeline.</p>
        </div>
      </div>
      <CadenceBuilder />
      <section className="cadence-library">
        <h2>Saved sequences</h2>
        {cadences.length ? cadences.map((cadence) => (
          <article className="cadence-card" key={cadence.id}>
            <div className="cadence-card-head">
              <div>
                <h3>{cadence.label}</h3>
                <p>{cadence.industry} / Goal: {cadence.objective}</p>
              </div>
              <span className={`status ${cadence.status}`}>{cadence.status}</span>
            </div>
            <div className="email-steps">
              {cadence.emails.map((email) => (
                <details key={email.day}>
                  <summary>Day {email.day}: {email.subject}</summary>
                  <p><strong>{email.purpose}</strong></p>
                  <p>{email.body}</p>
                </details>
              ))}
            </div>
            <div className="card-actions">
              <form action={updateCadenceStatus}>
                <input type="hidden" name="id" value={cadence.id} />
                <input type="hidden" name="status" value={cadence.status === "active" ? "paused" : "active"} />
                <button className="button secondary small">{cadence.status === "active" ? "Pause" : "Activate"}</button>
              </form>
              <form action={deleteCadence}>
                <input type="hidden" name="id" value={cadence.id} />
                <button className="danger-action">Delete</button>
              </form>
            </div>
          </article>
        )) : <p className="empty-state panel">No saved cadences yet. Create a draft above.</p>}
      </section>
    </>
  );
}
