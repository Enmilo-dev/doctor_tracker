import { parseAsString, parseAsStringLiteral } from 'nuqs';
import { DOCTOR_SORTS, SPECIALIZATIONS } from '@doctor-tracker/shared';
import { paginationParsers, parseAsDateParam } from '@/lib/search-params';

export const doctorSearchParams = {
  search: parseAsString.withDefault(''),
  specialization: parseAsStringLiteral(SPECIALIZATIONS),
  from: parseAsDateParam,
  to: parseAsDateParam,
  sort: parseAsStringLiteral(DOCTOR_SORTS).withDefault('newest'),
  ...paginationParsers,
};
