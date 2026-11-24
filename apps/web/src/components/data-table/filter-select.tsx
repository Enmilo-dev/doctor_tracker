'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = '__all__';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterSelectProps<T extends string> {
  label: string;
  value: T | null;
  options: readonly FilterOption<T>[];
  onChange: (value: T | null) => void;
  allLabel?: string;
  className?: string;
}

export function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  allLabel,
  className,
}: FilterSelectProps<T>) {
  return (
    <Select
      value={value ?? ALL}
      onValueChange={(next) => onChange(next === ALL ? null : (next as T))}
    >
      <SelectTrigger className={cn('w-full sm:w-44', className)} aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
