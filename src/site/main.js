import './styles/global.css';
import App from './App.svelte';
import { state } from './game/state.js';
import { audio } from './game/audio.js';
import { fx } from './game/fx.js';

state.load();

let prevDriftStage = null;
state.subscribe((s) => {
  const count = s.articleOpenCount || 0;
  const stage =
    count >= 5 ? 'censored' : count >= 3 ? 'loud' : count >= 2 ? 'warm' : 'pristine';
  if (document.documentElement.dataset.drift !== stage) {
    document.documentElement.dataset.drift = stage;
  }
  if (prevDriftStage === 'loud' && stage === 'censored') {
    setTimeout(() => {
      const headline = document.querySelector(
        '.article-headline h1, .card--hero .card__headline'
      );
      if (headline) fx.censorFlash(headline);
    }, 220);
  }
  prevDriftStage = stage;
});

audio.register('article_open', { src: [] });
audio.register('ambient', { src: [], loop: true, volume: 0.4 });

const app = new App({
  target: document.getElementById('app')
});

audio.init();
fx.init();

export default app;
