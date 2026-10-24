// lib/retention/policy.ts
//
// How long we keep enquiry data, in one place so the rule cannot drift between
// the dashboard, the review page and the policy we publish.
//
// Under the DPDP Act personal data should be erased once the purpose it was
// collected for has ended. For an enquiry that never became a customer, that
// purpose is spent two years after we last had any contact.
//
// Nothing here deletes anything on a schedule. Records past the period are
// flagged for a person to review, and every decision is written to AuditLog.
//
// NEVER flagged:
//   - a lead that converted
//   - a quiz submission or contact query belonging to a registered user
// Customer records are governed by clinical and tax retention rules instead.

export const RETENTION_YEARS = 2;

export function retentionCutoff(now: Date = new Date()): Date {
  const d = new Date(now);
  d.setFullYear(d.getFullYear() - RETENTION_YEARS);
  return d;
}

export function monthsOld(from: Date, now: Date = new Date()): number {
  return Math.floor((now.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
}

export type OverdueKind = "lead" | "quizSubmission" | "contactQuery";

export const KIND_LABEL: Record<OverdueKind, string> = {
  lead: "Lead",
  quizSubmission: "Quiz submission",
  contactQuery: "Contact query",
};

/** What the review list shows. Deliberately no health answers: deciding whether
 *  a two-year-old record should go does not require reading someone's weight
 *  or conditions, and showing them here would be one more place that data is
 *  displayed and screenshotted. */
export type OverdueItem = {
  id: string;
  kind: OverdueKind;
  label: string;
  lastActivity: string;
  monthsOld: number;
};