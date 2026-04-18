import { Howl, Howler } from 'howler';
import { state } from './state.js';
import { events } from './events.js';

const registry = new Map();
let unlocked = false;

function init() {
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    Howler.ctx?.resume?.();
    state.setAudioUnlocked();
    events.emit('audio:unlocked');
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock, { once: false });
  window.addEventListener('keydown', unlock, { once: false });
}

function register(id, opts = {}) {
  if (!opts.src || opts.src.length === 0) {
    registry.set(id, { fake: true, volume: opts.volume ?? 1 });
    return;
  }
  registry.set(
    id,
    new Howl({
      src: opts.src,
      volume: opts.volume ?? 1,
      loop: opts.loop ?? false,
      html5: opts.html5 ?? false,
      sprite: opts.sprite
    })
  );
}

function play(id, opts = {}) {
  const entry = registry.get(id);
  if (!entry) return null;
  if (entry.fake) {
    events.emit('audio:play-fake', { id, opts });
    return null;
  }
  const soundId = entry.play(opts.sprite);
  if (opts.volume != null) entry.volume(opts.volume, soundId);
  return soundId;
}

function stop(id) {
  const entry = registry.get(id);
  if (entry?.fake || !entry) return;
  entry.stop();
}

function mute(flag = true) {
  Howler.mute(flag);
}

export const audio = { init, register, play, stop, mute };
