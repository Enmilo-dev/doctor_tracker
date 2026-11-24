'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect } from 'react';
import type { PaginationMeta } from '@doctor-tracker/shared';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatNumber } from '@/lib/format';
import { PAGE_SIZES } from '@/lib/search-params';

interface TablePaginationProps {
  meta: PaginationMeta | undefined;
  onPageChange: (page: number, history?: 'push' | 'replace') => void;
  onLimitChange: (limit: (typeof PAGE_SIZES)[number]) => void;
}

export function TablePagination({ meta, onPageChange, onLimitChange }: TablePaginationProps) {
  useEffect(() => {
    if (meta && meta.totalPages > 0 && meta.page > meta.totalPages) {
      onPageChange(meta.totalPages, 'replace');
    }
  }, [meta, onPageChange]);

  if (!meta) return null;

  const { page, limit, total, totalPages } = meta;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 text-sm sm:flex-row">
      <p className="text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-foreground">{formatNumber(start)}</span>–
        <span className="font-medium text-foreground">{formatNumber(end)}</span> of{' '}
        <span className="font-medium text-foreground">{formatNumber(total)}</span>
      </p>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-muted-foreground">Rows</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => onLimitChange(Number(value) as (typeof PAGE_SIZES)[number])}
          >
            <SelectTrigger size="sm" className="w-18" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-muted-foreground tabular-nums">
          Page {formatNumber(Math.min(page, Math.max(totalPages, 1)))} of{' '}
          {formatNumber(Math.max(totalPages, 1))}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(1)}
            disabled={isFirst}
            aria-label="First page"
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={isFirst}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={isLast}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(totalPages)}
            disabled={isLast}
            aria-label="Last page"
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
