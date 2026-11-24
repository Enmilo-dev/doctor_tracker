import type { PatientCondition } from '@doctor-tracker/shared';
import { Badge } from '@/components/ui/badge';
import { CONDITION_LABELS, CONDITION_STYLES } from '@/lib/labels';
import { cn } from '@/lib/utils';

export function ConditionBadge({ condition }: { condition: PatientCondition }) {
  const style = CONDITION_STYLES[condition];
  return (
    <Badge className={cn('gap-1.5 border-transparent text-foreground', style.tint)}>
      <span className={cn('size-1.5 rounded-full', style.dot)} aria-hidden />
      {CONDITION_LABELS[condition]}
    </Badge>
  );
}
