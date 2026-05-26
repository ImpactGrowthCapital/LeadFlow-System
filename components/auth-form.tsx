"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordReset,
  signIn,
  signUp,
  updatePassword,
  type AuthState
} from "@/app/auth/actions";

type Mode = "login" | "signup" | "reset" | "update";
const initialState: AuthState = { status: "idle" };

export function AuthForm({ mode, plan = "Growth" }: { mode: Mode; plan?: string }) {
  const action =
    mode === "login" ? signIn :
    mode === "signup" ? signUp :
    mode === "reset" ? requestPasswordReset :
    updatePassword;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="auth-form">
      {mode === "signup" ? (
        <>
          <label className="field">
            Full name
            <input className="auth-input" required name="fullName" autoComplete="name" />
          </label>
          <input type="hidden" name="plan" value={["Starter", "Growth", "Pro"].includes(plan) ? plan : "Growth"} />
        </>
      ) : null}

      {mode !== "update" ? (
        <label className="field">
          Email
          <input className="auth-input" required type="email" name="email" autoComplete="email" />
        </label>
      ) : null}

      {mode === "login" || mode === "signup" || mode === "update" ? (
        <label className="field">
          {mode === "update" ? "New password" : "Password"}
          <input
            className="auth-input"
            required
            minLength={8}
            type="password"
            name="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>
      ) : null}

      {mode === "signup" ? (
        <label className="terms">
          <input required type="checkbox" name="terms" /> I agree to the Terms of Service and Privacy Policy.
        </label>
      ) : null}

      {state.message ? <p className={`form-message ${state.status}`}>{state.message}</p> : null}

      <button className="button primary full" disabled={pending} type="submit">
        {pending ? "Please wait..." : labels[mode]}
      </button>

      {mode === "login" ? (
        <Link className="text-link" href="/reset-password">Forgot password?</Link>
      ) : null}
    </form>
  );
}

const labels: Record<Mode, string> = {
  login: "Sign in",
  signup: "Create account",
  reset: "Send reset link",
  update: "Save new password"
};
