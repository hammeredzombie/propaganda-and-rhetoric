import { writable } from 'svelte/store';

// Null when the hint modal is closed; an object `{ route, text }`
// while it is open.  Any component may set/clear this store.
export const activeHint = writable(null);

export function openHint(route, text) {
  activeHint.set({ route, text });
}

export function closeHint() {
  activeHint.set(null);
}
