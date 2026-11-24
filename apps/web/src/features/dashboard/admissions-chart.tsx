'use client';

import { format, parseISO } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { DashboardStats } from '@doctor-tracker/shared';
import { ChartCard } from '@/components/charts/chart-card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatNumber } from '@/lib/format';

const config = { count: { label: 'Admissions', color: 'var(--chart-1)' } } satisfies ChartConfig;

const monthShort = (month: string) => format(parseISO(`${month}-01`), 'MMM');
const monthLong = (month: string) => format(parseISO(`${month}-01`), 'MMMM yyyy');

interface PointProps {
  cx?: number;
  cy?: number;
  index?: number;
  value?: number | number[];
}

interface AdmissionsChartProps {
  data: DashboardStats['admissionsByMonth'];
}

export function AdmissionsChart({ data }: AdmissionsChartProps) {
  const total = data.reduce((sum, row) => sum + row.count, 0);
  const first = data[0];
  const last = data.at(-1);
  const lastIndex = data.length - 1;

  const renderEndPoint = ({ cx, cy, index, value }: PointProps) => {
    if (index !== lastIndex || cx === undefined || cy === undefined) return <g key={index} />;
    const count = Array.isArray(value) ? value[1] : value;
    return (
      <g key={index}>
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--color-count)"
          stroke="var(--card)"
          strokeWidth={2}
        />
        <text x={cx} y={cy - 12} textAnchor="end" className="fill-foreground text-xs font-medium">
          {formatNumber(count ?? 0)}
        </text>
      </g>
    );
  };

  return (
    <ChartCard
      title="Admissions over time"
      description={`${formatNumber(total)} admissions in the last ${data.length} months`}
      summary={
        first && last
          ? `Monthly admissions went from ${first.count} in ${monthLong(first.month)} to ${last.count} in ${monthLong(last.month)}.`
          : 'No admissions recorded.'
      }
      table={{
        columns: ['Month', 'Admissions'],
        rows: data.map((row) => ({
          key: row.month,
          cells: [monthLong(row.month), formatNumber(row.count)],
        })),
      }}
    >
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <AreaChart data={data} margin={{ top: 24, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
            tickFormatter={monthShort}
          />
          <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(value) => monthLong(String(value))}
              />
            }
          />
          <Area
            dataKey="count"
            type="monotone"
            stroke="var(--color-count)"
            strokeWidth={2}
            fill="var(--color-count)"
            fillOpacity={0.1}
            dot={renderEndPoint}
            activeDot={{ r: 5, fill: 'var(--color-count)', stroke: 'var(--card)', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
