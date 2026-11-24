'use client';

import { keepPreviousData, skipToken, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import type { Doctor } from '@doctor-tracker/shared';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { cn } from '@/lib/utils';
import { doctorKeys, fetchDoctor, fetchDoctors, type DoctorListParams } from './api';

const PICKER_PARAMS: Partial<DoctorListParams> = { sort: 'name', limit: 10 };

interface DoctorPickerProps {
  value: string | null;
  onChange: (doctorId: string | null) => void;
  placeholder: string;
  clearLabel?: string;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function DoctorPicker({
  value,
  onChange,
  placeholder,
  clearLabel,
  id,
  invalid,
  disabled,
  className,
  'aria-label': ariaLabel,
}: DoctorPickerProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 250);
  const params = { ...PICKER_PARAMS, search: debouncedSearch };

  const results = useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: ({ signal }) => fetchDoctors(params, signal),
    placeholderData: keepPreviousData,
    enabled: open,
  });

  const selected = useQuery({
    queryKey: doctorKeys.detail(value ?? ''),
    queryFn: value ? ({ signal }) => fetchDoctor(value, signal) : skipToken,
    staleTime: 5 * 60_000,
  });

  const select = (doctor: Doctor | null) => {
    if (doctor) queryClient.setQueryData(doctorKeys.detail(doctor.id), doctor);
    onChange(doctor?.id ?? null);
    setOpen(false);
    setSearch('');
  };

  const label = value
    ? (selected.data?.name ?? (selected.isError ? 'Unknown doctor' : 'Loading…'))
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          aria-label={ariaLabel ? `${ariaLabel}: ${label}` : undefined}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search doctors…" value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{results.isFetching ? 'Searching…' : 'No doctors found.'}</CommandEmpty>
            <CommandGroup>
              {clearLabel && value && (
                <CommandItem value="__clear__" onSelect={() => select(null)}>
                  <span className="text-muted-foreground">{clearLabel}</span>
                </CommandItem>
              )}
              {results.data?.data.map((doctor) => (
                <CommandItem key={doctor.id} value={doctor.id} onSelect={() => select(doctor)}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{doctor.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doctor.specialization} · {doctor.hospital}
                    </p>
                  </div>
                  <Check
                    className={cn('ml-auto', doctor.id === value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
