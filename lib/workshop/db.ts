// lib/workshop/db.ts
// Isolated from the main app database. The Neon serverless driver talks
// HTTP rather than holding a TCP connection, so there is no pool to
// exhaust when 300 people submit within the same few minutes.
//
// Requires: pnpm add @neondatabase/serverless
// Env: WORKSHOP_DATABASE_URL (pooled string from the NEW Neon project)

import { neon } from "@neondatabase/serverless";

const url = process.env.WORKSHOP_DATABASE_URL;

if (!url) {
  console.error("[workshop] WORKSHOP_DATABASE_URL is not set");
}

export const sql = neon(url || "");

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

const COLS = `id, phone, name, email, started_at, submitted_at,
              score, total, passed, order_seed, certificate_issued_at`;

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

/**
 * Creates the attempt row and starts the clock. Returns null when a row
 * already exists, which is how a second sitting is refused - the UNIQUE
 * constraint makes this safe even if two requests arrive together.
 */
export async function createAttempt(
  phone: string,
  orderSeed: number,
  ip: string,
  userAgent: string
): Promise<Attempt | null> {
  const rows = (await sql`
    INSERT INTO workshop_attempt (phone, order_seed, ip, user_agent)
    VALUES (${phone}, ${orderSeed}, ${ip}, ${userAgent})
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

/** Called when the participant enters their name to claim the certificate. */
export async function saveCertificateDetails(
  phone: string,
  name: string,
  email: string
): Promise<void> {
  await sql`
    UPDATE workshop_attempt
    SET name = ${name},
        email = ${email},
        certificate_issued_at = COALESCE(certificate_issued_at, NOW())
    WHERE phone = ${phone} AND passed = TRUE
  `;
}
