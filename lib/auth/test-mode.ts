// lib/auth/test-mode.ts
//
// The team tests sign-in, password reset and the workshop with 9999999999 and
// OTP 123456, so no SMS is sent during development. The client sends the token
// below instead of a real Firebase one.
//
// That shortcut must never work on the live site: anything that accepts it can
// sign in, or reset a password, without an OTP. Next.js sets NODE_ENV to
// "production" on Vercel and "development" locally, so this returns false in
// production with nothing to configure and nothing to remember to switch off.
//
// Every route that accepts the test token calls this. Do not compare the string
// anywhere else.

export const MOCK_FIREBASE_TOKEN = "mock-firebase-id-token";
export const TEST_PHONE_E164 = "+919999999999";

/** True only in development, and only for the test token. */
export function isTestToken(token: unknown): boolean {
  return process.env.NODE_ENV !== "production" && token === MOCK_FIREBASE_TOKEN;
}

/** The decoded token the test number stands in for. */
export function testDecodedToken() {
  return { phone_number: TEST_PHONE_E164, uid: "mock-user-uid" };
}