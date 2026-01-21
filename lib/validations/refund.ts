import { z } from 'zod';

export const createRefundRequestSchema = z.object({
  subscriptionId: z.string().uuid('Invalid subscription ID'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason is too long'),
});

export const reviewRefundSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNotes: z.string().max(500, 'Admin notes are too long').optional(),
});

export type CreateRefundRequestInput = z.infer<typeof createRefundRequestSchema>;
export type ReviewRefundInput = z.infer<typeof reviewRefundSchema>;
