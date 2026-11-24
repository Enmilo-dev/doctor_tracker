import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { SESSION_COOKIE, type AuthUser, type DataResponse } from '@doctor-tracker/shared';
import { serverApi, ServerApiError } from './server-api';

export const getCurrentUser = cache(async (): Promise<AuthUser> => {
  if (!(await cookies()).has(SESSION_COOKIE)) redirect('/login');

  try {
    return (await serverApi<DataResponse<AuthUser>>('/auth/me')).data;
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 401) redirect('/signout');
    throw error;
  }
});
