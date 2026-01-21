import { NextRequest } from 'next/server';
import { verifyJWT } from './jwt';
import { prisma } from '@/lib/prisma';

export async function verifyAdminAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) return null;

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId || decoded.type !== 'admin') {
      return null;
    }

    const admin = await prisma.admin.findUnique({
      where: { 
        id: decoded.userId as string,
        isActive: true
      }
    });

    return admin;
  } catch (error) {
    return null;
  }
}
