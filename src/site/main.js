import './styles/global.css';
import App from './App.svelte';
import { state } from './game/state.js';
import { audio } from './game/audio.js';

state.load();

audio.register('article_open', { src: [] });
audio.register('ambient', { src: [], loop: true, volume: 0.4 });

const app = new App({
  target: document.getElementById('app')
});

audio.init();

export default app;
