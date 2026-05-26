export const stages = [
  "Registered",
  "Attended Live",
  "Watched Replay",
  "Engaged",
  "Qualified",
  "Subscriber",
  "Booked Call",
  "Converted"
] as const;

export type Stage = (typeof stages)[number];

export type Lead = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  organization: string;
  source: string;
  stage: Stage;
  notes: string | null;
  score: number;
  created_at: string;
  updated_at: string;
};

export type CadenceEmail = {
  day: number;
  subject: string;
  purpose: string;
  body: string;
};

export type Cadence = {
  id: string;
  user_id: string;
  label: string;
  industry: string;
  objective: string;
  status: "draft" | "active" | "paused";
  emails: CadenceEmail[];
  created_at: string;
  updated_at: string;
};
