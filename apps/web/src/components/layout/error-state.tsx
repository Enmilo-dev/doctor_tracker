import { CircleAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  retry: () => void;
  className?: string;
}

export function ErrorState({ retry, className }: ErrorStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4 p-6 text-center', className)}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlert className="size-6" />
      </span>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">We couldn&apos;t load this page</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The server may be temporarily unavailable. Please try again in a moment.
        </p>
      </div>
      <Button onClick={retry}>
        <RotateCcw />
        Try again
      </Button>
    </div>
  );
}
