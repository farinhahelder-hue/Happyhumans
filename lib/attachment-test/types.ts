// ─── Types du Test de Style d'Attachement ─────────────────────────────────────

export type AttachmentDimension = 'anxiety' | 'avoidance';

export type AttachmentProfile =
  | 'secure'
  | 'anxious'
  | 'avoidant'
  | 'disorganized';

export interface AttachmentQuestion {
  id: number;
  text: string;
  dimension: AttachmentDimension;
  reverseScored: boolean;
}

export interface AttachmentAnswer {
  questionId: number;
  value: 1 | 2 | 3 | 4 | 5;
}

export interface AttachmentResult {
  profile: AttachmentProfile;
  anxietyScore: number;
  avoidanceScore: number;
  anxietyPercent: number;
  avoidancePercent: number;
  title: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  growthTips: string[];
  disclaimer: string;
}

// Structure SQL Supabase suggérée :
// create table attachment_attempts (
//   id          uuid primary key default gen_random_uuid(),
//   user_id     uuid references auth.users(id) null,
//   answers     jsonb not null,
//   anxiety_score    int not null,
//   avoidance_score  int not null,
//   profile     text not null,
//   created_at  timestamptz default now()
// );
