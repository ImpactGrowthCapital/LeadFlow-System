import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "LeadFlow User";

  return (
    <DashboardShell name={name} email={user.email ?? ""}>
      {children}
    </DashboardShell>
  );
}
