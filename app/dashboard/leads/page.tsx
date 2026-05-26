import { LeadManager } from "@/components/lead-manager";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  const leads = (data ?? []) as Lead[];

  return (
    <>
      <div className="page-head">
        <div>
          <p className="overline">Pipeline</p>
          <h1>Lead management</h1>
          <p>Create, qualify, and securely manage leads stored in your workspace.</p>
        </div>
      </div>
      <LeadManager leads={leads} />
    </>
  );
}
