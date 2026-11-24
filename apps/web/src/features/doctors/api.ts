import type { inferParserType } from 'nuqs';
import type { DataResponse, Doctor, DoctorInput, Paginated } from '@doctor-tracker/shared';
import { api, toQueryString } from '@/lib/api';
import type { doctorSearchParams } from './search-params';

export type DoctorListParams = inferParserType<typeof doctorSearchParams>;

export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params: Partial<DoctorListParams>) => [...doctorKeys.lists(), params] as const,
  detail: (id: string) => [...doctorKeys.all, 'detail', id] as const,
};

export const fetchDoctors = (params: Partial<DoctorListParams>, signal?: AbortSignal) =>
  api<Paginated<Doctor>>(`/doctors${toQueryString(params)}`, { signal });

export const fetchDoctor = (id: string, signal?: AbortSignal) =>
  api<DataResponse<Doctor>>(`/doctors/${id}`, { signal }).then((response) => response.data);

export const createDoctor = (input: DoctorInput) =>
  api<DataResponse<Doctor>>('/doctors', { method: 'POST', body: JSON.stringify(input) }).then(
    (response) => response.data,
  );
