export function createMachine(config) {
  const states = config.states || {};
  if (!states[config.initial]) {
    throw new Error(`initial state not in states: ${config.initial}`);
  }

  let currentState = config.initial;
  let context = { ...(config.context || {}) };
  const listeners = new Set();

  function snapshot() {
    return { state: currentState, context: Object.freeze({ ...context }) };
  }

  function notify() {
    const snap = snapshot();
    for (const fn of listeners) fn(snap);
  }

  function send(type, payload) {
    const def = states[currentState];
    const transition = def?.on?.[type];
    if (!transition) return;

    if (!states[transition.target]) {
      throw new Error(`unknown target state: ${transition.target}`);
    }

    const event = { type, payload };

    states[currentState].exit?.(context, event);

    if (typeof transition.action === 'function') {
      const next = transition.action(context, event);
      if (next && typeof next === 'object') context = next;
    }

    currentState = transition.target;

    states[currentState].entry?.(context, event);

    notify();
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(snapshot());
    return () => listeners.delete(fn);
  }

  function getState() {
    return currentState;
  }

  function getContext() {
    return Object.freeze({ ...context });
  }

  return { send, subscribe, getState, getContext };
}
