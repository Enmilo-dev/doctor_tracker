const MAX_SEARCH_TOKENS = 5;

export const tokenize = (...values: (string | null | undefined)[]) => [
  ...new Set(
    values
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  ),
];

export const prefixMatchers = (search: string) =>
  tokenize(search)
    .slice(0, MAX_SEARCH_TOKENS)
    .map((token) => new RegExp(`^${token}`));
