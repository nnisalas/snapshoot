import { App } from './app.js';
import { initPressStates } from './press-states.js';

const STAGE_W = 390;
const STAGE_H = 844;

const stageEl = document.getElementById('stage');

function fitStage() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(vw / STAGE_W, vh / STAGE_H);
  stageEl.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', fitStage);
window.addEventListener('orientationchange', fitStage);
fitStage();

const app = new App(stageEl);
initPressStates();

window.addEventListener('pagehide', () => app.stopCamera());
