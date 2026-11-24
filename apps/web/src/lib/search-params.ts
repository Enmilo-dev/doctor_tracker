import { createParser, parseAsInteger, parseAsNumberLiteral } from 'nuqs';
import { z } from 'zod';

export const PAGE_SIZES = [10, 20, 50] as const;

export const parseAsDateParam = createParser({
  parse: (value: string) => (z.iso.date().safeParse(value).success ? value : null),
  serialize: (value: string) => value,
});

export const paginationParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsNumberLiteral(PAGE_SIZES).withDefault(10),
};
