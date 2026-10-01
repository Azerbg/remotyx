import { z } from "zod";

export const requestSchema = z.object({
  service: z.enum(["support", "dev", "spec"]),
  category: z.string().min(1).max(120),
  description: z.string().trim().min(20, "Please describe your need in at least 20 characters.").max(5000),
  urgency: z.enum(["Urgent", "This week", "Flexible"]),
  plan: z.string().min(1).max(60),
  language: z.string().min(1).max(40),
  timezone: z.string().min(1).max(60),
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  company: z.string().trim().min(1, "Enter your company name.").max(160),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  country: z.string().trim().min(2, "Enter your country.").max(80),
  phone: z.string().max(40).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the terms to continue." }) }),
  website: z.string().max(0).optional().default(""), // honeypot
});

export type RequestInput = z.infer<typeof requestSchema>;
