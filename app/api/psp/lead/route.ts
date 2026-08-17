// app/api/psp/lead/route.ts
// B2B enquiry endpoint for the /psp site. Posts to TeleCRM with a distinct
// source so pharmaceutical enquiries can be separated from patient leads.
//
// Env (shared with the existing lead routes):
//   TELECRM_ENTERPRISE_ID
//   TELECRM_API_TOKEN
//
// If TeleCRM is not configured the payload is logged and the route still
// returns success, matching the behaviour of the existing lead routes.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const ENTERPRISE_ID = process.env.TELECRM_ENTERPRISE_ID;
const API_TOKEN = process.env.TELECRM_API_TOKEN;
const TELECRM_URL = ENTERPRISE_ID
  ? "https://next-api.telecrm.in/enterprise/" + ENTERPRISE_ID + "/autoupdatelead"
  : null;

const FREE_MAIL = /(gmail|yahoo|hotmail|outlook|rediffmail)\./i;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const str = (k: string) => String(body[k] ?? "").trim();

    const name = str("name");
    const email = str("email").toLowerCase();
    const company = str("company");
    const designation = str("designation");
    const therapy = str("therapy");

    if (name.length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (FREE_MAIL.test(email)) {
      return NextResponse.json(
        { error: "Please use your work email address" },
        { status: 400 }
      );
    }
    if (company.length < 2) {
      return NextResponse.json({ error: "Company is required" }, { status: 400 });
    }
    if (designation.length < 2) {
      return NextResponse.json({ error: "Designation is required" }, { status: 400 });
    }
    if (!therapy) {
      return NextResponse.json({ error: "Therapy area is required" }, { status: 400 });
    }

    const fields = {
      name,
      email,
      company,
      designation,
      therapy_area: therapy,
      programme_status: str("status"),
      expected_geography: str("geography"),
      message: str("message"),
      blueprint_requested: body.blueprint ? "yes" : "no",
      source: "psp-b2b",
      lead_type: "pharma-partnership",
      page_url: str("page_url"),
      referrer: str("referrer"),
    };

    if (!TELECRM_URL || !API_TOKEN) {
      console.log("[psp/lead] TeleCRM not configured. Payload:", fields);
      return NextResponse.json({ success: true, delivered: false });
    }

    const res = await fetch(TELECRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_TOKEN,
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // A B2B enquiry that never reaches the CRM is a lost commercial
      // opportunity, so log the whole payload for manual recovery.
      console.error(
        "[psp/lead] TeleCRM rejected request",
        res.status,
        detail,
        JSON.stringify(fields)
      );
      return NextResponse.json({ success: true, delivered: false });
    }

    return NextResponse.json({ success: true, delivered: true });
  } catch (error) {
    console.error("[psp/lead]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
