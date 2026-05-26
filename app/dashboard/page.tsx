import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Cadence, Lead, Stage } from "@/lib/types";

const orderedStages: Stage[] = ["Registered", "Attended Live", "Engaged", "Qualified", "Booked Call", "Converted"];

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data: leadData }, { data: cadenceData }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("cadences").select("*").order("created_at", { ascending: false }).limit(3)
  ]);

  const leads = (leadData ?? []) as Lead[];
  const cadences = (cadenceData ?? []) as Cadence[];
  const hot = leads.filter((lead) => lead.score >= 60).length;
  const converted = leads.filter((lead) => lead.stage === "Converted").length;
  const conversion = leads.length ? ((converted / leads.length) * 100).toFixed(1) : "0.0";

  return (
    <>
      <div className="page-head">
        <div>
          <p className="overline">Workspace overview</p>
          <h1>Revenue dashboard</h1>
          <p>Track your authenticated pipeline and email cadence activity.</p>
        </div>
        <Link className="button primary small" href="/dashboard/leads">Add lead</Link>
      </div>

      <div className="stat-grid">
        <Metric label="Total leads" value={String(leads.length)} detail="Stored in Supabase" />
        <Metric label="Hot leads" value={String(hot)} detail="Score of 60 or higher" accent />
        <Metric label="Converted" value={String(converted)} detail="Closed opportunities" />
        <Metric label="Conversion rate" value={`${conversion}%`} detail="Across your leads" accent />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head"><h2>Pipeline distribution</h2><Link href="/dashboard/leads">Manage leads</Link></div>
          <div className="funnel">
            {orderedStages.map((stage) => {
              const count = leads.filter((lead) => lead.stage === stage).length;
              const width = leads.length ? Math.max(4, (count / leads.length) * 100) : 4;
              return (
                <div className="funnel-row" key={stage}>
                  <span>{stage}</span>
                  <div><b style={{ width: `${width}%` }} /></div>
                  <strong>{count}</strong>
                </div>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Recent cadences</h2><Link href="/dashboard/cadences">Create cadence</Link></div>
          {cadences.length ? (
            <div className="recent-list">
              {cadences.map((cadence) => (
                <article key={cadence.id}>
                  <strong>{cadence.label}</strong>
                  <span>{cadence.industry} / {cadence.emails.length} emails</span>
                  <small className={`status ${cadence.status}`}>{cadence.status}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState text="Create your first follow-up cadence to see it here." />
          )}
        </section>
      </div>
    </>
  );
}

function Metric({ label, value, detail, accent }: { label: string; value: string; detail: string; accent?: boolean }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong className={accent ? "accent" : ""}>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}
