import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(3, 'Plan name must be at least 3 characters').max(100, 'Plan name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive('Original price must be positive').optional(),
  durationDays: z.number().int().positive('Duration must be a positive integer'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  isActive: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
  allowMultiplePurchase: z.boolean().optional().default(false),
  isRefundable: z.boolean().optional().default(false),
  allowAutoRenew: z.boolean().optional().default(false),
});

export const updatePlanSchema = createPlanSchema.partial();

export const reviewSubscriptionSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

export const toggleAutoRenewSchema = z.object({
  autoRenew: z.boolean(),
});

export const reorderPlansSchema = z.object({
  planIds: z.array(z.string()).min(1, 'At least one plan ID is required'),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type ReviewSubscriptionInput = z.infer<typeof reviewSubscriptionSchema>;
export type ToggleAutoRenewInput = z.infer<typeof toggleAutoRenewSchema>;
export type ReorderPlansInput = z.infer<typeof reorderPlansSchema>;
