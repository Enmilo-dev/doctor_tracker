'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { doctorCreateSchema, type DoctorInput } from '@doctor-tracker/shared';
import { FormAlert } from '@/components/form/form-alert';
import { SelectField } from '@/components/form/select-field';
import { SubmitButton } from '@/components/form/submit-button';
import { TextField } from '@/components/form/text-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { applyServerErrors } from '@/lib/form';
import { SPECIALIZATION_OPTIONS } from '@/lib/labels';
import { useCreateDoctor } from './use-doctors';

export function AddDoctorDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add doctor</DialogTitle>
          <DialogDescription>Create a doctor profile. All fields are required.</DialogDescription>
        </DialogHeader>
        <DoctorForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function DoctorForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const createDoctor = useCreateDoctor();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DoctorInput>({
    resolver: zodResolver(doctorCreateSchema),
    defaultValues: { name: '', hospital: '', phone: '', email: '' },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    createDoctor.mutate(values, {
      onSuccess: (doctor) => {
        toast.success(`${doctor.name} added`, {
          action: { label: 'View', onClick: () => router.push(`/doctors/${doctor.id}`) },
        });
        onDone();
      },
      onError: (error) => setFormError(applyServerErrors(error, setError)),
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormAlert message={formError} />

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="name"
          label="Full name"
          placeholder="Dr. Farzana Chowdhury"
          autoComplete="off"
          error={errors.name}
          fieldClassName="sm:col-span-2"
          {...register('name')}
        />
        <SelectField
          control={control}
          name="specialization"
          label="Specialization"
          placeholder="Select specialization"
          options={SPECIALIZATION_OPTIONS}
        />
        <TextField
          id="hospital"
          label="Hospital"
          placeholder="Square Hospitals Ltd."
          error={errors.hospital}
          {...register('hospital')}
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          placeholder="+880 1712-345678"
          error={errors.phone}
          {...register('phone')}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="farzana.chowdhury@squarehospital.com"
          error={errors.email}
          {...register('email')}
        />
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={createDoctor.isPending}>
            Cancel
          </Button>
        </DialogClose>
        <SubmitButton pending={createDoctor.isPending} pendingLabel="Saving…">
          Add doctor
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}
