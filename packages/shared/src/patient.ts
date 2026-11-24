import { z } from 'zod';
import {
  dateRangeError,
  dateRangeShape,
  emailSchema,
  isValidDateRange,
  objectIdSchema,
  paginationSchema,
  phoneSchema,
  searchSchema,
} from './common.js';
import type { Specialization } from './doctor.js';

export const PATIENT_CONDITIONS = ['stable', 'recovering', 'critical', 'discharged'] as const;
export type PatientCondition = (typeof PATIENT_CONDITIONS)[number];

export const GENDERS = ['male', 'female', 'other'] as const;
export type Gender = (typeof GENDERS)[number];

export const PATIENT_SORTS = ['newest', 'oldest', 'name'] as const;
export type PatientSort = (typeof PATIENT_SORTS)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

const tomorrow = () => new Date(Date.now() + DAY_MS).toISOString().slice(0, 10);

export const patientCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(100),
  age: z
    .number({ error: 'Enter a valid age' })
    .int('Age must be a whole number')
    .min(0, 'Age cannot be negative')
    .max(130, 'Age looks too high'),
  gender: z.enum(GENDERS, { error: 'Select a gender' }),
  phone: phoneSchema,
  email: emailSchema.optional(),
  condition: z.enum(PATIENT_CONDITIONS, { error: 'Select a condition' }),
  diagnosis: z.string().trim().min(2, 'Diagnosis is too short').max(200),
  admittedAt: z.iso
    .date()
    .refine((value) => value <= tomorrow(), 'Admission date cannot be in the future'),
});

export type PatientInput = z.infer<typeof patientCreateSchema>;

export const patientUpdateSchema = patientCreateSchema
  .extend({ doctor: objectIdSchema, email: z.union([emailSchema, z.literal('')]) })
  .partial()
  .refine((value) => Object.keys(value).length > 0, { error: 'Nothing to update' });

export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;

export const patientQuerySchema = paginationSchema
  .extend({
    search: searchSchema,
    condition: z.enum(PATIENT_CONDITIONS).optional(),
    gender: z.enum(GENDERS).optional(),
    doctor: objectIdSchema.optional(),
    ...dateRangeShape,
    sort: z.enum(PATIENT_SORTS).default('newest'),
  })
  .refine(isValidDateRange, dateRangeError);

export type PatientQuery = z.infer<typeof patientQuerySchema>;

export interface PatientDoctor {
  id: string;
  name: string;
  specialization: Specialization;
}

export interface Patient extends Omit<PatientInput, 'admittedAt'> {
  id: string;
  admittedAt: string;
  doctor: PatientDoctor;
  createdAt: string;
  updatedAt: string;
}
