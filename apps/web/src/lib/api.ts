import type { ApiErrorBody } from '@doctor-tracker/shared';

type FieldErrors = Record<string, string[] | undefined>;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors: FieldErrors = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const toQueryString = (params: object) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
};

const extractFieldErrors = (details: unknown): FieldErrors =>
  typeof details === 'object' && details !== null && 'fieldErrors' in details
    ? (details.fieldErrors as FieldErrors)
    : {};

const redirectToLogin = () => {
  const signoutUrl = new URL('/signout', window.location.origin);
  signoutUrl.searchParams.set('next', window.location.pathname + window.location.search);
  window.location.replace(signoutUrl.href);
};

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init.headers },
  });

  if (response.status === 401 && !path.startsWith('/auth/')) {
    redirectToLogin();
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      response.status,
      body?.error.code ?? 'NETWORK_ERROR',
      body?.error.message ?? 'Something went wrong. Please try again.',
      extractFieldErrors(body?.error.details),
    );
  }

  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}
