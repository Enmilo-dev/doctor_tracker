import { createParser, parseAsString, parseAsStringLiteral } from 'nuqs';
import { GENDERS, objectIdSchema, PATIENT_CONDITIONS, PATIENT_SORTS } from '@doctor-tracker/shared';
import { paginationParsers, parseAsDateParam } from '@/lib/search-params';

const parseAsObjectId = createParser({
  parse: (value: string) => (objectIdSchema.safeParse(value).success ? value : null),
  serialize: (value: string) => value,
});

export const patientSearchParams = {
  search: parseAsString.withDefault(''),
  condition: parseAsStringLiteral(PATIENT_CONDITIONS),
  gender: parseAsStringLiteral(GENDERS),
  doctor: parseAsObjectId,
  from: parseAsDateParam,
  to: parseAsDateParam,
  sort: parseAsStringLiteral(PATIENT_SORTS).withDefault('newest'),
  ...paginationParsers,
};
