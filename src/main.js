import './styles/global.css';
import App from './App.svelte';
import { state } from './game/state.js';
import { audio } from './game/audio.js';
import { fx } from './game/fx.js';

state.load();

const app = new App({
  target: document.getElementById('app')
});

audio.init();
fx.init();

export default app;
