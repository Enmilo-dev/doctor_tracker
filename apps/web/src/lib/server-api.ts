import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@doctor-tracker/shared';

export class ServerApiError extends Error {
  constructor(public readonly status: number) {
    super(`API responded with ${status}`);
    this.name = 'ServerApiError';
  }
}

export async function serverApi<T>(path: string): Promise<T> {
  const session = (await cookies()).get(SESSION_COOKIE);

  const response = await fetch(`${process.env.API_URL}/api${path}`, {
    headers: session ? { cookie: `${SESSION_COOKIE}=${session.value}` } : {},
  });

  if (!response.ok) throw new ServerApiError(response.status);
  return (await response.json()) as T;
}
