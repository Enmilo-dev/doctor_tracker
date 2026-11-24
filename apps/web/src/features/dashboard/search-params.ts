import { createLoader, parseAsNumberLiteral } from 'nuqs/server';
import { DEFAULT_STATS_MONTHS, STATS_MONTHS } from '@doctor-tracker/shared';

export const statsSearchParams = {
  months: parseAsNumberLiteral(STATS_MONTHS).withDefault(DEFAULT_STATS_MONTHS),
};

export const loadStatsParams = createLoader(statsSearchParams);
