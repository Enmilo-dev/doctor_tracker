import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import type { DashboardStats, DataResponse } from '@doctor-tracker/shared';
import { statsKeys } from '@/features/dashboard/api';
import { Dashboard } from '@/features/dashboard/dashboard';
import { loadStatsParams } from '@/features/dashboard/search-params';
import { serverApi } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {
  const { months } = await loadStatsParams(searchParams);
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: statsKeys.dashboard(months),
    queryFn: () =>
      serverApi<DataResponse<DashboardStats>>(`/stats?months=${months}`).then(
        (response) => response.data,
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
