import { LayoutDashboard, Stethoscope, Users, type LucideIcon } from 'lucide-react';

interface NavItem {
  href: '/dashboard' | '/doctors' | '/patients';
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
];

export const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export const titleForPath = (pathname: string) => {
  if (/^\/doctors\/[^/]+$/.test(pathname)) return 'Doctor details';
  return NAV_ITEMS.find((item) => isActivePath(pathname, item.href))?.label ?? 'Doctor Tracker';
};
