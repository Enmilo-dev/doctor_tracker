'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { AuthUser, DataResponse, LoginInput } from '@doctor-tracker/shared';
import { api } from '@/lib/api';

export const useLogin = () =>
  useMutation({
    mutationFn: (input: LoginInput) =>
      api<DataResponse<AuthUser>>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  });

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api<void>('/auth/logout', { method: 'POST' }),
    onSettled: () => {
      queryClient.clear();
      router.replace('/login');
      router.refresh();
    },
  });
}
