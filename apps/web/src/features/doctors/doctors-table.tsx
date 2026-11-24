'use client';

import { SearchX, Stethoscope, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Doctor, DoctorSort } from '@doctor-tracker/shared';
import { DataTable, type Column } from '@/components/data-table/data-table';
import { DateRangeFilter } from '@/components/data-table/date-range-filter';
import { EmptyState } from '@/components/data-table/empty-state';
import { FilterSelect, type FilterOption } from '@/components/data-table/filter-select';
import { SearchInput } from '@/components/data-table/search-input';
import { TablePagination } from '@/components/data-table/table-pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatNumber, initialsOf } from '@/lib/format';
import { SPECIALIZATION_OPTIONS } from '@/lib/labels';
import { useDoctorFilters, useDoctors } from './use-doctors';

const SORT_OPTIONS: readonly FilterOption<DoctorSort>[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A–Z)' },
];

const columns: Column<Doctor>[] = [
  {
    id: 'doctor',
    header: 'Doctor',
    className: 'w-full max-w-0',
    cell: (doctor) => (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
            {initialsOf(doctor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Link
            href={`/doctors/${doctor.id}`}
            className="block truncate font-medium hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            {doctor.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            <span className="@xl:hidden">{doctor.specialization}</span>
            <span className="hidden @xl:inline">{doctor.email}</span>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'specialization',
    header: 'Specialization',
    hideBelow: 'sm',
    cell: (doctor) => <Badge variant="secondary">{doctor.specialization}</Badge>,
  },
  {
    id: 'hospital',
    header: 'Hospital',
    hideBelow: 'md',
    cell: (doctor) => <span className="text-muted-foreground">{doctor.hospital}</span>,
  },
  {
    id: 'phone',
    header: 'Phone',
    hideBelow: 'lg',
    cell: (doctor) => <span className="text-muted-foreground tabular-nums">{doctor.phone}</span>,
  },
  {
    id: 'patients',
    header: 'Patients',
    className: 'text-right',
    cell: (doctor) => (
      <span className="font-medium tabular-nums">{formatNumber(doctor.patientCount)}</span>
    ),
  },
  {
    id: 'joined',
    header: 'Joined',
    hideBelow: 'sm',
    cell: (doctor) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(doctor.createdAt)}
      </span>
    ),
  },
];

export function DoctorsTable() {
  const router = useRouter();
  const [filters, setFilters] = useDoctorFilters();
  const { data, isLoading, isFetching, isError, refetch } = useDoctors();

  const hasFilters = Boolean(
    filters.search || filters.specialization || filters.from || filters.to,
  );

  const resetFilters = () =>
    setFilters({ search: null, specialization: null, from: null, to: null, page: null });

  const empty = hasFilters ? (
    <EmptyState
      icon={SearchX}
      title="No doctors match your filters"
      description="Try a different search term or clear the filters."
      action={
        <Button variant="outline" onClick={resetFilters}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={Stethoscope}
      title="No doctors yet"
      description="Doctors you add will appear here."
    />
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <SearchInput
          className="col-span-2"
          value={filters.search}
          onChange={(search) =>
            setFilters({ search: search || null, page: null }, { history: 'replace' })
          }
          placeholder="Search name, hospital or email"
        />
        <FilterSelect
          label="Specialization"
          allLabel="All specializations"
          value={filters.specialization}
          options={SPECIALIZATION_OPTIONS}
          onChange={(specialization) => setFilters({ specialization, page: null })}
        />
        <FilterSelect
          label="Sort by"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => setFilters({ sort, page: null })}
          className="sm:w-40"
        />
        <DateRangeFilter
          className="col-span-2"
          label="Joined date"
          value={{ from: filters.from, to: filters.to }}
          onChange={({ from, to }) => setFilters({ from, to, page: null })}
        />
        {hasFilters && (
          <Button variant="ghost" onClick={resetFilters} className="col-span-2 sm:col-auto">
            <X />
            Reset
          </Button>
        )}
      </div>

      <DataTable
        caption="Doctors"
        columns={columns}
        rows={data?.data}
        getRowId={(doctor) => doctor.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        empty={empty}
        onRowClick={(doctor) => router.push(`/doctors/${doctor.id}`)}
      />

      <TablePagination
        meta={data?.meta}
        onPageChange={(page, history) => setFilters({ page }, { scroll: true, history })}
        onLimitChange={(limit) => setFilters({ limit, page: null })}
      />
    </div>
  );
}
