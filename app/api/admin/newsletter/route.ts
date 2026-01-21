import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;

    const where = status === 'active' 
      ? { isActive: true }
      : status === 'inactive'
      ? { isActive: false }
      : {};

    const [subscriptions, total] = await Promise.all([
      prisma.newsletterSubscription.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscription.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: subscriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter subscriptions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscription.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Newsletter subscription deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Failed to delete newsletter subscription' },
      { status: 500 }
    );
  }
}
