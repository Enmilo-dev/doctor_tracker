import { format, parseISO } from 'date-fns';

const numberFormatter = new Intl.NumberFormat('en-US');

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatDate = (value: string) => format(parseISO(value.slice(0, 10)), 'MMM d, yyyy');

export const toDateParam = (date: Date) => format(date, 'yyyy-MM-dd');

export const stripTitle = (name: string) => name.replace(/^Dr\.?\s+/i, '');

export const initialsOf = (name: string) =>
  stripTitle(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
