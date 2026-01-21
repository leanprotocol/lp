import { z } from 'zod';

export const contactQuerySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must be at most 15 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

export type ContactQueryInput = z.infer<typeof contactQuerySchema>;
