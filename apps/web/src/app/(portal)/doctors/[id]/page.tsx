import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import type { DataResponse, Doctor } from '@doctor-tracker/shared';
import { doctorKeys } from '@/features/doctors/api';
import { DoctorPatientsSection } from '@/features/doctors/doctor-patients-section';
import { DoctorProfile } from '@/features/doctors/doctor-profile';
import { serverApi, ServerApiError } from '@/lib/server-api';

const getDoctor = cache(async (id: string) => {
  try {
    return (await serverApi<DataResponse<Doctor>>(`/doctors/${id}`)).data;
  } catch (error) {
    if (error instanceof ServerApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps<'/doctors/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctor(id);
  return { title: doctor.name };
}

export default async function DoctorPage({ params }: PageProps<'/doctors/[id]'>) {
  const { id } = await params;
  const doctor = await getDoctor(id);
  const queryClient = new QueryClient();
  queryClient.setQueryData(doctorKeys.detail(id), doctor);

  return (
    <>
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All doctors
      </Link>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DoctorProfile doctorId={doctor.id} />
      </HydrationBoundary>
      <DoctorPatientsSection doctorId={doctor.id} />
    </>
  );
}
