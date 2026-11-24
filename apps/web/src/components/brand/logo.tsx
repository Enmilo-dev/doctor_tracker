import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  labelClassName?: string;
  inverted?: boolean;
}

export function Logo({ className, labelClassName, inverted = false }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5 font-semibold tracking-tight', className)}>
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          inverted ? 'bg-white/15 text-white' : 'bg-primary text-primary-foreground',
        )}
      >
        <Stethoscope className="size-4.5" />
      </span>
      <span className={cn('truncate', labelClassName)}>Doctor Tracker</span>
    </span>
  );
}
