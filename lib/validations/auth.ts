import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must be at most 15 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const verifyOTPSchema = z.object({
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must be at most 15 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
  otp: z.string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]+$/, 'OTP must contain only digits'),
});

export const verifyFirebaseSchema = z.object({
  firebaseIdToken: z.string().min(1, 'Firebase ID token is required'),
  name: z.string().optional(),
  password: registerSchema.shape.password.optional(),
});

export const loginSchema = z.object({
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must be at most 15 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
  password: z.string().min(1, 'Password is required'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordRequestSchema = z.object({
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must be at most 15 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
});

export const forgotPasswordVerifySchema = z.object({
  firebaseIdToken: z.string().min(1, 'Firebase ID token is required'),
});

export const forgotPasswordResetSchema = z.object({
  firebaseIdToken: z.string().min(1, 'Firebase ID token is required'),
  newPassword: registerSchema.shape.password,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type VerifyFirebaseInput = z.infer<typeof verifyFirebaseSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ForgotPasswordRequestInput = z.infer<typeof forgotPasswordRequestSchema>;
export type ForgotPasswordVerifyInput = z.infer<typeof forgotPasswordVerifySchema>;
export type ForgotPasswordResetInput = z.infer<typeof forgotPasswordResetSchema>;
