import { writable } from 'svelte/store';

const VALID_ROUTES = new Set([
  'home',
  'politics',
  'world',
  'business',
  'opinion',
  'culture',
  'science',
  'obituaries',
  'unauthorized'
]);

function parseHash() {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw) return 'home';
  const slug = raw.split(/[?/]/)[0].toLowerCase();
  return VALID_ROUTES.has(slug) ? slug : 'unauthorized';
}

export const route = writable(parseHash());

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    route.set(parseHash());
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}

export function navigate(to) {
  if (typeof window === 'undefined') return;
  window.location.hash = `/${to}`;
}
