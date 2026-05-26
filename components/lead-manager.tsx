"use client";

import { useActionState, useMemo, useState } from "react";
import { createLead, deleteLead, updateLead, type LeadFormState } from "@/app/dashboard/leads/actions";
import { stages, type Lead } from "@/lib/types";

const initialState: LeadFormState = { status: "idle" };

export function LeadManager({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const filtered = useMemo(
    () => leads.filter((lead) => {
      const term = query.toLowerCase();
      return (!term || `${lead.name} ${lead.email} ${lead.organization}`.toLowerCase().includes(term)) &&
        (!stage || lead.stage === stage);
    }),
    [leads, query, stage]
  );

  return (
    <>
      <NewLeadForm />
      <section className="panel lead-panel">
        <div className="filters">
          <input className="lead-input" placeholder="Search leads..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="lead-input" value={stage} onChange={(event) => setStage(event.target.value)}>
            <option value="">All stages</option>
            {stages.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="table-scroll">
          <table className="lead-table">
            <thead>
              <tr><th>Lead</th><th>Organization</th><th>Stage</th><th>Score</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
            </tbody>
          </table>
        </div>
        {!filtered.length ? <p className="empty-state">No leads match this filter.</p> : null}
      </section>
    </>
  );
}

function NewLeadForm() {
  const [state, action, pending] = useActionState(createLead, initialState);

  return (
    <details className="panel creator" open>
      <summary>Add a lead</summary>
      <form action={action} className="lead-form">
        <LeadFields />
        {state.message ? <p className={`form-message ${state.status}`}>{state.message}</p> : null}
        <button className="button primary small" disabled={pending}>{pending ? "Saving..." : "Save lead"}</button>
      </form>
    </details>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const [state, action, pending] = useActionState(updateLead.bind(null, lead.id), initialState);

  return (
    <>
      <tr>
        <td><strong>{lead.name}</strong><small>{lead.email}</small></td>
        <td>{lead.organization || "-"}</td>
        <td><span className="stage-pill">{lead.stage}</span></td>
        <td><strong className={lead.score >= 60 ? "hot-score" : ""}>{lead.score}</strong></td>
        <td className="row-actions">
          <details>
            <summary>Edit</summary>
            <form action={action} className="inline-edit">
              <LeadFields lead={lead} />
              {state.message ? <p className={`form-message ${state.status}`}>{state.message}</p> : null}
              <button className="button primary small" disabled={pending}>Save changes</button>
            </form>
          </details>
          <form action={deleteLead}>
            <input type="hidden" name="id" value={lead.id} />
            <button className="danger-action" type="submit">Delete</button>
          </form>
        </td>
      </tr>
    </>
  );
}

function LeadFields({ lead }: { lead?: Lead }) {
  return (
    <div className="lead-fields">
      <label className="field">Name<input className="lead-input" required name="name" defaultValue={lead?.name} /></label>
      <label className="field">Email<input className="lead-input" required type="email" name="email" defaultValue={lead?.email} /></label>
      <label className="field">Organization<input className="lead-input" name="organization" defaultValue={lead?.organization} /></label>
      <label className="field">Source<input className="lead-input" name="source" defaultValue={lead?.source ?? "Manual"} /></label>
      <label className="field">Stage
        <select className="lead-input" name="stage" defaultValue={lead?.stage ?? "Registered"}>
          {stages.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label className="field">Score<input className="lead-input" name="score" type="number" min="0" max="100" defaultValue={lead?.score ?? 0} /></label>
      <label className="field wide">Notes<textarea className="lead-input" name="notes" rows={2} defaultValue={lead?.notes ?? ""} /></label>
    </div>
  );
}
