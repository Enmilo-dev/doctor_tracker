import type { inferParserType } from 'nuqs';
import type {
  DataResponse,
  Paginated,
  Patient,
  PatientInput,
  PatientUpdateInput,
} from '@doctor-tracker/shared';
import { api, toQueryString } from '@/lib/api';
import type { patientSearchParams } from './search-params';

export type PatientListParams = inferParserType<typeof patientSearchParams>;

export const patientKeys = {
  all: ['patients'] as const,
  list: (params: PatientListParams) => [...patientKeys.all, 'list', params] as const,
};

export const fetchPatients = (params: PatientListParams, signal?: AbortSignal) =>
  api<Paginated<Patient>>(`/patients${toQueryString(params)}`, { signal });

export const createPatient = ({ doctorId, input }: { doctorId: string; input: PatientInput }) =>
  api<DataResponse<Patient>>(`/doctors/${doctorId}/patients`, {
    method: 'POST',
    body: JSON.stringify(input),
  }).then((response) => response.data);

export const updatePatient = ({ id, input }: { id: string; input: PatientUpdateInput }) =>
  api<DataResponse<Patient>>(`/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  }).then((response) => response.data);

export const deletePatient = (id: string) => api<void>(`/patients/${id}`, { method: 'DELETE' });
