import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { PatientsTable } from '@/features/patients/patients-table';

export const metadata: Metadata = { title: 'Patients' };

export default function PatientsPage() {
  return (
    <>
      <PageHeader
        title="Patients"
        description="Search, filter and update every patient record across all doctors."
      />
      <PatientsTable />
    </>
  );
}
