import { NextResponse } from "next/server";
import { prisma, getSessionUser } from "../../../../lib/courseAuth";

const LESSON_COUNT = 12;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  if (!user.purchased) return NextResponse.json({ error: "Not purchased" }, { status: 403 });

  const { activeModule, completed } = await req.json();
  const am = Number.isInteger(activeModule) ? Math.max(0, Math.min(LESSON_COUNT - 1, activeModule)) : user.activeModule;
  const comp = Array.isArray(completed)
    ? Array.from(new Set(completed.filter((n: unknown) => Number.isInteger(n) && (n as number) >= 0 && (n as number) < LESSON_COUNT)))
    : undefined;

  await prisma.courseUser.update({
    where: { id: user.id },
    data: { activeModule: am, ...(comp ? { completed: comp } : {}) },
  });
  return NextResponse.json({ ok: true });
}
