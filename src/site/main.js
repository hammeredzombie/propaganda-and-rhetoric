import './styles/global.css';
import App from './App.svelte';
import { state } from './game/state.js';
import { audio } from './game/audio.js';

state.load();

state.subscribe((s) => {
  const count = s.articleOpenCount || 0;
  const stage =
    count >= 5 ? 'censored' : count >= 3 ? 'loud' : count >= 2 ? 'warm' : 'pristine';
  if (document.documentElement.dataset.drift !== stage) {
    document.documentElement.dataset.drift = stage;
  }
});

audio.register('article_open', { src: [] });
audio.register('ambient', { src: [], loop: true, volume: 0.4 });

const app = new App({
  target: document.getElementById('app')
});

audio.init();

export default app;
