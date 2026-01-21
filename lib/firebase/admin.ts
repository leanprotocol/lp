import * as admin from 'firebase-admin';
import { env } from '@/lib/env';

let app: admin.app.App | undefined;

export function getFirebaseAdmin(): admin.app.App | null {
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    return null;
  }

  if (!app) {
    try {
      app = admin.apps.length > 0 
        ? admin.apps[0]! 
        : admin.initializeApp({
            credential: admin.credential.cert({
              projectId: env.FIREBASE_PROJECT_ID,
              clientEmail: env.FIREBASE_CLIENT_EMAIL,
              privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
          });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
      return null;
    }
  }

  return app;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<admin.auth.DecodedIdToken | null> {
  const adminApp = getFirebaseAdmin();
  if (!adminApp) return null;

  try {
    const decodedToken = await admin.auth(adminApp).verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Failed to verify Firebase ID token:', error);
    return null;
  }
}

export async function deleteFirebaseUserByPhoneNumber(
  mobileNumber: string,
): Promise<{ success: boolean; reason?: string }> {
  const adminApp = getFirebaseAdmin();
  if (!adminApp) {
    return { success: false, reason: 'firebase_not_initialized' };
  }

  const auth = admin.auth(adminApp);
  const normalizedNumber = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`;

  try {
    const firebaseUser = await auth.getUserByPhoneNumber(normalizedNumber);
    await auth.deleteUser(firebaseUser.uid);
    return { success: true };
  } catch (error: any) {
    if (error?.code === 'auth/user-not-found') {
      return { success: false, reason: 'firebase_user_not_found' };
    }

    console.error('Failed to delete Firebase user:', error);
    return { success: false, reason: 'firebase_delete_failed' };
  }
}
