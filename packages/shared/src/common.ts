import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const idParamsSchema = z.object({ id: objectIdSchema });

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email('Invalid email address'));

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s()-]{7,20}$/, 'Invalid phone number')
  .refine((value) => value.replace(/\D/g, '').length >= 7, 'Invalid phone number');

export const searchSchema = z
  .string()
  .trim()
  .max(100)
  .optional()
  .transform((value) => value || undefined);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const dateRangeShape = {
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
};

export const isValidDateRange = (range: { from?: string; to?: string }) =>
  !range.from || !range.to || range.from <= range.to;

export const dateRangeError = {
  error: '"From" date must be on or before "To" date',
  path: ['to'],
};

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataResponse<T> {
  data: T;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
