'use client';

import { Building2, CalendarDays, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatNumber, initialsOf } from '@/lib/format';
import { useDoctor } from './use-doctors';

export function DoctorProfile({ doctorId }: { doctorId: string }) {
  const { data: doctor } = useDoctor(doctorId);
  if (!doctor) return null;

  const details = [
    { icon: Building2, label: 'Hospital', value: doctor.hospital },
    {
      icon: Phone,
      label: 'Phone',
      value: (
        <a href={`tel:${doctor.phone}`} className="hover:underline">
          {doctor.phone}
        </a>
      ),
    },
    {
      icon: Mail,
      label: 'Email',
      value: (
        <a href={`mailto:${doctor.email}`} className="break-all hover:underline">
          {doctor.email}
        </a>
      ),
    },
    { icon: CalendarDays, label: 'Joined', value: formatDate(doctor.createdAt) },
  ];

  return (
    <section className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initialsOf(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{doctor.name}</h1>
            <Badge variant="secondary">{doctor.specialization}</Badge>
          </div>
        </div>

        <div className="rounded-lg bg-primary/5 px-5 py-3 sm:text-right">
          <p className="text-3xl font-semibold text-primary tabular-nums">
            {formatNumber(doctor.patientCount)}
          </p>
          <p className="text-sm text-muted-foreground">
            {doctor.patientCount === 1 ? 'Patient' : 'Patients'}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex min-w-0 gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
