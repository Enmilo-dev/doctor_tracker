'use client';

import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { titleForPath } from './nav-items';
import { ThemeToggle } from './theme-toggle';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-1 data-vertical:h-4 data-vertical:self-center"
      />
      <span className="text-sm font-medium">{titleForPath(pathname)}</span>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
