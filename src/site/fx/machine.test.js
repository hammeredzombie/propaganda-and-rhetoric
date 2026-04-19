import { describe, it, expect, vi } from 'vitest';
import { createMachine } from './machine.js';

function baseConfig(overrides = {}) {
  return {
    initial: 'idle',
    context: { count: 0 },
    states: {
      idle: {
        on: {
          TICK: {
            target: 'active',
            action: (ctx) => ({ ...ctx, count: ctx.count + 1 })
          },
          NOOP: { target: 'idle' }
        },
        entry: vi.fn(),
        exit: vi.fn()
      },
      active: {
        on: {
          STOP: { target: 'idle' }
        },
        entry: vi.fn(),
        exit: vi.fn()
      }
    },
    ...overrides
  };
}

describe('createMachine', () => {
  it('starts in the configured initial state', () => {
    const m = createMachine(baseConfig());
    expect(m.getState()).toBe('idle');
  });

  it('returns the initial context', () => {
    const m = createMachine(baseConfig());
    expect(m.getContext()).toEqual({ count: 0 });
  });

  it('freezes the context snapshot it returns', () => {
    const m = createMachine(baseConfig());
    const ctx = m.getContext();
    expect(Object.isFrozen(ctx)).toBe(true);
  });

  it('ignores events with no handler in the current state', () => {
    const m = createMachine(baseConfig());
    const listener = vi.fn();
    m.subscribe(listener);
    listener.mockClear();
    m.send('UNKNOWN');
    expect(m.getState()).toBe('idle');
    expect(listener).not.toHaveBeenCalled();
  });

  it('runs exit, then action, then entry on a transition', () => {
    const config = baseConfig();
    const order = [];
    config.states.idle.exit = () => order.push('exit-idle');
    config.states.idle.on.TICK.action = (ctx) => {
      order.push('action');
      return { ...ctx, count: ctx.count + 1 };
    };
    config.states.active.entry = () => order.push('entry-active');

    const m = createMachine(config);
    m.send('TICK');

    expect(order).toEqual(['exit-idle', 'action', 'entry-active']);
    expect(m.getState()).toBe('active');
    expect(m.getContext()).toEqual({ count: 1 });
  });

  it('passes context and event to hooks', () => {
    const config = baseConfig();
    const m = createMachine(config);
    m.send('TICK', { id: 42 });

    expect(config.states.idle.exit).toHaveBeenCalledWith(
      { count: 0 },
      { type: 'TICK', payload: { id: 42 } }
    );
    expect(config.states.active.entry).toHaveBeenCalledWith(
      { count: 1 },
      { type: 'TICK', payload: { id: 42 } }
    );
  });

  it('re-fires exit and entry on a self-transition', () => {
    const config = baseConfig();
    const m = createMachine(config);
    m.send('NOOP');
    expect(config.states.idle.exit).toHaveBeenCalledTimes(1);
    expect(config.states.idle.entry).toHaveBeenCalledTimes(1);
    expect(m.getState()).toBe('idle');
  });

  it('throws when a transition target is not a defined state', () => {
    const config = {
      initial: 'idle',
      context: {},
      states: {
        idle: { on: { BAD: { target: 'nowhere' } } }
      }
    };
    const m = createMachine(config);
    expect(() => m.send('BAD')).toThrow(/unknown target state: nowhere/i);
  });

  it('notifies subscribers synchronously on subscribe, then on each transition', () => {
    const m = createMachine(baseConfig());
    const listener = vi.fn();
    m.subscribe(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toEqual({
      state: 'idle',
      context: { count: 0 }
    });

    m.send('TICK');
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.calls[1][0]).toEqual({
      state: 'active',
      context: { count: 1 }
    });
  });

  it('unsubscribe stops further emissions', () => {
    const m = createMachine(baseConfig());
    const listener = vi.fn();
    const unsub = m.subscribe(listener);
    listener.mockClear();
    unsub();
    m.send('TICK');
    expect(listener).not.toHaveBeenCalled();
  });
});
