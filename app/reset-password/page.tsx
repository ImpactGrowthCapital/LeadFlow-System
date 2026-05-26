import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Reset password" description="We will send a secure password reset link to your email.">
      <AuthForm mode="reset" />
    </AuthShell>
  );
}
