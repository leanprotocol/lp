// app/api/workshop/verify/route.ts
// Exchanges a Firebase ID token (phone already verified client-side) for a
// workshop session cookie. Touches nothing in the main app database.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import {
  SESSION_COOKIE,
  COOKIE_OPTIONS,
  createSessionToken,
  normalisePhone,
  isValidIndianPhone,
} from "@/lib/workshop/session";
import { getAttempt } from "@/lib/workshop/db";

export async function POST(request: NextRequest) {
  try {
    const { firebaseIdToken } = (await request.json()) as {
      firebaseIdToken?: string;
    };

    if (!firebaseIdToken) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Same test bypass the main app uses: 9999999999 / code 123456.
    // Lets us rehearse the full flow without sending real SMS.
    let decoded: any;
    if (firebaseIdToken === "mock-firebase-id-token") {
      decoded = { phone_number: "+919999999999" };
    } else {
      decoded = await verifyFirebaseIdToken(firebaseIdToken);
    }

    if (!decoded?.phone_number) {
      return NextResponse.json(
        { error: "Phone number could not be verified" },
        { status: 401 }
      );
    }

    const phone = normalisePhone(decoded.phone_number);
    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        { error: "Unsupported phone number" },
        { status: 400 }
      );
    }

    // Tell the client where this person stands, so the page can route them
    // to the instructions, back into a running test, or to their result.
    const attempt = await getAttempt(phone);

    const response = NextResponse.json({
      success: true,
      state: !attempt
        ? "not_started"
        : attempt.submitted_at
          ? "submitted"
          : "in_progress",
      passed: attempt?.passed ?? null,
      score: attempt?.score ?? null,
      total: attempt?.total ?? null,
    });

    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken(phone),
      COOKIE_OPTIONS
    );
    return response;
  } catch (error) {
    console.error("[workshop/verify]", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
