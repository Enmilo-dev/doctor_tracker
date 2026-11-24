'use client';

import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Patient } from '@doctor-tracker/shared';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ApiError } from '@/lib/api';
import { useDeletePatient } from './use-patients';

interface DeletePatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
}

export function DeletePatientDialog({ open, onOpenChange, patient }: DeletePatientDialogProps) {
  const deletePatient = useDeletePatient();

  const confirm = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!patient) return;
    deletePatient.mutate(patient.id, {
      onSuccess: () => {
        toast.success(`${patient.name} removed`);
        onOpenChange(false);
      },
      onError: (error) =>
        toast.error(error instanceof ApiError ? error.message : 'Could not remove the patient'),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {patient?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the patient from {patient?.doctor.name}&apos;s list. This
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePatient.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={confirm}
            disabled={deletePatient.isPending}
          >
            {deletePatient.isPending && <LoaderCircle className="animate-spin" />}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
