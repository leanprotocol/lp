import { prisma } from "@/lib/prisma";
import { LeadSource, LeadStatus } from "@prisma/client";

export async function createLead({
  affiliateRef,
  firstName,
  lastName,
  email,
  mobileNumber,
  source = LeadSource.LINK,
  notes
}: {
  affiliateRef?: string | null;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  mobileNumber: string;
  source?: LeadSource;
  notes?: string;
}) {
  try {
    const normalizedPhone = mobileNumber.replace(/^\+91/, "").replace(/\s+/g, "");
    
    // 1. Find the affiliate if ref is provided
    let affiliateId: string | null = null;
    if (affiliateRef) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { referralCode: affiliateRef },
        select: { id: true }
      });
      affiliateId = affiliate?.id || null;
    }

    // 2. Duplicate Detection
    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [
          { mobileNumber: normalizedPhone },
          email ? { email } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      }
    });

    // 3. Create or Update Lead
    if (existingLead) {
      // If already converted, we might not want to touch it or just mark as duplicate
      return await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          isDuplicate: true,
          // Update affiliate only if not already set? Or keep the original?
          // Usually first touch or last touch - let's stick with first touch for now if already set.
          affiliateId: existingLead.affiliateId || affiliateId,
          status: existingLead.status,
          updatedAt: new Date()
        }
      });
    }

    return await prisma.lead.create({
      data: {
        affiliateId,
        firstName,
        lastName,
        email,
        mobileNumber: normalizedPhone,
        source,
        isDuplicate: false,
        status: LeadStatus.PENDING,
        notes
      }
    });

  } catch (error) {
    console.error("Lead Service Error:", error);
    throw error;
  }
}
