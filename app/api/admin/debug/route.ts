export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV || 'MISSING',
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
    };

    // Test database connection
    let dbStatus = 'NOT_TESTED';
    let dbError = null;
    
    try {
      const { prisma } = await import('@/lib/prisma');
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'CONNECTED';
    } catch (error: any) {
      dbStatus = 'ERROR';
      dbError = error.message;
    }

    // Check cookies
    const adminToken = request.cookies.get('admin_token')?.value;
    const authToken = request.cookies.get('auth-token')?.value;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
      },
      authentication: {
        hasAdminToken: !!adminToken,
        hasAuthToken: !!authToken,
      },
    });

  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
