'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { statsKeys } from '@/features/dashboard/api';
import { useListParams } from '@/hooks/use-list-params';
import { createDoctor, doctorKeys, fetchDoctor, fetchDoctors } from './api';
import { doctorSearchParams } from './search-params';

export const useDoctorFilters = () => useQueryStates(doctorSearchParams, { history: 'push' });

export function useDoctors() {
  const [filters] = useDoctorFilters();
  const params = useListParams(filters);

  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: ({ signal }) => fetchDoctors(params, signal),
    placeholderData: keepPreviousData,
  });
}

export const useDoctor = (id: string) =>
  useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: ({ signal }) => fetchDoctor(id, signal),
  });

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDoctor,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: statsKeys.all }),
      ]),
  });
}
