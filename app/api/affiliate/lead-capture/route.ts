export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/services/lead-service';
import { LeadSource } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobileNumber, source } = body;
    const affiliateRef = request.cookies.get('affiliate_ref')?.value ?? null;

    if (!name || !mobileNumber) {
      return NextResponse.json(
        { error: 'Name and mobile number are required' },
        { status: 400 }
      );
    }

    const names = name.split(" ");
    const lead = await createLead({
      affiliateRef,
      firstName: names[0],
      lastName: names.slice(1).join(" ") || null,
      mobileNumber,
      source: source || LeadSource.LANDING_PAGE,
      notes: 'Lead captured via Spin to Win modal.'
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id
    });

  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
