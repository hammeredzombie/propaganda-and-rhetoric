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

// Rewrite the address bar to the canonical hash when the current hash
// doesn't map to a real route, so "proper-goose.com/#/foo" lands on the
// unauthorized page with a matching URL.
function normalizeHash(resolved) {
  if (typeof window === 'undefined') return;
  const canonical = resolved === 'home' ? '' : `#/${resolved}`;
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  const slug = raw.split(/[?/]/)[0].toLowerCase();
  if (slug === resolved) return;
  if (!raw && resolved === 'home') return;
  history.replaceState(null, '', canonical || window.location.pathname);
}

const initial = parseHash();
normalizeHash(initial);

export const route = writable(initial);

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const resolved = parseHash();
    normalizeHash(resolved);
    route.set(resolved);
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}

export function navigate(to) {
  if (typeof window === 'undefined') return;
  window.location.hash = `/${to}`;
}
