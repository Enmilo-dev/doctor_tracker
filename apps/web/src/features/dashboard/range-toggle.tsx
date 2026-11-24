'use client';

import { STATS_MONTHS } from '@doctor-tracker/shared';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useStatsRange } from './use-stats';

export function RangeToggle() {
  const [{ months }, setRange] = useStatsRange();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Trend range</span>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={String(months)}
        onValueChange={(value) => value && setRange({ months: Number(value) as typeof months })}
        aria-label="Admissions trend range"
      >
        {STATS_MONTHS.map((option) => (
          <ToggleGroupItem key={option} value={String(option)} className="px-3">
            {option}M
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
