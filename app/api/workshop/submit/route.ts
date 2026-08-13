// app/api/workshop/submit/route.ts
// Grades server-side against the 15 questions this participant was served,
// recomputed from their seed. The answer key never reaches the browser
// before submission.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/workshop/session";
import { getAttempt, saveResult } from "@/lib/workshop/db";
import { TEST_CONFIG } from "@/content/workshop-test";
import { selectForSeed } from "../start/route";

export async function POST(request: NextRequest) {
  try {
    const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      return NextResponse.json({ error: "Not verified" }, { status: 401 });
    }

    const attempt = await getAttempt(session.phone);
    if (!attempt) {
      return NextResponse.json({ error: "No attempt found" }, { status: 400 });
    }

    // Idempotent: a double click or a retry returns the stored result.
    if (attempt.submitted_at) {
      return NextResponse.json({
        success: true,
        alreadySubmitted: true,
        score: attempt.score,
        total: attempt.total,
        passed: attempt.passed,
      });
    }

    const body = (await request.json()) as {
      answers?: Record<string, number>;
    };
    const submitted = body.answers || {};

    const startedAt = new Date(attempt.started_at).getTime();
    const limitMs =
      (TEST_CONFIG.durationMinutes + TEST_CONFIG.graceMinutes) * 60 * 1000 +
      30000; // 30s allowance for slow connections
    const late = Date.now() > startedAt + limitMs;

    const served = selectForSeed(attempt.order_seed);

    let score = 0;
    const detail = served.map((q) => {
      const given = submitted[String(q.id)];
      const correct = typeof given === "number" && given === q.answer;
      if (correct) score++;
      return {
        id: q.id,
        q: q.q,
        options: q.options,
        given: typeof given === "number" ? given : null,
        answer: q.answer,
        correct,
        rationale: q.rationale,
      };
    });

    const total = served.length;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= TEST_CONFIG.passPercent;

    await saveResult(session.phone, score, total, passed, {
      answers: submitted,
      late,
      percent,
    });

    return NextResponse.json({
      success: true,
      score,
      total,
      percent,
      passed,
      passMark: TEST_CONFIG.passPercent,
      name: session.name,
      detail,
    });
  } catch (error) {
    console.error("[workshop/submit]", error);
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }
}
