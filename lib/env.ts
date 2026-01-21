import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  
  // JWT & Security
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  
  // Firebase (server-side verification)
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  // AWS SES (optional)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SES_FROM_EMAIL: z.string().optional(),
  
  // Razorpay - Payment Gateway
  RAZORPAY_KEY_ID: z.string().min(1, "RAZORPAY_KEY_ID is required"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required"),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, "RAZORPAY_WEBHOOK_SECRET is required"),

  // Firebase client config (Phone Auth)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  
  // OTP Configuration
  OTP_EXPIRY_MINUTES: z.string().transform(Number).default("5"),
  OTP_MAX_ATTEMPTS: z.string().transform(Number).default("3"),
  OTP_BLOCK_DURATION_MINUTES: z.string().transform(Number).default("30"),
  
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(issue => issue.path.join('.')).join(', ');
      throw new Error(
        `❌ Invalid environment variables: ${missingVars}\n\n` +
        `Please check your .env file and ensure all required variables are set.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
