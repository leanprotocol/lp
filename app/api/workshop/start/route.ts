// app/api/workshop/start/route.ts
// Begins the attempt: writes the row (which starts the clock server-side)
// and returns 15 of the 20 questions, selected and ordered by this
// participant's own seed, with the answer key stripped out.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/workshop/session";
import {
  createAttempt,
  getAttempt,
  deleteAttempt,
  isTestPhone,
} from "@/lib/workshop/db";
import { QUESTIONS, TEST_CONFIG } from "@/content/workshop-test";

/** Deterministic shuffle: the same seed always produces the same order. */
export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The 15 questions this seed serves, in order. Recomputed at grading. */
export function selectForSeed(seed: number) {
  return shuffleWithSeed(QUESTIONS, seed).slice(0, TEST_CONFIG.questionsPerTest);
}

export async function POST(request: NextRequest) {
  try {
    const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      return NextResponse.json({ error: "Not verified" }, { status: 401 });
    }

    // Rehearsal bypass: clear the previous run so the flow can be repeated.
    if (isTestPhone(session.phone)) {
      await deleteAttempt(session.phone);
    }

    const seed = Math.floor(Math.random() * 2000000000) + 1;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const ua = request.headers.get("user-agent") || "";

    const attempt = await createAttempt(
      session.phone,
      session.name,
      session.email,
      seed,
      ip,
      ua
    );

    // A row already exists: one sitting per person, no resuming.
    if (!attempt) {
      const existing = await getAttempt(session.phone);
      return NextResponse.json(
        {
          error: "already_taken",
          message: "You have already taken this assessment.",
          submitted: !!existing?.submitted_at,
          score: existing?.score ?? null,
          total: existing?.total ?? null,
          passed: existing?.passed ?? null,
        },
        { status: 409 }
      );
    }

    const startedAt = new Date(attempt.started_at).getTime();
    const limitMs =
      (TEST_CONFIG.durationMinutes + TEST_CONFIG.graceMinutes) * 60 * 1000;
    const msLeft = Math.max(0, startedAt + limitMs - Date.now());

    const served = selectForSeed(attempt.order_seed).map((q) => ({
      id: q.id,
      q: q.q,
      options: q.options,
    }));

    return NextResponse.json({
      success: true,
      questions: served,
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
