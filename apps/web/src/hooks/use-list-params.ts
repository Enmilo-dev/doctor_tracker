import { useDebouncedValue } from './use-debounced-value';

export function useListParams<T extends { search: string; page: number }>(filters: T): T {
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  return {
    ...filters,
    search: filters.search ? debouncedSearch : '',
    page: Math.max(1, filters.page),
  };
}
