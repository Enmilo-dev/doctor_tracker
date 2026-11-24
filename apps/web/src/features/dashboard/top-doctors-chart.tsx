'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DashboardStats } from '@doctor-tracker/shared';
import { ChartCard } from '@/components/charts/chart-card';
import { HorizontalBarChart } from '@/components/charts/horizontal-bar-chart';
import { formatNumber, stripTitle } from '@/lib/format';

const MAX_LABEL = 18;

const shortName = (name: string) => {
  const trimmed = stripTitle(name);
  return trimmed.length > MAX_LABEL ? `${trimmed.slice(0, MAX_LABEL - 1)}…` : trimmed;
};

export function TopDoctorsChart({ data }: { data: DashboardStats['patientsPerDoctor'] }) {
  const router = useRouter();
  const rows = data.map((doctor) => ({
    ...doctor,
    key: doctor.doctorId,
    label: shortName(doctor.name),
    value: doctor.count,
  }));
  const busiest = rows[0];

  return (
    <ChartCard
      title="Busiest doctors"
      description={`Top ${rows.length} by number of patients · select a bar to open`}
      summary={
        busiest
          ? `${busiest.name} has the most patients with ${busiest.count}.`
          : 'No doctors with patients yet.'
      }
      table={{
        columns: ['Doctor', 'Specialization', 'Patients'],
        rows: rows.map((row) => ({
          key: row.key,
          cells: [
            <Link key="name" href={`/doctors/${row.doctorId}`} className="hover:underline">
              {row.name}
            </Link>,
            row.specialization,
            formatNumber(row.count),
          ],
        })),
      }}
    >
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No patients yet.</p>
      ) : (
        <HorizontalBarChart
          data={rows}
          onSelect={(row) => router.push(`/doctors/${row.doctorId}`)}
          renderTooltip={(row) => (
            <>
              <p className="font-medium">{row.name}</p>
              <p className="text-muted-foreground">{row.specialization}</p>
              <p className="mt-1">{formatNumber(row.count)} patients</p>
            </>
          )}
        />
      )}
    </ChartCard>
  );
}
