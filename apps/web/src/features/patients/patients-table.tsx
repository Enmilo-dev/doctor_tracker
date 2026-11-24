'use client';

import { SearchX, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Patient, PatientSort } from '@doctor-tracker/shared';
import { DataTable, type Column } from '@/components/data-table/data-table';
import { DateRangeFilter } from '@/components/data-table/date-range-filter';
import { EmptyState } from '@/components/data-table/empty-state';
import { FilterSelect, type FilterOption } from '@/components/data-table/filter-select';
import { SearchInput } from '@/components/data-table/search-input';
import { TablePagination } from '@/components/data-table/table-pagination';
import { Button } from '@/components/ui/button';
import { DoctorPicker } from '@/features/doctors/doctor-picker';
import { formatDate } from '@/lib/format';
import { CONDITION_OPTIONS, GENDER_LABELS, GENDER_OPTIONS } from '@/lib/labels';
import { ConditionBadge } from './condition-badge';
import { DeletePatientDialog } from './delete-patient-dialog';
import { PatientFormDialog } from './patient-form-dialog';
import { PatientRowActions } from './patient-row-actions';
import { usePatientFilters, usePatients } from './use-patients';

const SORT_OPTIONS: readonly FilterOption<PatientSort>[] = [
  { value: 'newest', label: 'Recently admitted' },
  { value: 'oldest', label: 'Earliest admitted' },
  { value: 'name', label: 'Name (A–Z)' },
];

const phoneColumn: Column<Patient> = {
  id: 'phone',
  header: 'Phone',
  hideBelow: 'lg',
  cell: (patient) => <span className="text-muted-foreground tabular-nums">{patient.phone}</span>,
};

const doctorColumn: Column<Patient> = {
  id: 'doctor',
  header: 'Doctor',
  hideBelow: 'md',
  cell: (patient) => (
    <div className="min-w-0">
      <Link
        href={`/doctors/${patient.doctor.id}`}
        className="block truncate font-medium hover:underline"
      >
        {patient.doctor.name}
      </Link>
      <p className="truncate text-xs text-muted-foreground">{patient.doctor.specialization}</p>
    </div>
  ),
};

export function PatientsTable({ doctorId }: { doctorId?: string }) {
  const [filters, setFilters] = usePatientFilters();
  const { data, isLoading, isFetching, isError, refetch } = usePatients(doctorId);

  const [editTarget, setEditTarget] = useState<Patient | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openEdit = (patient: Patient) => {
    setEditTarget(patient);
    setEditOpen(true);
  };
  const openDelete = (patient: Patient) => {
    setDeleteTarget(patient);
    setDeleteOpen(true);
  };

  const hasFilters = Boolean(
    filters.search ||
    filters.condition ||
    filters.gender ||
    filters.from ||
    filters.to ||
    (!doctorId && filters.doctor),
  );

  const resetFilters = () =>
    setFilters({
      search: null,
      condition: null,
      gender: null,
      from: null,
      to: null,
      doctor: null,
      page: null,
    });

  const columns: Column<Patient>[] = [
    {
      id: 'patient',
      header: 'Patient',
      className: 'w-full max-w-0',
      cell: (patient) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{patient.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {patient.age} {patient.age === 1 ? 'yr' : 'yrs'} · {GENDER_LABELS[patient.gender]}
            <span className={doctorId ? '@3xl:hidden' : '@5xl:hidden'}> · {patient.diagnosis}</span>
          </p>
        </div>
      ),
    },
    {
      id: 'condition',
      header: 'Condition',
      cell: (patient) => <ConditionBadge condition={patient.condition} />,
    },
    {
      id: 'diagnosis',
      header: 'Diagnosis',
      hideBelow: doctorId ? 'md' : 'lg',
      cell: (patient) => <span className="text-muted-foreground">{patient.diagnosis}</span>,
    },
    doctorId ? phoneColumn : doctorColumn,
    {
      id: 'admitted',
      header: 'Admitted',
      hideBelow: 'sm',
      cell: (patient) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDate(patient.admittedAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'w-12 text-right',
      cell: (patient) => (
        <PatientRowActions patient={patient} onEdit={openEdit} onDelete={openDelete} />
      ),
    },
  ];

  const empty = hasFilters ? (
    <EmptyState
      icon={SearchX}
      title="No patients match your filters"
      description="Try a different search term or clear the filters."
      action={
        <Button variant="outline" onClick={resetFilters}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={UserRound}
      title="No patients yet"
      description={
        doctorId
          ? 'Patients added under this doctor will appear here.'
          : 'Patients will appear here once they are added under a doctor.'
      }
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
          placeholder="Search name, diagnosis or email"
        />
        <FilterSelect
          label="Condition"
          allLabel="All conditions"
          value={filters.condition}
          options={CONDITION_OPTIONS}
          onChange={(condition) => setFilters({ condition, page: null })}
          className="sm:w-40"
        />
        <FilterSelect
          label="Gender"
          allLabel="All genders"
          value={filters.gender}
          options={GENDER_OPTIONS}
          onChange={(gender) => setFilters({ gender, page: null })}
          className="sm:w-36"
        />
        {!doctorId && (
          <DoctorPicker
            value={filters.doctor}
            onChange={(doctor) => setFilters({ doctor, page: null })}
            placeholder="All doctors"
            clearLabel="All doctors"
            aria-label="Doctor"
            className="col-span-2 sm:col-auto sm:w-56"
          />
        )}
        <FilterSelect
          label="Sort by"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => setFilters({ sort, page: null })}
        />
        <DateRangeFilter
          className="col-span-2"
          label="Admitted date"
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
        caption="Patients"
        columns={columns}
        rows={data?.data}
        getRowId={(patient) => patient.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        empty={empty}
      />

      <TablePagination
        meta={data?.meta}
        onPageChange={(page, history) => setFilters({ page }, { scroll: true, history })}
        onLimitChange={(limit) => setFilters({ limit, page: null })}
      />

      <PatientFormDialog open={editOpen} onOpenChange={setEditOpen} patient={editTarget} />
      <DeletePatientDialog open={deleteOpen} onOpenChange={setDeleteOpen} patient={deleteTarget} />
    </div>
  );
}
