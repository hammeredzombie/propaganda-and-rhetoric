import { readable } from 'svelte/store';
import { createMachine } from './machine.js';
import { createRegistry } from './registry.js';

export const machine = createMachine({
  initial: 'idle',
  context: {},
  states: {
    idle: {}
  }
});

const registry = createRegistry();

export function dispatch(event, payload) {
  machine.send(event, payload);
}

export function register(name, fn) {
  registry.register(name, fn);
}

export function play(name, target, opts) {
  return registry.play(name, target, opts);
}

export const state = readable(
  { state: machine.getState(), context: machine.getContext() },
  (set) => machine.subscribe(set)
);
