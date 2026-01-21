import { z } from 'zod';

export const createOrderSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
