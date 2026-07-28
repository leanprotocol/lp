export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { innovationContactSchema } from "@/lib/innovation-contact-schema";

/**
 * Innovation enquiry endpoint.
 *
 * - Validates with the same Zod schema the client uses
 * - Rejects honeypot submissions silently (returns ok, stores nothing)
 * - Rate limits per IP
 * - Writes to Supabase via the REST API, so no extra npm dependency is needed
 * - Service-role key is read server-side only and never sent to the browser
 *
 * If Supabase env vars are absent, the submission is logged and the caller
 * still receives a success response, so the page keeps working in development.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = "innovation_enquiries";

// --- Simple in-memory rate limit (per warm instance) ----------------------
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many enquiries from this connection. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    const parsed = innovationContactSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, error: "Please check the highlighted fields.", fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot filled means a bot. Accept quietly, store nothing.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const record = {
      full_name: parsed.data.fullName,
      organisation: parsed.data.organisation,
      role: parsed.data.role,
      work_email: parsed.data.workEmail,
      phone: parsed.data.phone || null,
      collaboration_type: parsed.data.collaborationType,
      message: parsed.data.message,
      consent: parsed.data.consent,
      source_page: "/innovation",
      user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    };

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.log("[Innovation Contact] Supabase not configured. Enquiry:", record);
      return NextResponse.json({ ok: true });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[Innovation Contact] Supabase rejected insert:", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "The enquiry could not be saved. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Innovation Contact] Unexpected error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
