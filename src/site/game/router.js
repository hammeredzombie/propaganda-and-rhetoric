import { readable } from 'svelte/store';

function parse() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('/article/')) {
    return { name: 'article', params: { id: hash.slice('/article/'.length) } };
  }
  return { name: 'home', params: {} };
}

export const route = readable(parse(), (set) => {
  const handler = () => set(parse());
  window.addEventListener('hashchange', handler);
  window.addEventListener('popstate', handler);
  return () => {
    window.removeEventListener('hashchange', handler);
    window.removeEventListener('popstate', handler);
  };
});

export function goToArticle(id) {
  window.location.hash = `/article/${id}`;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function goHome() {
  window.location.hash = '';
  window.scrollTo({ top: 0, behavior: 'instant' });
}
