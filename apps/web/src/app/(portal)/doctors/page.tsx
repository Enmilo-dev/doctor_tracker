import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { AddDoctorDialog } from '@/features/doctors/add-doctor-dialog';
import { DoctorsTable } from '@/features/doctors/doctors-table';

export const metadata: Metadata = { title: 'Doctors' };

export default function DoctorsPage() {
  return (
    <>
      <PageHeader
        title="Doctors"
        description="Search, filter and manage every doctor in your network."
        actions={<AddDoctorDialog />}
      />
      <DoctorsTable />
    </>
  );
}
