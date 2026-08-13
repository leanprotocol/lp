// app/api/workshop/start/route.ts
// Begins the attempt: writes the row (which starts the clock server-side)
// and returns the questions in this participant's shuffled order, with the
// correct answers stripped out.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/workshop/session";
import { createAttempt, getAttempt } from "@/lib/workshop/db";
import { QUESTIONS, TEST_CONFIG } from "@/content/workshop-test";

/** Deterministic shuffle so the same seed always gives the same order. */
function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function POST(request: NextRequest) {
  try {
    const phone = readSessionToken(
      request.cookies.get(SESSION_COOKIE)?.value
    );
    if (!phone) {
      return NextResponse.json({ error: "Not verified" }, { status: 401 });
    }

    const seed = Math.floor(Math.random() * 2000000000) + 1;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const ua = request.headers.get("user-agent") || "";

    // Returns null when a row already exists - the UNIQUE constraint on
    // phone is what refuses a second sitting.
    let attempt = await createAttempt(phone, seed, ip, ua);

    if (!attempt) {
      const existing = await getAttempt(phone);
      if (existing?.submitted_at) {
        return NextResponse.json(
          {
            error: "already_submitted",
            message: "You have already completed this assessment.",
            score: existing.score,
            total: existing.total,
            passed: existing.passed,
          },
          { status: 409 }
        );
      }
      // Started but never submitted: let them back in on the original
      // clock rather than locking them out for a dropped connection.
      attempt = existing!;
    }

    const startedAt = new Date(attempt.started_at).getTime();
    const limitMs =
      (TEST_CONFIG.durationMinutes + TEST_CONFIG.graceMinutes) * 60 * 1000;
    const msLeft = Math.max(0, startedAt + limitMs - Date.now());

    const ordered = shuffleWithSeed(QUESTIONS, attempt.order_seed).map((q) => ({
      id: q.id,
      q: q.q,
      options: q.options,
    }));

    return NextResponse.json({
      success: true,
      questions: ordered,
      startedAt: attempt.started_at,
      msLeft,
      durationMinutes: TEST_CONFIG.durationMinutes,
      graceMinutes: TEST_CONFIG.graceMinutes,
    });
  } catch (error) {
    console.error("[workshop/start]", error);
    return NextResponse.json({ error: "Could not start" }, { status: 500 });
  }
}
