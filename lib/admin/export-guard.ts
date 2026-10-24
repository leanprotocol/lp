// lib/admin/export-guard.ts
//
// Shared rules for every route that hands out a file of personal data.
//
// An export is the moment data leaves the systems you control: the file lands
// on a laptop, gets mailed, gets put in WhatsApp. Under DPDP you are still the
// fiduciary for those copies, so the least you need is a record of who made
// each one and why, and a way to keep them small.
//
// Three things here:
//   requireReason  - no reason, no file
//   parseRange     - optional date window, so "everything ever" is a choice
//   logExport      - writes the export to AuditLog
//
// AuditLog has no EXPORTED action, so these are recorded as NOTE_ADDED with
// metadata.event = "export". Adding an enum value would need a migration;
// filtering on the metadata works without one.

import { NextResponse } from "next/server";
import { createAuditLog } from "@/services/audit-service";
import { AuditAction } from "@prisma/client";

export type ExportKind = "quizSubmissions" | "contactQueries" | "affiliateStatement";

const MIN_REASON = 6;

export function requireReason(url: URL): { reason: string } | { error: NextResponse } {
  const reason = (url.searchParams.get("reason") || "").trim();
  if (reason.length < MIN_REASON) {
    return {
      error: NextResponse.json(
        {
          error:
            "A reason is required before exporting personal data. Add ?reason=... to the request, for example reason=monthly%20reconciliation.",
        },
        { status: 400 }
      ),
    };
  }
  return { reason: reason.slice(0, 300) };
}

/** Optional from/to as YYYY-MM-DD. Absent means the whole table, which is
 *  allowed but recorded as such. */
export function parseRange(url: URL): { from?: Date; to?: Date; label: string } {
  const raw = (k: string) => url.searchParams.get(k) || "";
  const parse = (s: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
    const d = new Date(s + "T00:00:00.000Z");
    return isNaN(d.getTime()) ? undefined : d;
  };
  const from = parse(raw("from"));
  const to = parse(raw("to"));
  if (to) to.setUTCHours(23, 59, 59, 999);
  const label = from || to
    ? `${from ? from.toISOString().slice(0, 10) : "start"} to ${to ? to.toISOString().slice(0, 10) : "today"}`
    : "all records";
  return { from, to, label };
}

export async function logExport(opts: {
  actorId?: string;
  kind: ExportKind;
  rows: number;
  reason: string;
  range: string;
  containsHealthData: boolean;
}) {
  await createAuditLog({
    actorId: opts.actorId,
    action: AuditAction.NOTE_ADDED,
    targetTable: opts.kind,
    targetId: `export-${new Date().toISOString()}`,
    metadata: {
      event: "export",
      kind: opts.kind,
      rows: opts.rows,
      reason: opts.reason,
      range: opts.range,
      containsHealthData: opts.containsHealthData,
      exportedAt: new Date().toISOString(),
    },
  });
}

/** A line written into the file itself, so a spreadsheet found on a laptop
 *  can be traced back to the person who made it. */
export function provenanceLine(actor: string, reason: string, range: string): string {
  return [
    `Exported from Lean Protocol on ${new Date().toISOString()}`,
    `By: ${actor}`,
    `Reason: ${reason}`,
    `Range: ${range}`,
    "Contains personal data. Do not forward. Delete when no longer needed.",
  ].join("  |  ");
}