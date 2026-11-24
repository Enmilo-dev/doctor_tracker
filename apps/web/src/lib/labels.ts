import { SPECIALIZATIONS, type Gender, type PatientCondition } from '@doctor-tracker/shared';

export const CONDITION_LABELS: Record<PatientCondition, string> = {
  stable: 'Stable',
  recovering: 'Recovering',
  critical: 'Critical',
  discharged: 'Discharged',
};

export const CONDITION_STYLES: Record<PatientCondition, { dot: string; tint: string }> = {
  stable: { dot: 'bg-condition-stable', tint: 'bg-condition-stable/10' },
  recovering: { dot: 'bg-condition-recovering', tint: 'bg-condition-recovering/10' },
  critical: { dot: 'bg-condition-critical', tint: 'bg-condition-critical/15' },
  discharged: { dot: 'bg-condition-discharged', tint: 'bg-condition-discharged/10' },
};

export const GENDER_LABELS: Record<Gender, string> = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));

export const CONDITION_OPTIONS = toOptions(CONDITION_LABELS);
export const GENDER_OPTIONS = toOptions(GENDER_LABELS);
export const SPECIALIZATION_OPTIONS = SPECIALIZATIONS.map((value) => ({ value, label: value }));
