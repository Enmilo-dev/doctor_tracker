import 'server-only';

const DEFAULT_REDIRECT = '/dashboard';
const BASE = 'http://app.local';

export function safeRedirect(next: string | null | undefined) {
  if (!next?.startsWith('/')) return DEFAULT_REDIRECT;

  const url = URL.parse(next, BASE);
  if (!url || url.origin !== BASE) return DEFAULT_REDIRECT;
  if (url.pathname.startsWith('/login') || url.pathname.startsWith('/signout')) {
    return DEFAULT_REDIRECT;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
