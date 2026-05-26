"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { stages } from "@/lib/types";

export type LeadFormState = { status: "idle" | "error" | "success"; message?: string };

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.email("Enter a valid email."),
  organization: z.string().trim().max(120),
  source: z.string().trim().max(60).default("Manual"),
  stage: z.enum(stages),
  score: z.coerce.number().int().min(0).max(100),
  notes: z.string().trim().max(500).optional()
});

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function parseLead(formData: FormData) {
  return leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization") ?? "",
    source: formData.get("source") ?? "Manual",
    stage: formData.get("stage") ?? "Registered",
    score: formData.get("score") ?? "0",
    notes: formData.get("notes") ?? ""
  });
}

export async function createLead(_: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const parsed = parseLead(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase.from("leads").insert({ ...parsed.data, user_id: user.id });
  if (error) return { status: "error", message: "Unable to save the lead." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
  return { status: "success", message: "Lead saved." };
}

export async function updateLead(id: string, _: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const parsed = parseLead(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase.from("leads").update(parsed.data).eq("id", id).eq("user_id", user.id);
  if (error) return { status: "error", message: "Unable to update the lead." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
  return { status: "success", message: "Lead updated." };
}

export async function deleteLead(formData: FormData) {
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  const { supabase, user } = await authenticatedClient();
  await supabase.from("leads").delete().eq("id", id.data).eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
}
