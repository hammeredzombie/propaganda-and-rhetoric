const NOOP_HANDLE = Object.freeze({
  stop() {},
  done: Promise.resolve()
});

function reducedMotionPreferred() {
  if (typeof globalThis.matchMedia !== 'function') return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
}

export function createRegistry() {
  const animations = new Map();

  function register(name, fn) {
    animations.set(name, fn);
  }

  function play(name, target, opts) {
    const fn = animations.get(name);
    if (!fn) {
      console.warn(`[fx] unknown animation: ${name}`);
      return NOOP_HANDLE;
    }
    const mergedOpts = { ...(opts || {}), reducedMotion: reducedMotionPreferred() };
    return fn(target, mergedOpts);
  }

  return { register, play };
}
