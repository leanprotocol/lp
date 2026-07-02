import { NextResponse } from "next/server";
import { prisma, hashPassword } from "../../../../lib/courseAuth";

/* ⚠️ TEMPORARY TEST-ONLY ROUTE — DELETE AFTER USE.
   Visit /api/masterclass/seed once to create a purchased test account:
     email:    anshkasudhik9891@gmail.com
     password: 123456
   Then delete the app/api/masterclass/seed/ folder so this isn't live. */

export async function GET() {
  const email = "anshkasudhik9891@gmail.com";
  const password = await hashPassword("123456");
  const user = await prisma.courseUser.upsert({
    where: { email },
    create: { email, password, name: "Ansh Test", purchased: true },
    update: { password, purchased: true },
  });
  return NextResponse.json({ ok: true, email: user.email, purchased: user.purchased });
}
