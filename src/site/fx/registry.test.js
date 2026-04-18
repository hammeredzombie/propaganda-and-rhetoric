import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRegistry } from './registry.js';

const originalMatchMedia = globalThis.matchMedia;

function mockMatchMedia(matches) {
  globalThis.matchMedia = vi.fn().mockReturnValue({
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  });
}

beforeEach(() => {
  mockMatchMedia(false);
});

afterEach(() => {
  globalThis.matchMedia = originalMatchMedia;
});

describe('createRegistry', () => {
  it('play invokes the registered fn with target and opts', () => {
    const r = createRegistry();
    const fn = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('splash', fn);
    const target = { id: 't' };
    r.play('splash', target, { duration: 100 });
    expect(fn).toHaveBeenCalledTimes(1);
    const [gotTarget, gotOpts] = fn.mock.calls[0];
    expect(gotTarget).toBe(target);
    expect(gotOpts).toMatchObject({ duration: 100, reducedMotion: false });
  });

  it('play passes reducedMotion=true when the media query matches', () => {
    mockMatchMedia(true);
    const r = createRegistry();
    const fn = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('splash', fn);
    r.play('splash', null, {});
    expect(fn.mock.calls[0][1].reducedMotion).toBe(true);
  });

  it('play returns the handle the animation fn returned', () => {
    const r = createRegistry();
    const handle = { stop: vi.fn(), done: Promise.resolve() };
    r.register('x', () => handle);
    expect(r.play('x', null, {})).toBe(handle);
  });

  it('play of an unknown name warns and returns a no-op handle', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const r = createRegistry();
    const handle = r.play('nope', null, {});
    expect(warn).toHaveBeenCalled();
    expect(typeof handle.stop).toBe('function');
    await expect(handle.done).resolves.toBeUndefined();
    handle.stop();
    warn.mockRestore();
  });

  it('register with a duplicate name overwrites the previous fn', () => {
    const r = createRegistry();
    const first = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    const second = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('same', first);
    r.register('same', second);
    r.play('same', null, {});
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('play with no opts still supplies reducedMotion', () => {
    const r = createRegistry();
    const fn = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('z', fn);
    r.play('z', null);
    expect(fn.mock.calls[0][1]).toEqual({ reducedMotion: false });
  });
});
