import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/lib/env';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export interface JWTPayload {
  userId: string;
  type: 'user' | 'admin';
  mobileNumber?: string;
  email?: string;
  [key: string]: unknown;
}

export async function signJWT(payload: JWTPayload, expiresIn: string = env.JWT_EXPIRES_IN): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
