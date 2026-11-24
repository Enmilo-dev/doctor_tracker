'use client';

import { parseISO, startOfYear, subDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDate, toDateParam } from '@/lib/format';
import { cn } from '@/lib/utils';

interface DateRangeValue {
  from: string | null;
  to: string | null;
}

interface DateRangeFilterProps {
  label: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
}

const PRESETS = [
  { label: 'Last 7 days', from: () => subDays(new Date(), 6) },
  { label: 'Last 30 days', from: () => subDays(new Date(), 29) },
  { label: 'Last 90 days', from: () => subDays(new Date(), 89) },
  { label: 'This year', from: () => startOfYear(new Date()) },
];

const describe = ({ from, to }: DateRangeValue) => {
  if (from && to) return `${formatDate(from)} – ${formatDate(to)}`;
  if (from) return `From ${formatDate(from)}`;
  if (to) return `Until ${formatDate(to)}`;
  return null;
};

export function DateRangeFilter({ label, value, onChange, className }: DateRangeFilterProps) {
  const isMobile = useIsMobile();
  const summary = describe(value);
  const selected: DateRange | undefined = value.from
    ? { from: parseISO(value.from), to: value.to ? parseISO(value.to) : undefined }
    : undefined;

  const handleSelect = (range: DateRange | undefined) =>
    onChange({
      from: range?.from ? toDateParam(range.from) : null,
      to: range?.to ? toDateParam(range.to) : null,
    });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start font-normal sm:w-auto',
            !summary && 'text-muted-foreground',
            className,
          )}
          aria-label={summary ? `${label}: ${summary}` : label}
        >
          <CalendarDays />
          {summary ?? label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-wrap gap-1 border-b p-2 sm:w-36 sm:flex-col sm:border-r sm:border-b-0">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() =>
                  onChange({ from: toDateParam(preset.from()), to: toDateParam(new Date()) })
                }
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-muted-foreground"
              onClick={() => onChange({ from: null, to: null })}
              disabled={!value.from && !value.to}
            >
              Clear
            </Button>
          </div>
          <Calendar
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={isMobile ? 1 : 2}
            defaultMonth={selected?.from ?? subDays(new Date(), 30)}
            disabled={{ after: new Date() }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
