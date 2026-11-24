import type { DashboardStats, DataResponse, StatsMonths } from '@doctor-tracker/shared';
import { api } from '@/lib/api';

export const statsKeys = {
  all: ['stats'] as const,
  dashboard: (months: StatsMonths) => [...statsKeys.all, months] as const,
};

export const fetchStats = (months: StatsMonths, signal?: AbortSignal) =>
  api<DataResponse<DashboardStats>>(`/stats?months=${months}`, { signal }).then(
    (response) => response.data,
  );
