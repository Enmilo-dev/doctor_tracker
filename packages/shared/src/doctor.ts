import { z } from 'zod';
import {
  dateRangeError,
  dateRangeShape,
  emailSchema,
  isValidDateRange,
  paginationSchema,
  phoneSchema,
  searchSchema,
} from './common.js';

export const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Oncology',
  'General Medicine',
  'Psychiatry',
  'Radiology',
  'ENT',
] as const;
export type Specialization = (typeof SPECIALIZATIONS)[number];

export const DOCTOR_SORTS = ['newest', 'oldest', 'name'] as const;
export type DoctorSort = (typeof DOCTOR_SORTS)[number];

export const doctorCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(100),
  specialization: z.enum(SPECIALIZATIONS, { error: 'Select a specialization' }),
  hospital: z.string().trim().min(2, 'Hospital is too short').max(120),
  phone: phoneSchema,
  email: emailSchema,
});

export type DoctorInput = z.infer<typeof doctorCreateSchema>;

export const doctorQuerySchema = paginationSchema
  .extend({
    search: searchSchema,
    specialization: z.enum(SPECIALIZATIONS).optional(),
    ...dateRangeShape,
    sort: z.enum(DOCTOR_SORTS).default('newest'),
  })
  .refine(isValidDateRange, dateRangeError);

export type DoctorQuery = z.infer<typeof doctorQuerySchema>;

export interface Doctor extends DoctorInput {
  id: string;
  patientCount: number;
  createdAt: string;
  updatedAt: string;
}
