import { z } from "zod";
import { contactForm } from "@/content/innovation";

/** Shared by the client form and the server route so both validate identically. */
export const innovationContactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(120, "Name is too long"),
  organisation: z
    .string()
    .trim()
    .min(2, "Enter your organisation")
    .max(160, "Organisation name is too long"),
  role: z
    .string()
    .trim()
    .min(2, "Enter your role")
    .max(120, "Role is too long"),
  workEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid work email address")
    .max(180, "Email is too long"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  collaborationType: z
    .string()
    .refine(
      (value) => contactForm.collaborationTypes.includes(value),
      "Choose a collaboration type"
    ),
  message: z
    .string()
    .trim()
    .min(20, "Please add at least a sentence or two")
    .max(4000, "Message is too long"),
  consent: z
    .boolean()
    .refine((value) => value === true, "Consent is required to submit this form"),
  /** Honeypot. People never see it, so it must never block a real submission.
   *  The server silently discards anything that arrives with it filled. */
  website: z.string().optional(),
});

export type InnovationContactInput = z.infer<typeof innovationContactSchema>;

export type InnovationContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
