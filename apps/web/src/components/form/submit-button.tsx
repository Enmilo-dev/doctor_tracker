import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  pending: boolean;
  pendingLabel: string;
}

export function SubmitButton({ pending, pendingLabel, children, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <LoaderCircle className="animate-spin" />}
      {pending ? pendingLabel : children}
    </Button>
  );
}
