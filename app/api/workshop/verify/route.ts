// app/api/workshop/verify/route.ts
// Exchanges a Firebase ID token plus the participant's name and email for a
// workshop session cookie. Also refuses anyone whose phone, email or name
// already appears in the table.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { isTestToken, testDecodedToken } from "@/lib/auth/test-mode";
import {
  SESSION_COOKIE,
  COOKIE_OPTIONS,
  createSessionToken,
  normalisePhone,
  normaliseName,
  normaliseEmail,
  isValidPhone,
  isValidName,
  isValidEmail,
} from "@/lib/workshop/session";
import { findExistingIdentity, isTestPhone } from "@/lib/workshop/db";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      firebaseIdToken?: string;
      name?: string;
      email?: string;
    };

    if (!body.firebaseIdToken) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const name = normaliseName(body.name || "");
    const email = normaliseEmail(body.email || "");

    if (!isValidName(name)) {
      return NextResponse.json(
        { error: "Please enter your full name" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    /* Rehearsal number 9999999999 with code 123456, development only.
       See lib/auth/test-mode.ts - this is refused on the live site. */
    const decoded: any = isTestToken(body.firebaseIdToken)
      ? testDecodedToken()
      : await verifyFirebaseIdToken(body.firebaseIdToken);

    if (!decoded?.phone_number) {
      return NextResponse.json(
        { error: "Phone number could not be verified" },
        { status: 401 }
      );
    }

    const phone = normalisePhone(decoded.phone_number);
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Unsupported phone number" },
        { status: 400 }
      );
    }

    // One sitting per person, matched on any of the three identifiers.
    // The rehearsal number skips this when the bypass env var is set.
    const existing = isTestPhone(phone)
      ? null
      : await findExistingIdentity(phone, email, name);

    if (existing) {
      const field =
        existing.matched === "phone"
          ? "mobile number"
          : existing.matched === "email"
            ? "email address"
            : "name";
      return NextResponse.json(
        {
          error: "already_taken",
          matched: existing.matched,
          message:
            "This " +
            field +
            " has already been used for the assessment. Each participant may attempt it once.",
          submitted: !!existing.attempt.submitted_at,
          score: existing.attempt.score,
          total: existing.attempt.total,
          passed: existing.attempt.passed,
        },
        { status: 409 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken({ phone, name, email }),
      COOKIE_OPTIONS
    );
    return response;
  } catch (error) {
    console.error("[workshop/verify]", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}