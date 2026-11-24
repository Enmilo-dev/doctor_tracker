import { z } from 'zod';
import { emailSchema } from './common.js';

export const SESSION_COOKIE = 'dt_session';

export const ROLES = ['admin'] as const;
export type Role = (typeof ROLES)[number];

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
