import { Application, Container, Graphics, Ticker } from 'pixi.js';
import { gsap } from 'gsap';
import { events } from './events.js';

let app = null;
let particlesLayer = null;
let ready = false;

async function init() {
  if (ready) return;
  const canvas = document.getElementById('fx-overlay');
  if (!canvas) return;
  app = new Application();
  await app.init({
    canvas,
    resizeTo: window,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1
  });
  particlesLayer = new Container();
  app.stage.addChild(particlesLayer);
  ready = true;
  events.emit('fx:ready');
}

function inkSplash({ x, y, count = 14, color = 0xa01818 } = {}) {
  if (!ready) return;
  const cx = x ?? window.innerWidth / 2;
  const cy = y ?? window.innerHeight / 2;
  const particles = [];
  for (let i = 0; i < count; i++) {
    const g = new Graphics();
    const radius = 2 + Math.random() * 4;
    g.circle(0, 0, radius).fill({ color, alpha: 0.85 });
    g.x = cx;
    g.y = cy;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.8 + Math.random() * 3.8;
    const life = 650 + Math.random() * 550;
    particles.push({ g, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, maxLife: life });
    particlesLayer.addChild(g);
  }
  const ticker = new Ticker();
  ticker.add(() => {
    const dt = ticker.deltaMS;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.g.x += p.vx * (dt / 16);
      p.g.y += p.vy * (dt / 16);
      p.vy += 0.12 * (dt / 16);
      p.life -= dt;
      p.g.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        particlesLayer.removeChild(p.g);
        p.g.destroy();
        particles.splice(i, 1);
      }
    }
    if (particles.length === 0) {
      ticker.stop();
      ticker.destroy();
    }
  });
  ticker.start();
}

function flash({ color = 0xfffaf0, duration = 120, opacity = 0.7 } = {}) {
  if (!ready) return;
  const flashEl = new Graphics();
  flashEl.rect(0, 0, app.screen.width, app.screen.height).fill({ color, alpha: opacity });
  app.stage.addChild(flashEl);
  const start = performance.now();
  const ticker = new Ticker();
  ticker.add(() => {
    const elapsed = performance.now() - start;
    const t = elapsed / duration;
    flashEl.alpha = opacity * Math.max(0, 1 - t);
    if (t >= 1) {
      app.stage.removeChild(flashEl);
      flashEl.destroy();
      ticker.stop();
      ticker.destroy();
    }
  });
  ticker.start();
}

function censorFlash(target, { wordIndex } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return Promise.resolve();

  const textNode = Array.from(el.childNodes).find(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length
  );
  if (!textNode) return Promise.resolve();

  const raw = textNode.textContent;
  const ranges = [];
  let i = 0;
  while (i < raw.length) {
    while (i < raw.length && /\s/.test(raw[i])) i++;
    if (i >= raw.length) break;
    const start = i;
    while (i < raw.length && !/\s/.test(raw[i])) i++;
    ranges.push([start, i]);
  }
  if (!ranges.length) return Promise.resolve();

  const target_i =
    typeof wordIndex === 'number'
      ? Math.max(0, Math.min(wordIndex, ranges.length - 1))
      : Math.floor(ranges.length / 2);
  const [wordStart, wordEnd] = ranges[target_i];

  const range = document.createRange();
  range.setStart(textNode, wordStart);
  range.setEnd(textNode, wordEnd);
  const rect = range.getBoundingClientRect();
  range.detach?.();

  if (!rect.width || !rect.height) return Promise.resolve();

  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  const pad = 3;
  Object.assign(bar.style, {
    position: 'fixed',
    top: rect.top - pad + 'px',
    left: rect.left - pad + 'px',
    width: rect.width + pad * 2 + 'px',
    height: rect.height + pad * 2 + 'px',
    background: 'var(--color-censor, #0a0a0a)',
    pointerEvents: 'none',
    zIndex: '9998',
    opacity: '0'
  });
  document.body.appendChild(bar);

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return new Promise((resolve) => {
    const cleanup = () => {
      bar.remove();
      resolve();
    };
    if (reduceMotion) {
      gsap.set(bar, { opacity: 1 });
      gsap.to(bar, { opacity: 0, duration: 0.1, delay: 0.2, onComplete: cleanup });
      return;
    }
    const tl = gsap.timeline({ onComplete: cleanup });
    tl.to(bar, { opacity: 1, duration: 0.08, ease: 'power2.out' })
      .to(bar, { duration: 0.24 })
      .to(bar, { opacity: 0, duration: 0.12, ease: 'power2.in' });
  });
}

export const fx = { init, inkSplash, flash, censorFlash };
