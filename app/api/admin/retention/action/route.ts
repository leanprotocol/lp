// app/api/admin/retention/action/route.ts
// Acts on a record flagged by the retention review: delete it, or keep it with
// a written reason. Both outcomes are recorded in AuditLog, which is the point
// of the exercise - a regulator asks what you reviewed and what you decided,
// not whether you received a notification.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/middleware";
import { createAuditLog } from "@/services/audit-service";
import { AuditAction } from "@prisma/client";
import { RETENTION_YEARS, type OverdueKind } from "@/lib/retention/policy";
import { z } from "zod";

const schema = z.object({
  kind: z.enum(["lead", "quizSubmission", "contactQuery"]),
  ids: z.array(z.string().uuid()).min(1).max(200),
  decision: z.enum(["delete", "keep"]),
  /* A kept record needs a reason: "we decided to keep it" is not a defence,
     "ongoing dispute, ref 1182" is. */
  reason: z.string().trim().max(500).optional(),
});

const TABLE: Record<OverdueKind, string> = {
  lead: "Lead",
  quizSubmission: "QuizSubmission",
  contactQuery: "ContactQuery",
};

export async function POST(request: NextRequest) {
  try {
    const { authorized, response, user } = await requireAuth(request, ["admin"]);
    if (!authorized) return response!;

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.issues }, { status: 400 });
    }
    const { kind, ids, decision, reason } = parsed.data;

    if (decision === "keep" && (!reason || reason.length < 3)) {
      return NextResponse.json({ error: "A reason is required to keep a record past its retention period" }, { status: 400 });
    }

    const actorId = (user as { id?: string } | undefined)?.id;
    const table = TABLE[kind];
    const metadata = {
      retentionYears: RETENTION_YEARS,
      decision,
      reason: reason || null,
      reviewedAt: new Date().toISOString(),
    };

    if (decision === "keep") {
      for (const id of ids) {
        await createAuditLog({
          actorId,
          action: AuditAction.NOTE_ADDED,
          targetTable: table,
          targetId: id,
          metadata: { ...metadata, note: "Retention review: kept past the retention period" },
        });
      }
      return NextResponse.json({ success: true, kept: ids.length });
    }

    /* Audit first, then delete. If the delete fails we have a log entry for
       something that still exists, which is recoverable. The reverse - data
       gone with no record of who removed it - is not. */
    let deleted = 0;
    for (const id of ids) {
      await createAuditLog({
        actorId,
        action: AuditAction.DELETED,
        targetTable: table,
        targetId: id,
        metadata: { ...metadata, note: "Retention review: erased past the retention period" },
      });
    }

    if (kind === "lead") {
      const r = await prisma.lead.deleteMany({ where: { id: { in: ids }, convertedAt: null } });
      deleted = r.count;
    } else if (kind === "quizSubmission") {
      const r = await prisma.quizSubmission.deleteMany({ where: { id: { in: ids }, userId: null } });
      deleted = r.count;
    } else {
      const r = await prisma.contactQuery.deleteMany({ where: { id: { in: ids }, userId: null } });
      deleted = r.count;
    }

    return NextResponse.json({ success: true, deleted, requested: ids.length });
  } catch (error) {
    console.error("[admin/retention/action] failed:", error);
    return NextResponse.json({ error: "Could not complete the retention action" }, { status: 500 });
  }
}