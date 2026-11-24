import type { FieldError as RhfFieldError } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  id: string;
  label: string;
  error?: RhfFieldError;
  fieldClassName?: string;
}

export function TextField({ id, label, error, fieldClassName, ...inputProps }: TextFieldProps) {
  return (
    <Field data-invalid={!!error} className={fieldClassName}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} aria-invalid={!!error} {...inputProps} />
      <FieldError errors={[error]} />
    </Field>
  );
}
