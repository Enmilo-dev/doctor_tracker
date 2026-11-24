'use client';

import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import { AdmissionsChart } from './admissions-chart';
import { ConditionBreakdown } from './condition-breakdown';
import { RangeToggle } from './range-toggle';
import { SpecializationChart } from './specialization-chart';
import { StatCards } from './stat-cards';
import { TopDoctorsChart } from './top-doctors-chart';
import { useDashboardStats } from './use-stats';

export function Dashboard() {
  const { stats, isFetching } = useDashboardStats();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Key metrics across doctors and patients."
        actions={<RangeToggle />}
      />
      {stats && (
        <div
          className={cn('space-y-6 transition-opacity', isFetching && 'opacity-60')}
          aria-busy={isFetching}
        >
          <StatCards stats={stats} />
          <AdmissionsChart data={stats.admissionsByMonth} />
          <ConditionBreakdown data={stats.byCondition} total={stats.totals.patients} />
          <div className="grid gap-6 lg:grid-cols-2">
            <TopDoctorsChart data={stats.patientsPerDoctor} />
            <SpecializationChart data={stats.bySpecialization} />
          </div>
        </div>
      )}
    </>
  );
}
