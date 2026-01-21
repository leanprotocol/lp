import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';

function getSESClient() {
  if (!env.AWS_REGION) return null;

  const hasKeys = Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY);

  return new SESClient({
    region: env.AWS_REGION,
    credentials: hasKeys
      ? {
          accessKeyId: env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string,
        }
      : undefined,
  });
}

async function sendEmail(params: {
  to: string[];
  subject: string;
  text: string;
}) {
  if (!env.SES_FROM_EMAIL) return;
  if (!params.to.length) return;

  const client = getSESClient();
  if (!client) return;

  await client.send(
    new SendEmailCommand({
      Source: env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: params.to,
      },
      Message: {
        Subject: { Data: params.subject, Charset: 'UTF-8' },
        Body: {
          Text: { Data: params.text, Charset: 'UTF-8' },
        },
      },
    })
  );
}

export async function notifyAdminsQuizSubmitted(submissionId: string) {
  const admins = await prisma.admin.findMany({
    where: { isActive: true },
    select: { email: true },
  });

  const to = admins.map((a: { email: string }) => a.email).filter((email): email is string => Boolean(email));
  if (!to.length) return;

  const submission = await prisma.quizSubmission.findUnique({
    where: { id: submissionId },
    include: {
      user: { select: { id: true, name: true, mobileNumber: true } },
      insuranceProvider: { select: { id: true, name: true } },
    },
  });

  if (!submission) return;

  const subject = `New quiz submitted (${submission.user.mobileNumber})`;

  const text = [
    'A new quiz has been submitted.',
    '',
    `Submission ID: ${submission.id}`,
    `User: ${submission.user.name ?? submission.user.mobileNumber}`,
    `Mobile: ${submission.user.mobileNumber}`,
    `Insurance: ${submission.insuranceProvider?.name ?? '—'}`,
    `Status: ${submission.status}`,
    '',
    'Please review it in the admin console.',
  ].join('\n');

  try {
    await sendEmail({ to, subject, text });
  } catch (error) {
    console.error('Failed to send SES quiz submitted email:', error);
  }
}

export async function notifyAdminsQuizApproved(submissionId: string) {
  const admins = await prisma.admin.findMany({
    where: { isActive: true },
    select: { email: true },
  });

  const to = admins.map((a: { email: string }) => a.email).filter((email): email is string => Boolean(email));
  if (!to.length) return;

  const submission = await prisma.quizSubmission.findUnique({
    where: { id: submissionId },
    include: {
      user: { select: { id: true, name: true, mobileNumber: true } },
      insuranceProvider: { select: { id: true, name: true } },
    },
  });

  if (!submission) return;

  const subject = `Quiz approved (${submission.user.mobileNumber})`;

  const text = [
    'A quiz submission has been approved.',
    '',
    `Submission ID: ${submission.id}`,
    `User: ${submission.user.name ?? submission.user.mobileNumber}`,
    `Mobile: ${submission.user.mobileNumber}`,
    `Insurance: ${submission.insuranceProvider?.name ?? '—'}`,
    `Status: ${submission.status}`,
    '',
    'This is an automated notification.',
  ].join('\n');

  try {
    await sendEmail({ to, subject, text });
  } catch (error) {
    console.error('Failed to send SES quiz approved email:', error);
  }
}
