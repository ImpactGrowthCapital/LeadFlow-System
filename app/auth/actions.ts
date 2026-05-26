"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";

export type AuthState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const credentialsSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

async function origin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  return host ? `${protocol}://${host}` : getSiteUrl();
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: "Email or password is incorrect." };
  }

  redirect("/dashboard");
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.extend({
    fullName: z.string().trim().min(2, "Enter your full name.").max(100),
    plan: z.enum(["Starter", "Growth", "Pro"]).default("Growth"),
    terms: z.literal("on", { error: "Accept the terms to create an account." })
  }).safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    plan: formData.get("plan") ?? "Growth",
    terms: formData.get("terms")
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const callbackUrl = `${await origin()}/auth/callback?next=/dashboard`;
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: callbackUrl,
      data: {
        full_name: parsed.data.fullName,
        plan: parsed.data.plan
      }
    }
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    status: "success",
    message: "Account created. Check your email to confirm your address, then sign in."
  };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const redirectTo = `${await origin()}/auth/callback?next=/dashboard`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = z.email("Enter a valid email address.").safeParse(formData.get("email"));

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await origin()}/auth/callback?next=/update-password`
  });

  if (error) {
    return { status: "error", message: "Unable to send a reset email right now." };
  }

  return { status: "success", message: "Check your email for a secure password reset link." };
}

export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = z.string().min(8, "Password must be at least 8 characters.").safeParse(formData.get("password"));

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });

  if (error) {
    return { status: "error", message: "Unable to update your password." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
