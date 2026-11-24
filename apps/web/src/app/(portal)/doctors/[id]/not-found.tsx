import { UserX } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/data-table/empty-state';
import { Button } from '@/components/ui/button';

export default function DoctorNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={UserX}
        title="Doctor not found"
        description="This doctor doesn't exist or may have been removed."
        action={
          <Button asChild variant="outline">
            <Link href="/doctors">Back to doctors</Link>
          </Button>
        }
      />
    </div>
  );
}
