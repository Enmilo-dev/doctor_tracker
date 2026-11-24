'use client';

import { ErrorState } from '@/components/layout/error-state';

export default function RootError({ retry }: { error: unknown; retry: () => void }) {
  return <ErrorState retry={retry} className="min-h-svh" />;
}
