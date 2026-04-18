import { gsap } from 'gsap';
import { state } from './state.js';
import { events } from './events.js';
import { audio } from './audio.js';

let overlayEl = null;

function ensureOverlay() {
  if (overlayEl) return overlayEl;
  overlayEl = document.createElement('div');
  overlayEl.id = 'cutscene-overlay';
  overlayEl.setAttribute('aria-hidden', 'true');
  Object.assign(overlayEl.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '10000',
    background: 'rgba(10, 10, 10, 0.96)',
    color: '#f5f2ea',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0',
    pointerEvents: 'auto',
    padding: '4rem 2rem',
    textAlign: 'center'
  });
  document.body.appendChild(overlayEl);
  return overlayEl;
}

function renderFrames(frames) {
  const overlay = ensureOverlay();
  overlay.innerHTML = '';
  const stage = document.createElement('div');
  stage.className = 'cutscene-stage';
  Object.assign(stage.style, {
    maxWidth: '720px',
    position: 'relative',
    minHeight: '40vh'
  });
  for (const frame of frames) {
    const el = document.createElement('div');
    el.className = 'cutscene-frame';
    Object.assign(el.style, {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1.25rem',
      opacity: '0'
    });
    if (frame.eyebrow) {
      const eyebrow = document.createElement('div');
      eyebrow.textContent = frame.eyebrow;
      Object.assign(eyebrow.style, {
        fontFamily: 'Oswald, sans-serif',
        fontSize: '0.85rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#c94848'
      });
      el.appendChild(eyebrow);
    }
    const head = document.createElement('div');
    head.textContent = frame.headline;
    Object.assign(head.style, {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'italic',
      fontSize: 'clamp(1.75rem, 4vw, 3rem)',
      fontWeight: '900',
      lineHeight: '1.15'
    });
    el.appendChild(head);
    if (frame.body) {
      const body = document.createElement('p');
      body.textContent = frame.body;
      Object.assign(body.style, {
        fontFamily: 'Source Serif 4, serif',
        fontSize: '1.125rem',
        lineHeight: '1.55',
        color: '#dcd8cc',
        maxWidth: '56ch',
        margin: '0'
      });
      el.appendChild(body);
    }
    stage.appendChild(el);
  }
  overlay.appendChild(stage);
  return stage;
}

function play({ id, frames, onComplete } = {}) {
  return new Promise((resolve) => {
    const overlay = ensureOverlay();
    const stage = renderFrames(frames || []);
    const frameEls = Array.from(stage.querySelectorAll('.cutscene-frame'));
    overlay.style.display = 'flex';
    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.display = 'none';
        if (id) state.markCutsceneSeen(id);
        events.emit('cutscene:end', { id });
        onComplete?.();
        resolve();
      }
    });
    tl.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    frameEls.forEach((el, idx) => {
      tl.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, idx === 0 ? '>' : '>+0.4');
      if (idx < frameEls.length - 1) {
        tl.to(el, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '>+2.2');
      } else {
        tl.to({}, { duration: 2.6 });
      }
    });
    tl.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.in' });

    const skip = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.type === 'click') {
        tl.progress(1);
        window.removeEventListener('keydown', skip);
        overlay.removeEventListener('click', skip);
      }
    };
    window.addEventListener('keydown', skip);
    overlay.addEventListener('click', skip);

    audio.play('cutscene_tick', { volume: 0.5 });
    events.emit('cutscene:start', { id });
  });
}

const library = {
  intro: {
    id: 'intro',
    frames: [
      {
        eyebrow: 'Bulletin',
        headline: 'The presses are running.',
        body:
          'Every front page is a lever. Every caption a choice. Tonight, you are the one who decides what millions read in the morning.'
      },
      {
        eyebrow: 'Your desk',
        headline: 'Pick your angle. Set the tone.',
        body:
          'Click any headline to open a story. The more you read — and what you read — shapes how The Daily Record speaks tomorrow.'
      }
    ]
  },
  deeper: {
    id: 'deeper',
    frames: [
      {
        eyebrow: 'Breaking',
        headline: 'A pattern emerges.',
        body: 'The readership notices what you emphasize. Numbers shift. Phones ring. Someone upstairs is pleased.'
      }
    ]
  }
};

function playById(id) {
  const def = library[id];
  if (!def) return Promise.resolve();
  return play(def);
}

export const cutscene = { play, playById, library };
