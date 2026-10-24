// app/api/admin/retention/route.ts
// Counts and lists enquiry records past the retention period. Read only:
// nothing is deleted here. See lib/retention/policy.ts for the rule.

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/middleware";
import { KIND_LABEL, monthsOld, retentionCutoff, type OverdueItem } from "@/lib/retention/policy";

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ["admin"]);
    if (!authorized) return response!;

    const countOnly = request.nextUrl.searchParams.get("countOnly") === "1";
    const cutoff = retentionCutoff();

    /* A lead is spent only if it never converted and nobody has touched it
       since the cutoff. updatedAt moves whenever status or notes change, so
       an active lead is never flagged. */
    const leadWhere = {
      convertedAt: null,
      updatedAt: { lt: cutoff },
    };
    /* Submissions and queries belonging to a registered user are that
       customer's record, governed by clinical retention, not this rule. */
    const quizWhere = { userId: null, submittedAt: { lt: cutoff } };
    const queryWhere = { userId: null, createdAt: { lt: cutoff } };

    const [leads, quizzes, queries] = await Promise.all([
      prisma.lead.count({ where: leadWhere }),
      prisma.quizSubmission.count({ where: quizWhere }),
      prisma.contactQuery.count({ where: queryWhere }),
    ]);

    const counts = { leads, quizSubmissions: quizzes, contactQueries: queries };
    const total = leads + quizzes + queries;

    if (countOnly) {
      return NextResponse.json({ success: true, total, counts, cutoff: cutoff.toISOString() });
    }

    const LIMIT = 200;
    const [leadRows, quizRows, queryRows] = await Promise.all([
      prisma.lead.findMany({
        where: leadWhere,
        select: { id: true, updatedAt: true, source: true },
        orderBy: { updatedAt: "asc" },
        take: LIMIT,
      }),
      prisma.quizSubmission.findMany({
        where: quizWhere,
        select: { id: true, submittedAt: true },
        orderBy: { submittedAt: "asc" },
        take: LIMIT,
      }),
      prisma.contactQuery.findMany({
        where: queryWhere,
        select: { id: true, createdAt: true },
        orderBy: { createdAt: "asc" },
        take: LIMIT,
      }),
    ]);

    const items: OverdueItem[] = [
      ...leadRows.map((r) => ({
        id: r.id,
        kind: "lead" as const,
        label: `${KIND_LABEL.lead} (${String(r.source).toLowerCase()})`,
        lastActivity: r.updatedAt.toISOString(),
        monthsOld: monthsOld(r.updatedAt),
      })),
      ...quizRows.map((r) => ({
        id: r.id,
        kind: "quizSubmission" as const,
        label: KIND_LABEL.quizSubmission,
        lastActivity: r.submittedAt.toISOString(),
        monthsOld: monthsOld(r.submittedAt),
      })),
      ...queryRows.map((r) => ({
        id: r.id,
        kind: "contactQuery" as const,
        label: KIND_LABEL.contactQuery,
        lastActivity: r.createdAt.toISOString(),
        monthsOld: monthsOld(r.createdAt),
      })),
    ].sort((a, b) => a.lastActivity.localeCompare(b.lastActivity));

    return NextResponse.json({
      success: true,
      total,
      counts,
      cutoff: cutoff.toISOString(),
      items,
      truncated: leadRows.length === LIMIT || quizRows.length === LIMIT || queryRows.length === LIMIT,
    });
  } catch (error) {
    console.error("[admin/retention] list failed:", error);
    return NextResponse.json({ error: "Could not load retention review" }, { status: 500 });
  }
}