'use client';

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';

interface BarDatum {
  key: string;
  label: string;
  value: number;
}

interface HorizontalBarChartProps<T extends BarDatum> {
  data: T[];
  renderTooltip: (datum: T) => React.ReactNode;
  onSelect?: (datum: T) => void;
}

const ROW_HEIGHT = 32;

const config = { value: { label: 'Patients', color: 'var(--chart-1)' } } satisfies ChartConfig;

interface TickProps {
  x?: number | string;
  y?: number | string;
  payload?: { value: string };
}

const CategoryTick = ({ x, y, payload }: TickProps) => (
  <text
    x={Number(x) - 8}
    y={Number(y)}
    dy={4}
    textAnchor="end"
    className="fill-muted-foreground text-xs"
  >
    {payload?.value}
  </text>
);

export function HorizontalBarChart<T extends BarDatum>({
  data,
  renderTooltip,
  onSelect,
}: HorizontalBarChartProps<T>) {
  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: data.length * ROW_HEIGHT + 8 }}
    >
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={128}
          interval={0}
          tick={<CategoryTick />}
        />
        <ChartTooltip
          cursor={{ fill: 'var(--muted)', opacity: 0.6 }}
          content={({ active, payload }) => {
            const datum = payload?.[0]?.payload as T | undefined;
            if (!active || !datum) return null;
            return (
              <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl">
                {renderTooltip(datum)}
              </div>
            );
          }}
        />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[0, 4, 4, 0]}
          maxBarSize={20}
          isAnimationActive={false}
          className={onSelect ? 'cursor-pointer' : undefined}
          onClick={onSelect ? (entry) => onSelect(entry.payload as T) : undefined}
        >
          <LabelList
            dataKey="value"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
