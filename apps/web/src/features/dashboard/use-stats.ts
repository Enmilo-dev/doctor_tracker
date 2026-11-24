'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { fetchStats, statsKeys } from './api';
import { statsSearchParams } from './search-params';

export const useStatsRange = () => useQueryStates(statsSearchParams, { history: 'push' });

export function useDashboardStats() {
  const [{ months }] = useStatsRange();

  const { data, isFetching } = useQuery({
    queryKey: statsKeys.dashboard(months),
    queryFn: ({ signal }) => fetchStats(months, signal),
    placeholderData: keepPreviousData,
  });

  return { stats: data, isFetching };
}
