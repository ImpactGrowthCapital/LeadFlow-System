"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { CadenceEmail } from "@/lib/types";

export type CadenceState = { status: "idle" | "error" | "success"; message?: string };

const cadenceSchema = z.object({
  label: z.string().trim().min(2, "Enter a campaign name.").max(140),
  industry: z.string().trim().min(2, "Enter an industry.").max(80),
  audience: z.string().trim().min(2, "Enter an audience.").max(120),
  objective: z.string().trim().min(2, "Enter an objective.").max(120),
  offer: z.string().trim().max(160).default("")
});

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createCadence(_: CadenceState, formData: FormData): Promise<CadenceState> {
  const parsed = cadenceSchema.safeParse({
    label: formData.get("label"),
    industry: formData.get("industry"),
    audience: formData.get("audience"),
    objective: formData.get("objective"),
    offer: formData.get("offer") ?? ""
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const { label, industry, audience, objective, offer } = parsed.data;
  const emails = buildCadence(industry, audience, objective, offer);
  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase.from("cadences").insert({
    user_id: user.id,
    label,
    industry,
    objective,
    status: "draft",
    emails
  });

  if (error) return { status: "error", message: "Unable to save this cadence." };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cadences");
  return { status: "success", message: "Draft cadence created and saved to your library." };
}

export async function updateCadenceStatus(formData: FormData) {
  const id = z.uuid().safeParse(formData.get("id"));
  const status = z.enum(["active", "paused"]).safeParse(formData.get("status"));
  if (!id.success || !status.success) return;
  const { supabase, user } = await authenticatedClient();
  await supabase.from("cadences").update({ status: status.data }).eq("id", id.data).eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cadences");
}

export async function deleteCadence(formData: FormData) {
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { supabase, user } = await authenticatedClient();
  await supabase.from("cadences").delete().eq("id", id.data).eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cadences");
}

function buildCadence(industry: string, audience: string, objective: string, offer: string): CadenceEmail[] {
  const resource = offer || "our practical guide";
  return [
    {
      day: 0,
      subject: `A useful next step for ${industry} teams`,
      purpose: "Deliver immediate value",
      body: `Hi [First Name], thanks for joining us. Here is ${resource}, built for ${audience}. It is a quick way to begin working toward ${objective.toLowerCase()}.`
    },
    {
      day: 2,
      subject: `How leading ${industry} teams remove follow-up friction`,
      purpose: "Teach and establish credibility",
      body: `Hi [First Name], the teams making progress on ${objective.toLowerCase()} focus on a clear next action after every event. Here are three patterns you can apply this week.`
    },
    {
      day: 5,
      subject: "Would a tailored walkthrough help?",
      purpose: "Invite a conversation",
      body: `Hi [First Name], if ${objective.toLowerCase()} is on your roadmap, we can show how similar ${industry} teams use LeadFlow. Would a short working session be useful?`
    },
    {
      day: 9,
      subject: "One last resource for your team",
      purpose: "Close respectfully",
      body: `Hi [First Name], I will close the loop here. Keep ${resource} handy, and reach out whenever your team is ready to revisit ${objective.toLowerCase()}.`
    }
  ];
}
