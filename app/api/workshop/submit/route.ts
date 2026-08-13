// app/api/workshop/submit/route.ts
// Grades server-side. The client never receives the answer key before
// submitting, so the score cannot be manufactured in the browser.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/workshop/session";
import { getAttempt, saveResult } from "@/lib/workshop/db";
import { QUESTIONS, TEST_CONFIG } from "@/content/workshop-test";

export async function POST(request: NextRequest) {
  try {
    const phone = readSessionToken(
      request.cookies.get(SESSION_COOKIE)?.value
    );
    if (!phone) {
      return NextResponse.json({ error: "Not verified" }, { status: 401 });
    }

    const attempt = await getAttempt(phone);
    if (!attempt) {
      return NextResponse.json({ error: "No attempt found" }, { status: 400 });
    }

    // Idempotent: a double-click or a retry returns the stored result
    // rather than regrading or erroring.
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

    // Time check with a 30s allowance for slow connections. Late papers are
    // graded on what was submitted rather than voided.
    const startedAt = new Date(attempt.started_at).getTime();
    const limitMs =
      (TEST_CONFIG.durationMinutes + TEST_CONFIG.graceMinutes) * 60 * 1000 +
      30000;
    const late = Date.now() > startedAt + limitMs;

    let score = 0;
    const detail = QUESTIONS.map((q) => {
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

    const total = QUESTIONS.length;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= TEST_CONFIG.passPercent;

    await saveResult(phone, score, total, passed, {
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
      detail,
    });
  } catch (error) {
    console.error("[workshop/submit]", error);
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }
}
