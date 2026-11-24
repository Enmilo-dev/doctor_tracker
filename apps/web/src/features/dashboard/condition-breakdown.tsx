'use client';

import type { DashboardStats } from '@doctor-tracker/shared';
import { ChartCard } from '@/components/charts/chart-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/format';
import { CONDITION_LABELS, CONDITION_STYLES } from '@/lib/labels';
import { cn } from '@/lib/utils';

const MIN_SHARE_FOR_LABEL = 0.08;

interface ConditionBreakdownProps {
  data: DashboardStats['byCondition'];
  total: number;
}

export function ConditionBreakdown({ data, total }: ConditionBreakdownProps) {
  const rows = data.map((row) => {
    const share = total ? row.count / total : 0;
    return {
      ...row,
      label: CONDITION_LABELS[row.condition],
      share,
      percent: Math.round(share * 100),
    };
  });

  return (
    <ChartCard
      title="Patients by condition"
      description={`Share of all ${formatNumber(total)} patients`}
      summary={rows.map((row) => `${row.label} ${row.percent}%`).join(', ')}
      table={{
        columns: ['Condition', 'Patients', 'Share'],
        rows: rows.map((row) => ({
          key: row.condition,
          cells: [row.label, formatNumber(row.count), `${row.percent}%`],
        })),
      }}
    >
      {total === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No patients yet.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex h-7 w-full gap-0.5">
            {rows
              .filter((row) => row.count > 0)
              .map((row) => (
                <Tooltip key={row.condition}>
                  <TooltipTrigger asChild>
                    <div
                      tabIndex={0}
                      aria-label={`${row.label}: ${formatNumber(row.count)} patients, ${row.percent}%`}
                      className={cn(
                        'flex min-w-0 items-center rounded-[4px] px-2 text-xs font-medium text-white outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        CONDITION_STYLES[row.condition].dot,
                      )}
                      style={{ flexGrow: row.count, flexBasis: 0 }}
                    >
                      {row.share >= MIN_SHARE_FOR_LABEL && `${row.percent}%`}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {row.label} · {formatNumber(row.count)} patients ({row.percent}%)
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {rows.map((row) => (
              <li key={row.condition} className="flex items-center gap-2">
                <span
                  className={cn('size-2.5 rounded-full', CONDITION_STYLES[row.condition].dot)}
                  aria-hidden
                />
                <span>{row.label}</span>
                <span className="text-muted-foreground">{formatNumber(row.count)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}
