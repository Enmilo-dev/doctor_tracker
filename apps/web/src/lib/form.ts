import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from './api';

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string | null {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';

  let mappedToField = false;
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    const message = messages?.[0];
    if (message) {
      setError(field as Path<T>, { type: 'server', message });
      mappedToField = true;
    }
  }

  return mappedToField ? null : error.message;
}

export const pickDirty = <T extends FieldValues>(values: T, dirtyFields: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(values).filter(([key]) => dirtyFields[key])) as Partial<T>;
