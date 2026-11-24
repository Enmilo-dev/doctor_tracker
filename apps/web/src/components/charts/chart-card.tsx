'use client';

import { BarChart3, Table2 } from 'lucide-react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface ChartTable {
  columns: string[];
  rows: { key: string; cells: React.ReactNode[] }[];
}

interface ChartCardProps {
  title: string;
  description?: string;
  summary: string;
  table: ChartTable;
  children: React.ReactNode;
}

export function ChartCard({ title, description, summary, table, children }: ChartCardProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart');

  return (
    <figure className="flex flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h2 className="font-medium">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={view}
          onValueChange={(next) => next && setView(next as 'chart' | 'table')}
          aria-label={`${title} view`}
        >
          <ToggleGroupItem value="chart" aria-label="Chart view">
            <BarChart3 />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <Table2 />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <figcaption className="sr-only">{summary}</figcaption>

      {view === 'chart' ? (
        <div className="flex-1">{children}</div>
      ) : (
        <div className="max-h-80 overflow-auto rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                {table.columns.map((column, index) => (
                  <TableHead key={column} className={cn('px-3', index > 0 && 'text-right')}>
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row) => (
                <TableRow key={row.key}>
                  {row.cells.map((cell, index) => (
                    <TableCell
                      key={index}
                      className={cn('px-3', index > 0 && 'text-right tabular-nums')}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </figure>
  );
}
