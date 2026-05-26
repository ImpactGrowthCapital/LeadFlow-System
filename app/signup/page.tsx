import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { GoogleAuthButton } from "@/components/google-auth-button";

export const metadata = { title: "Start Free Trial" };

export default async function SignupPage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan = "Growth" } = await searchParams;

  return (
    <AuthShell
      title="Start your free trial"
      description={`${plan} plan, 15 days free. No credit card required.`}
      footer={<p>Already have an account? <Link href="/login">Sign in</Link></p>}
    >
      <GoogleAuthButton />
      <div className="divider"><span>or continue with email</span></div>
      <AuthForm mode="signup" plan={plan} />
    </AuthShell>
  );
}
