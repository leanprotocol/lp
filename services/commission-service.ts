import { prisma } from "@/lib/prisma";
import { CommissionStatus, LeadStatus } from "@prisma/client";

export async function calculateAndCreateCommission(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });

    if (!payment || payment.status !== "SUCCESS") return null;

    // Find the lead for this user
    const lead = await prisma.lead.findFirst({
      where: {
        mobileNumber: payment.user.mobileNumber,
        status: LeadStatus.PENDING,
        affiliateId: { not: null }
      },
      orderBy: { createdAt: "desc" }
    });

    if (!lead || !lead.affiliateId) return null;

    // Calculate commission percentage based on plan duration
    // 1m (30d): 10%, 3m (90d): 8%, 6m (180d): 6%
    const durationDays = payment.subscription.plan.durationDays;
    let percentage = 0;
    
    if (durationDays <= 45) {
      percentage = 10;
    } else if (durationDays <= 120) {
      percentage = 8;
    } else {
      percentage = 6;
    }

    const commissionAmount = (payment.amount * percentage) / 100;

    const isRefundable = payment.subscription.plan.isRefundable;

    // Create commission record
    const commission = await prisma.commission.create({
      data: {
        affiliateId: lead.affiliateId,
        leadId: lead.id,
        paymentId: payment.id,
        amount: commissionAmount,
        percentage: percentage,
        status: isRefundable ? CommissionStatus.PENDING : CommissionStatus.ELIGIBLE,
        eligibleAt: isRefundable ? new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) : new Date() // 28 days window if refundable
      }
    });

    // Update lead status
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: LeadStatus.CONVERTED,
        convertedAt: new Date()
      }
    });

    return commission;

  } catch (error) {
    console.error("Commission Service Error:", error);
    throw error;
  }
}
