'use client';

import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PatientFormDialog } from '@/features/patients/patient-form-dialog';
import { PatientsTable } from '@/features/patients/patients-table';

export function DoctorPatientsSection({ doctorId }: { doctorId: string }) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section className="space-y-4" aria-labelledby="patients-heading">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="patients-heading" className="text-lg font-semibold">
            Patients
          </h2>
          <p className="text-sm text-muted-foreground">Everyone currently under this doctor.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus />
          Add patient
        </Button>
      </div>

      <PatientsTable doctorId={doctorId} />

      <PatientFormDialog open={addOpen} onOpenChange={setAddOpen} doctorId={doctorId} />
    </section>
  );
}
