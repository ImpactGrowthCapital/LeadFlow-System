import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").maybeSingle();

  return (
    <>
      <div className="page-head">
        <div>
          <p className="overline">Account</p>
          <h1>Workspace settings</h1>
          <p>Authentication and subscription information for this LeadFlow workspace.</p>
        </div>
      </div>
      <section className="panel settings-panel">
        <h2>Profile</h2>
        <dl>
          <div><dt>Email</dt><dd>{user?.email}</dd></div>
          <div><dt>Name</dt><dd>{profile?.full_name || user?.user_metadata.full_name || "-"}</dd></div>
          <div><dt>Plan</dt><dd>{profile?.plan || "Growth trial"}</dd></div>
          <div><dt>Trial ends</dt><dd>{profile?.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString() : "-"}</dd></div>
        </dl>
      </section>
      <section className="panel settings-panel">
        <h2>Security</h2>
        <p>Your dashboard data is restricted by Supabase row-level security and accessed with an authenticated session cookie.</p>
      </section>
    </>
  );
}
