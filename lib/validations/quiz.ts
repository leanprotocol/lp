import { z } from 'zod';

export const quizAnswerSchema = z.object({
  question: z.string(),
  answer: z.any(),
});

export const quizSubmissionSchema = z.object({
  answers: z.array(quizAnswerSchema).min(1, 'At least one answer is required'),
  insuranceProviderId: z.string().uuid().optional(),
  firebaseIdToken: z.string().optional(),
  name: z.string().optional(),
});

export const reviewQuizSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'HOLD']),
  reviewNotes: z.string().optional(),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;
export type ReviewQuizInput = z.infer<typeof reviewQuizSchema>;
