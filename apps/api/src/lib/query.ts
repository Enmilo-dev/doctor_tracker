import type { Paginated } from '@doctor-tracker/shared';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (date: string) => new Date(`${date}T00:00:00.000Z`);

export const dateRangeFilter = (from?: string, to?: string) => ({
  ...(from && { $gte: startOfUtcDay(from) }),
  ...(to && { $lt: new Date(startOfUtcDay(to).getTime() + DAY_MS) }),
});

export async function paginate<T>(
  items: PromiseLike<T[]>,
  total: PromiseLike<number>,
  { page, limit }: { page: number; limit: number },
): Promise<Paginated<T>> {
  const [data, count] = await Promise.all([items, total]);
  return { data, meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
}
