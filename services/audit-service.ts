import { prisma } from "@/lib/prisma";
import { AuditAction } from "@prisma/client";

export async function createAuditLog({
  actorId,
  action,
  targetTable,
  targetId,
  beforeState,
  afterState,
  metadata
}: {
  actorId?: string;
  action: AuditAction;
  targetTable: string;
  targetId: string;
  beforeState?: any;
  afterState?: any;
  metadata?: any;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        actorId,
        action,
        targetTable,
        targetId,
        beforeState: beforeState ? JSON.parse(JSON.stringify(beforeState)) : undefined,
        afterState: afterState ? JSON.parse(JSON.stringify(afterState)) : undefined,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      }
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // We don't throw here to prevent the main action from failing just because logging failed
    return null;
  }
}
