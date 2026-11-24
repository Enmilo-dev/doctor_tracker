'use client';

import { CircleAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { EmptyState } from './empty-state';

const HIDE_BELOW = {
  sm: 'hidden @xl:table-cell',
  md: 'hidden @3xl:table-cell',
  lg: 'hidden @5xl:table-cell',
} as const;

const SKELETON_ROWS = 8;

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  hideBelow?: keyof typeof HIDE_BELOW;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  caption: string;
  isLoading: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  empty: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  isLoading,
  isFetching = false,
  isError = false,
  onRetry,
  empty,
  onRowClick,
}: DataTableProps<T>) {
  const cellClass = (column: Column<T>) =>
    cn(column.hideBelow && HIDE_BELOW[column.hideBelow], column.className);

  if (isError) {
    return (
      <div className="rounded-xl border bg-card">
        <EmptyState
          icon={CircleAlert}
          title={`Couldn't load ${caption.toLowerCase()}`}
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={onRetry}>
              <RotateCcw />
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!isLoading && rows?.length === 0) {
    return <div className="rounded-xl border bg-card">{empty}</div>;
  }

  return (
    <div
      className={cn(
        '@container overflow-hidden rounded-xl border bg-card transition-opacity',
        isFetching && !isLoading && 'opacity-60',
      )}
      aria-busy={isLoading || isFetching}
    >
      <Table>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.id} className={cn('h-10 px-4', cellClass(column))}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  {columns.map((column) => (
                    <TableCell key={column.id} className={cn('px-4 py-3', cellClass(column))}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows?.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  className={cn(onRowClick && 'cursor-pointer')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} className={cn('px-4 py-3', cellClass(column))}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
