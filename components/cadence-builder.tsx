"use client";

import { useActionState } from "react";
import { createCadence, type CadenceState } from "@/app/dashboard/cadences/actions";

const initialState: CadenceState = { status: "idle" };

export function CadenceBuilder() {
  const [state, action, pending] = useActionState(createCadence, initialState);

  return (
    <section className="panel cadence-builder">
      <div className="panel-head">
        <div>
          <h2>Create cadence draft</h2>
          <p>Generate a structured follow-up sequence and store it securely in your library.</p>
        </div>
      </div>
      <form action={action} className="cadence-form">
        <label className="field">Campaign name<input className="lead-input" required name="label" placeholder="Webinar attendee nurture" /></label>
        <label className="field">Industry<input className="lead-input" required name="industry" placeholder="Nonprofit" /></label>
        <label className="field">Audience<input className="lead-input" required name="audience" placeholder="Development directors" /></label>
        <label className="field">Objective<input className="lead-input" required name="objective" placeholder="Book a discovery call" /></label>
        <label className="field wide">Offer or resource<input className="lead-input" name="offer" placeholder="Webinar replay and conversion checklist" /></label>
        {state.message ? <p className={`form-message ${state.status}`}>{state.message}</p> : null}
        <button className="button primary small" disabled={pending}>
          {pending ? "Creating..." : "Create draft cadence"}
        </button>
      </form>
    </section>
  );
}
