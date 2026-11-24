'use client';

import type { DashboardStats } from '@doctor-tracker/shared';
import { ChartCard } from '@/components/charts/chart-card';
import { HorizontalBarChart } from '@/components/charts/horizontal-bar-chart';
import { formatNumber } from '@/lib/format';

export function SpecializationChart({ data }: { data: DashboardStats['bySpecialization'] }) {
  const rows = data
    .filter((row) => row.doctors > 0 || row.patients > 0)
    .map((row) => ({
      ...row,
      key: row.specialization,
      label: row.specialization,
      value: row.patients,
      average: row.doctors ? Math.round(row.patients / row.doctors) : 0,
    }));
  const top = rows[0];

  return (
    <ChartCard
      title="Patients by specialization"
      description="Where demand is concentrated"
      summary={
        top
          ? `${top.specialization} has the most patients with ${top.patients} across ${top.doctors} doctors.`
          : 'No specializations yet.'
      }
      table={{
        columns: ['Specialization', 'Doctors', 'Patients', 'Per doctor'],
        rows: rows.map((row) => ({
          key: row.key,
          cells: [
            row.specialization,
            formatNumber(row.doctors),
            formatNumber(row.patients),
            formatNumber(row.average),
          ],
        })),
      }}
    >
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <HorizontalBarChart
          data={rows}
          renderTooltip={(row) => (
            <>
              <p className="font-medium">{row.specialization}</p>
              <p className="mt-1">{formatNumber(row.patients)} patients</p>
              <p className="text-muted-foreground">
                {row.doctors} doctors · {row.average} per doctor
              </p>
            </>
          )}
        />
      )}
    </ChartCard>
  );
}
