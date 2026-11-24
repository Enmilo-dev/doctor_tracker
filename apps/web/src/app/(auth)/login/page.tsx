import type { Metadata } from 'next';
import { Logo } from '@/components/brand/logo';
import { BrandPanel } from '@/features/auth/brand-panel';
import { LoginForm } from '@/features/auth/login-form';
import { safeRedirect } from '@/lib/redirect';

export const metadata: Metadata = { title: 'Sign in' };

const demo =
  process.env.DEMO_EMAIL && process.env.DEMO_PASSWORD
    ? { email: process.env.DEMO_EMAIL, password: process.env.DEMO_PASSWORD }
    : undefined;

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <BrandPanel />

      <div className="flex items-start justify-center px-6 pt-16 pb-12 sm:items-center sm:px-10 sm:py-12">
        <div className="w-full max-w-sm space-y-8">
          <Logo className="lg:hidden" />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage doctors, patients and insights.
            </p>
          </div>
          <LoginForm next={safeRedirect(typeof next === 'string' ? next : null)} demo={demo} />
        </div>
      </div>
    </main>
  );
}
