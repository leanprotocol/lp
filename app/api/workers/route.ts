import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {

  const expectedKey = "Mspl@1234";
  if (!expectedKey) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  const providedKey = request.headers.get('x-api-key');
  if (providedKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [
    payments,
    refundRequests,
    subscriptions,
    subscriptionPlans,
    quizSubmissions,
    contactQueries,
    otps,
    users,
    insuranceProviders,
    newsletterSubscriptions,
    admins,
  ] = await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.refundRequest.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.subscriptionPlan.deleteMany(),
    prisma.quizSubmission.deleteMany(),
    prisma.contactQuery.deleteMany(),
    prisma.oTP.deleteMany(),
    prisma.user.deleteMany(),
    prisma.insuranceProvider.deleteMany(),
    prisma.newsletterSubscription.deleteMany(),
    prisma.admin.deleteMany(),
  ]);

  return NextResponse.json({
    ok: true,
    deleted: {
      payments: payments.count,
      refundRequests: refundRequests.count,
      subscriptions: subscriptions.count,
      subscriptionPlans: subscriptionPlans.count,
      quizSubmissions: quizSubmissions.count,
      contactQueries: contactQueries.count,
      otps: otps.count,
      users: users.count,
      insuranceProviders: insuranceProviders.count,
      newsletterSubscriptions: newsletterSubscriptions.count,
      admins: admins.count,
    },
  });
}
