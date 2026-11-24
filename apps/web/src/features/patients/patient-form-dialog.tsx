'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { objectIdSchema, patientCreateSchema, type Patient } from '@doctor-tracker/shared';
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
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { DoctorPicker } from '@/features/doctors/doctor-picker';
import { applyServerErrors, pickDirty } from '@/lib/form';
import { toDateParam } from '@/lib/format';
import { CONDITION_OPTIONS, GENDER_OPTIONS } from '@/lib/labels';
import { useCreatePatient, useUpdatePatient } from './use-patients';

const patientFormSchema = patientCreateSchema.extend({
  doctor: objectIdSchema.optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId?: string;
  patient?: Patient | null;
}

export function PatientFormDialog({
  open,
  onOpenChange,
  doctorId,
  patient,
}: PatientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{patient ? 'Edit patient' : 'Add patient'}</DialogTitle>
          <DialogDescription>
            {patient
              ? `Update ${patient.name}'s details.`
              : 'Register a new patient under this doctor.'}
          </DialogDescription>
        </DialogHeader>
        <PatientForm
          key={patient?.id ?? 'new'}
          doctorId={doctorId}
          patient={patient ?? undefined}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface PatientFormProps {
  doctorId?: string;
  patient?: Patient;
  onDone: () => void;
}

function PatientForm({ doctorId, patient, onDone }: PatientFormProps) {
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const [formError, setFormError] = useState<string | null>(null);
  const pending = createPatient.isPending || updatePatient.isPending;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patient
      ? {
          doctor: patient.doctor.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          condition: patient.condition,
          diagnosis: patient.diagnosis,
          admittedAt: patient.admittedAt,
        }
      : {
          name: '',
          phone: '',
          diagnosis: '',
          condition: 'stable',
          admittedAt: toDateParam(new Date()),
        },
  });

  const handleSuccess = (saved: Patient) => {
    if (!patient) toast.success(`${saved.name} added`);
    else if (saved.doctor.id !== patient.doctor.id) {
      toast.success(`${saved.name} moved to ${saved.doctor.name}`);
    } else toast.success(`${saved.name} updated`);
    onDone();
  };
  const handleError = (error: unknown) => setFormError(applyServerErrors(error, setError));

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    if (!patient) {
      if (!doctorId) return;
      createPatient.mutate(
        { doctorId, input: values },
        { onSuccess: handleSuccess, onError: handleError },
      );
      return;
    }

    const changes = pickDirty(values, dirtyFields);
    if (Object.keys(changes).length === 0) return onDone();
    if ('email' in changes) changes.email = values.email ?? '';

    updatePatient.mutate(
      { id: patient.id, input: changes },
      { onSuccess: handleSuccess, onError: handleError },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormAlert message={formError} />

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        {patient && (
          <Controller
            control={control}
            name="doctor"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                <FieldLabel htmlFor="doctor">Doctor</FieldLabel>
                <DoctorPicker
                  id="doctor"
                  value={field.value ?? null}
                  onChange={(doctorId) => field.onChange(doctorId ?? undefined)}
                  placeholder="Select doctor"
                  invalid={fieldState.invalid}
                  disabled={pending}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        )}
        <TextField
          id="name"
          label="Full name"
          placeholder="Ayesha Rahman"
          autoComplete="off"
          error={errors.name}
          fieldClassName="sm:col-span-2"
          {...register('name')}
        />
        <TextField
          id="age"
          label="Age"
          type="number"
          inputMode="numeric"
          min={0}
          max={130}
          error={errors.age}
          {...register('age', { valueAsNumber: true })}
        />
        <SelectField
          control={control}
          name="gender"
          label="Gender"
          placeholder="Select gender"
          options={GENDER_OPTIONS}
        />
        <SelectField
          control={control}
          name="condition"
          label="Condition"
          placeholder="Select condition"
          options={CONDITION_OPTIONS}
        />
        <TextField
          id="admittedAt"
          label="Admitted on"
          type="date"
          max={toDateParam(new Date())}
          error={errors.admittedAt}
          {...register('admittedAt')}
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
          label="Email (optional)"
          type="email"
          placeholder="ayesha.rahman@gmail.com"
          error={errors.email}
          {...register('email', {
            setValueAs: (value: string) => (value?.trim() ? value : undefined),
          })}
        />
        <TextField
          id="diagnosis"
          label="Diagnosis"
          placeholder="e.g. Hypertension"
          error={errors.diagnosis}
          fieldClassName="sm:col-span-2"
          {...register('diagnosis')}
        />
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={pending}>
            Cancel
          </Button>
        </DialogClose>
        <SubmitButton pending={pending} pendingLabel="Saving…">
          {patient ? 'Save changes' : 'Add patient'}
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}
