'use client';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { statsKeys } from '@/features/dashboard/api';
import { doctorKeys } from '@/features/doctors/api';
import { useListParams } from '@/hooks/use-list-params';
import { createPatient, deletePatient, fetchPatients, patientKeys, updatePatient } from './api';
import { patientSearchParams } from './search-params';

export const usePatientFilters = () => useQueryStates(patientSearchParams, { history: 'push' });

export function usePatients(doctorId?: string) {
  const [filters] = usePatientFilters();
  const params = useListParams({ ...filters, doctor: doctorId ?? filters.doctor });

  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: ({ signal }) => fetchPatients(params, signal),
    placeholderData: keepPreviousData,
  });
}

const invalidateCareData = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: patientKeys.all }),
    queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
    queryClient.invalidateQueries({ queryKey: statsKeys.all }),
  ]);

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => invalidateCareData(queryClient),
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatient,
    onSuccess: () => invalidateCareData(queryClient),
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => invalidateCareData(queryClient),
  });
}
