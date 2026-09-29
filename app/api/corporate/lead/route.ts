import { NextResponse } from "next/server"

/**
 * POST /api/corporate/lead
 *
 * Pushes a corporate wellness enquiry to TeleCRM, tagged so it can be
 * separated from D2C and PSP leads.
 *
 * Two things learned the hard way and worth keeping in mind here:
 *   1. TeleCRM must have "phone" set as the workspace lead identifier, or it
 *      accepts the request with a 200 and silently discards the lead.
 *   2. Field API names must match exactly what is configured under
 *      Settings -> Lead Fields. Unrecognised fields are dropped without an
 *      error, so a missing company name usually means a missing field.
 *
 * A 200 from TeleCRM means queued, not saved.
 */
export async function POST(req: Request) {
  try {
    const b = await req.json()

    const name = String(b?.name ?? "").trim()
    const digits = String(b?.phone ?? "").replace(/\D/g, "")
    const phone = digits.length === 10 ? `91${digits}` : digits.replace(/^\+/, "")

    if (!name || !/^91[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, error: "Name and a valid mobile number are required." }, { status: 400 })
    }

    const fields: Record<string, string> = {
      name,
      phone,
      email: String(b?.email ?? "").trim(),
      company: String(b?.company ?? "").trim(),
      role: String(b?.role ?? "").trim(),
      headcount: String(b?.headcount ?? "").trim(),
      message: String(b?.message ?? "").trim(),
      source: String(b?.source ?? "corporate-wellness"),
      page_url: String(b?.page_url ?? ""),
      referrer: String(b?.referrer ?? ""),
    }
    for (const k of Object.keys(fields)) if (!fields[k]) delete fields[k]

    const id = process.env.TELECRM_ENTERPRISE_ID
    const token = process.env.TELECRM_API_TOKEN

    if (!id || !token) {
      /* Degrade loudly in the log, quietly for the visitor - a corporate
         enquiry is too valuable to lose to a blank error screen. */
      console.error("[corporate lead] TeleCRM not configured. Lead:", fields)
      return NextResponse.json({ success: true, queued: false })
    }

    const res = await fetch(`https://next-api.telecrm.in/enterprise/${id}/autoupdatelead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fields }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.error("[corporate lead] TeleCRM rejected", res.status, text, fields)
      return NextResponse.json({ success: false, error: "Could not submit right now. Please email us instead." }, { status: 502 })
    }

    return NextResponse.json({ success: true, queued: true })
  } catch (err) {
    console.error("[corporate lead] failed", err)
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
