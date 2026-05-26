import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Set New Password" };

export default function UpdatePasswordPage() {
  return (
    <AuthShell title="Set a new password" description="Choose a password with at least eight characters.">
      <AuthForm mode="update" />
    </AuthShell>
  );
}
