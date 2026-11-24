import { z } from 'zod';
import type { Specialization } from './doctor.js';
import type { PatientCondition } from './patient.js';

export const STATS_MONTHS = [3, 6, 12] as const;
export type StatsMonths = (typeof STATS_MONTHS)[number];

export const DEFAULT_STATS_MONTHS: StatsMonths = 12;

export const statsQuerySchema = z.object({
  months: z.coerce.number().pipe(z.literal(STATS_MONTHS)).default(DEFAULT_STATS_MONTHS),
});

export type StatsQuery = z.infer<typeof statsQuerySchema>;

export interface DashboardStats {
  totals: {
    doctors: number;
    patients: number;
    critical: number;
    admittedThisMonth: number;
    admittedLastMonth: number;
  };
  admissionsByMonth: { month: string; count: number }[];
  patientsPerDoctor: {
    doctorId: string;
    name: string;
    specialization: Specialization;
    count: number;
  }[];
  byCondition: { condition: PatientCondition; count: number }[];
  bySpecialization: { specialization: Specialization; doctors: number; patients: number }[];
}
