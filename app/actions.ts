"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const demoSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(80),
  lastName: z.string().trim().min(1, "Enter your last name.").max(80),
  workEmail: z.email("Enter a valid work email."),
  company: z.string().trim().max(120).default(""),
  monthlyWebinars: z.string().trim().max(40).default(""),
  website: z.string().max(0)
});

export async function submitDemoRequest(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = demoSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    workEmail: formData.get("workEmail"),
    company: formData.get("company") ?? "",
    monthlyWebinars: formData.get("monthlyWebinars") ?? "",
    website: formData.get("website") ?? ""
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demo_requests").insert({
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    work_email: parsed.data.workEmail,
    company: parsed.data.company,
    monthly_webinars: parsed.data.monthlyWebinars
  });

  if (error) {
    return { status: "error", message: "Your request could not be sent. Please try again." };
  }

  return {
    status: "success",
    message: "Thanks. A LeadFlow specialist will contact you within one business day."
  };
}
