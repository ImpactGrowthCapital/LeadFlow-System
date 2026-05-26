import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { GoogleAuthButton } from "@/components/google-auth-button";

export const metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your LeadFlow workspace."
      footer={<p>New to LeadFlow? <Link href="/signup">Create a free account</Link></p>}
    >
      {error === "oauth" ? <p className="form-message error">Google sign in could not be started.</p> : null}
      <GoogleAuthButton />
      <div className="divider"><span>or continue with email</span></div>
      <AuthForm mode="login" />
    </AuthShell>
  );
}
