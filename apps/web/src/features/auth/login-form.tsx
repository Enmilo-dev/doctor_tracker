'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginInput } from '@doctor-tracker/shared';
import { FormAlert } from '@/components/form/form-alert';
import { SubmitButton } from '@/components/form/submit-button';
import { TextField } from '@/components/form/text-field';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { applyServerErrors } from '@/lib/form';
import { useLogin } from './use-auth';

interface LoginFormProps {
  next: string;
  demo?: { email: string; password: string };
}

export function LoginForm({ next, demo }: LoginFormProps) {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const isBusy = login.isPending || login.isSuccess;

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    login.mutate(values, {
      onSuccess: () => {
        router.replace(next);
        router.refresh();
      },
      onError: (error) => setFormError(applyServerErrors(error, setError)),
    });
  });

  const fillDemo = () => {
    if (!demo) return;
    setValue('email', demo.email, { shouldValidate: true });
    setValue('password', demo.password, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <FormAlert message={formError} />

        <FieldGroup>
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@hospital.com"
            autoFocus
            disabled={isBusy}
            error={errors.email}
            {...register('email')}
          />

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={!!errors.password}
                disabled={isBusy}
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="Show password"
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            <FieldError errors={[errors.password]} />
          </Field>
        </FieldGroup>

        <SubmitButton pending={isBusy} pendingLabel="Signing in…" size="lg" className="w-full">
          Sign in
        </SubmitButton>
      </form>

      {demo && (
        <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm">
          <p className="font-medium">Demo account</p>
          <p className="mt-1 text-muted-foreground">
            <span className="font-mono">{demo.email}</span> ·{' '}
            <span className="font-mono">{demo.password}</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={fillDemo}
            disabled={isBusy}
          >
            Use demo credentials
          </Button>
        </div>
      )}
    </div>
  );
}
