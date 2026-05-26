"use client";

import { useActionState } from "react";
import { submitDemoRequest, type FormState } from "@/app/actions";

const initialState: FormState = { status: "idle" };

export function DemoForm() {
  const [state, action, pending] = useActionState(submitDemoRequest, initialState);

  return (
    <form action={action} className="demo-form">
      <input className="honey" tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" />
      <div className="field-row">
        <label className="field">
          First name
          <input required name="firstName" autoComplete="given-name" placeholder="Jane" />
        </label>
        <label className="field">
          Last name
          <input required name="lastName" autoComplete="family-name" placeholder="Smith" />
        </label>
      </div>
      <label className="field">
        Work email
        <input required name="workEmail" type="email" autoComplete="email" placeholder="jane@company.com" />
      </label>
      <label className="field">
        Company
        <input name="company" autoComplete="organization" placeholder="Your company" />
      </label>
      <label className="field">
        Webinars per month
        <select name="monthlyWebinars" defaultValue="1-2">
          <option value="1-2">1-2</option>
          <option value="3-5">3-5</option>
          <option value="6-10">6-10</option>
          <option value="10+">10+</option>
        </select>
      </label>
      {state.message ? (
        <p className={`form-message ${state.status}`} role="status">
          {state.message}
        </p>
      ) : null}
      <button className="button primary full" type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Request live demo"}
      </button>
    </form>
  );
}
