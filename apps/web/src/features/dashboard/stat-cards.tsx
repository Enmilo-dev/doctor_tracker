import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarPlus,
  Stethoscope,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardStats } from '@doctor-tracker/shared';
import { formatNumber } from '@/lib/format';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  detail: React.ReactNode;
}

function StatCard({ label, value, icon: Icon, detail }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{formatNumber(value)}</p>
      <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
    </div>
  );
}

const percentChange = (current: number, previous: number) =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

export function StatCards({ stats }: { stats: DashboardStats }) {
  const { totals, bySpecialization } = stats;
  const activeSpecializations = bySpecialization.filter((row) => row.doctors > 0).length;
  const criticalShare = totals.patients ? Math.round((totals.critical / totals.patients) * 100) : 0;
  const change = percentChange(totals.admittedThisMonth, totals.admittedLastMonth);
  const TrendIcon = change !== null && change < 0 ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total doctors"
        value={totals.doctors}
        icon={Stethoscope}
        detail={`Across ${activeSpecializations} specializations`}
      />
      <StatCard
        label="Total patients"
        value={totals.patients}
        icon={Users}
        detail={`${formatNumber(Math.round(totals.patients / Math.max(totals.doctors, 1)))} per doctor on average`}
      />
      <StatCard
        label="Critical patients"
        value={totals.critical}
        icon={TriangleAlert}
        detail={
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-condition-critical" aria-hidden />
            {criticalShare}% of all patients
          </span>
        }
      />
      <StatCard
        label="Admitted this month"
        value={totals.admittedThisMonth}
        icon={CalendarPlus}
        detail={
          change === null ? (
            'No admissions in the same period last month'
          ) : (
            <span className="inline-flex items-center gap-1">
              <TrendIcon className="size-4" />
              <span className="sr-only">{change < 0 ? 'Down ' : 'Up '}</span>
              {Math.abs(change)}% vs same period last month
            </span>
          )
        }
      />
    </div>
  );
}
