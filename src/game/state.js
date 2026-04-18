import { writable } from 'svelte/store';
import { events } from './events.js';

const STORAGE_KEY = 'propaganda-and-rhetoric:v1';

const initialState = {
  version: 1,
  articlesRead: [],
  articleOpenCount: 0,
  cutscenesSeen: [],
  flags: {},
  audioUnlocked: false,
  firstVisitAt: null,
  lastVisitAt: null
};

function cloneInitial() {
  return JSON.parse(JSON.stringify(initialState));
}

function createState() {
  const store = writable(cloneInitial());

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const fresh = cloneInitial();
        fresh.firstVisitAt = Date.now();
        fresh.lastVisitAt = Date.now();
        store.set(fresh);
        save(fresh);
        return fresh;
      }
      const parsed = JSON.parse(raw);
      const merged = { ...cloneInitial(), ...parsed, lastVisitAt: Date.now() };
      store.set(merged);
      save(merged);
      return merged;
    } catch (err) {
      console.warn('save load failed', err);
      const fresh = cloneInitial();
      store.set(fresh);
      return fresh;
    }
  }

  function save(snapshot) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (err) {
      console.warn('save write failed', err);
    }
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = cloneInitial();
    fresh.firstVisitAt = Date.now();
    fresh.lastVisitAt = Date.now();
    store.set(fresh);
    save(fresh);
    events.emit('state:reset', fresh);
  }

  function update(updater) {
    store.update((current) => {
      const next = updater({ ...current });
      save(next);
      return next;
    });
  }

  function markArticleRead(articleId) {
    update((s) => {
      if (!s.articlesRead.includes(articleId)) {
        s.articlesRead = [...s.articlesRead, articleId];
      }
      s.articleOpenCount = (s.articleOpenCount || 0) + 1;
      return s;
    });
    events.emit('article:read', { articleId });
  }

  function markCutsceneSeen(cutsceneId) {
    update((s) => {
      if (!s.cutscenesSeen.includes(cutsceneId)) {
        s.cutscenesSeen = [...s.cutscenesSeen, cutsceneId];
      }
      return s;
    });
  }

  function setFlag(key, value) {
    update((s) => {
      s.flags = { ...s.flags, [key]: value };
      return s;
    });
  }

  function setAudioUnlocked() {
    update((s) => {
      s.audioUnlocked = true;
      return s;
    });
  }

  return {
    subscribe: store.subscribe,
    load,
    save: () => {
      let snapshot;
      store.subscribe((s) => (snapshot = s))();
      save(snapshot);
    },
    reset,
    update,
    markArticleRead,
    markCutsceneSeen,
    setFlag,
    setAudioUnlocked
  };
}

export const state = createState();
