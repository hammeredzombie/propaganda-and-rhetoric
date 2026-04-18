function createBus() {
  const listeners = new Map();

  function on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => off(event, handler);
  }

  function off(event, handler) {
    const set = listeners.get(event);
    if (set) set.delete(handler);
  }

  function emit(event, payload) {
    const set = listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      try {
        handler(payload);
      } catch (err) {
        console.error(`event handler for "${event}" threw`, err);
      }
    }
  }

  function once(event, handler) {
    const off = on(event, (payload) => {
      off();
      handler(payload);
    });
    return off;
  }

  return { on, off, once, emit };
}

export const events = createBus();
