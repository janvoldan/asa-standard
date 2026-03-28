// Auto-generated from slice.contract.json. Do NOT edit.
// Overwritten during regeneration.

import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  expiresIn: z.number().int(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
