import { Activity, Search, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/logo';

const HIGHLIGHTS = [
  {
    icon: Activity,
    title: 'Live analytics',
    text: 'Admissions, conditions and workload at a glance.',
  },
  { icon: Search, title: 'Instant search', text: 'Find any doctor or patient in milliseconds.' },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    text: 'Protected admin access for every route.',
  },
];

export function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between dark:bg-primary/20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-black/10 blur-3xl"
      />

      <Logo inverted className="relative text-lg" />

      <div className="relative max-w-md space-y-8">
        <h2 className="text-4xl leading-tight font-semibold text-balance">
          Every doctor, every patient, one clear view.
        </h2>
        <ul className="space-y-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block font-medium">{title}</span>
                <span className="text-sm text-white/75">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/60">© {new Date().getFullYear()} Doctor Tracker</p>
    </aside>
  );
}
