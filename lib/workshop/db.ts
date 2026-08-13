// lib/workshop/db.ts
// Isolated from the main app database. The Neon serverless driver talks
// HTTP rather than holding a TCP connection, so there is no pool to
// exhaust when 300 people submit within the same few minutes.
//
// Requires: pnpm add @neondatabase/serverless
// Env: WORKSHOP_DATABASE_URL (pooled string from the workshop Neon project)

import { neon } from "@neondatabase/serverless";

const url = process.env.WORKSHOP_DATABASE_URL;

if (!url) {
  console.error("[workshop] WORKSHOP_DATABASE_URL is not set");
}

export const sql = neon(url || "");

/**
 * Rehearsal bypass. When WORKSHOP_TEST_BYPASS is set to "1", this number
 * skips the duplicate checks and its previous row is cleared on each run,
 * so the whole flow can be walked repeatedly without touching the console.
 *
 * REMOVE THE ENV VAR BEFORE THE WORKSHOP. With it set, anyone who knows
 * the number can sit the assessment more than once.
 */
export const TEST_PHONE = "919999999999";
export const TEST_BYPASS_ON = process.env.WORKSHOP_TEST_BYPASS === "1";

export function isTestPhone(phone: string): boolean {
  return TEST_BYPASS_ON && phone === TEST_PHONE;
}

export type Attempt = {
  id: number;
  phone: string;
  name: string | null;
  email: string | null;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  total: number | null;
  passed: boolean | null;
  order_seed: number;
  certificate_issued_at: string | null;
};

export async function getAttempt(phone: string): Promise<Attempt | null> {
  const rows = (await sql`
    SELECT id, phone, name, email, started_at, submitted_at,
           score, total, passed, order_seed, certificate_issued_at
    FROM workshop_attempt
    WHERE phone = ${phone}
    LIMIT 1
  `) as Attempt[];
  return rows[0] || null;
}

/** Used by the rehearsal bypass only. */
export async function deleteAttempt(phone: string): Promise<void> {
  await sql`DELETE FROM workshop_attempt WHERE phone = ${phone}`;
}

/**
 * Looks for an existing participant matching on any of phone, email or
 * name. Name matching is case-insensitive and whitespace-normalised.
 *
 * Note: matching on name can produce false positives, since common names
 * recur. Phone is verified by OTP and is the reliable identifier; email is
 * a reasonable second. If legitimate participants are being turned away,
 * drop the name clause from this query.
 */
export async function findExistingIdentity(
  phone: string,
  email: string,
  name: string
): Promise<{ matched: "phone" | "email" | "name"; attempt: Attempt } | null> {
  const rows = (await sql`
    SELECT id, phone, name, email, started_at, submitted_at,
           score, total, passed, order_seed, certificate_issued_at
    FROM workshop_attempt
    WHERE phone = ${phone}
       OR (${email} <> '' AND lower(email) = ${email})
       OR (${name} <> '' AND lower(regexp_replace(name, '\\s+', ' ', 'g')) = ${name.toLowerCase()})
    LIMIT 1
  `) as Attempt[];

  const row = rows[0];
  if (!row) return null;

  const matched =
    row.phone === phone
      ? "phone"
      : (row.email || "").toLowerCase() === email
        ? "email"
        : "name";

  return { matched, attempt: row };
}

/**
 * Creates the attempt row and starts the clock. Returns null when a row
 * already exists for this phone - the UNIQUE constraint makes this safe
 * even if two requests arrive together.
 */
export async function createAttempt(
  phone: string,
  name: string,
  email: string,
  orderSeed: number,
  ip: string,
  userAgent: string
): Promise<Attempt | null> {
  const rows = (await sql`
    INSERT INTO workshop_attempt (phone, name, email, order_seed, ip, user_agent)
    VALUES (${phone}, ${name}, ${email}, ${orderSeed}, ${ip}, ${userAgent})
    ON CONFLICT (phone) DO NOTHING
    RETURNING id, phone, name, email, started_at, submitted_at,
              score, total, passed, order_seed, certificate_issued_at
  `) as Attempt[];
  return rows[0] || null;
}

/** Grades are written once. The submitted_at guard makes resubmission a no-op. */
export async function saveResult(
  phone: string,
  score: number,
  total: number,
  passed: boolean,
  answers: unknown
): Promise<void> {
  await sql`
    UPDATE workshop_attempt
    SET submitted_at = NOW(),
        score = ${score},
        total = ${total},
        passed = ${passed},
        answers = ${JSON.stringify(answers)}::jsonb
    WHERE phone = ${phone} AND submitted_at IS NULL
  `;
}

/** Records that the certificate was generated. */
export async function markCertificateIssued(phone: string): Promise<void> {
  await sql`
    UPDATE workshop_attempt
    SET certificate_issued_at = COALESCE(certificate_issued_at, NOW())
    WHERE phone = ${phone} AND passed = TRUE
  `;
}
