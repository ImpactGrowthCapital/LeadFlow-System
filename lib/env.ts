const requiredPublicVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
] as const;

export function getSupabaseConfig() {
  const values = Object.fromEntries(
    requiredPublicVariables.map((name) => [name, process.env[name]])
  ) as Record<(typeof requiredPublicVariables)[number], string | undefined>;

  const missing = requiredPublicVariables.filter((name) => !values[name]);

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  return {
    url: values.NEXT_PUBLIC_SUPABASE_URL!,
    publishableKey: values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  };
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
