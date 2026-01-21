import { jwtVerify } from 'jose';

interface AdminJWTPayload {
  userId: string;
  type: 'admin' | 'user';
  email?: string;
  [key: string]: unknown;
}

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET must be set for admin middleware');
}

const JWT_SECRET = new TextEncoder().encode(secret);

export async function verifyAdminToken(token: string): Promise<AdminJWTPayload> {
  const result = await jwtVerify(token, JWT_SECRET);
  return result.payload as AdminJWTPayload;
}
