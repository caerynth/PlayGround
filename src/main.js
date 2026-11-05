import './style.css';
import { AudioEngine } from './audio.js';
import { UI } from './ui.js';
import { Controls } from './controls.js';
import { Game } from './game.js';

const ui = new UI();
const audio = new AudioEngine();
let game = null;

function boot() {
  try {
    const controls = new Controls({
      onStart: () => {
        if (!game || !['menu'].includes(game.phase)) return;
        audio.init().catch(() => {});
        game.start();
      },
      onResume: () => game?.resume(),
      onPause: () => game?.togglePause(),
      onQuit: () => game?.quit(),
      onRetry: () => game?.retry(),
      onMute: () => {
        audio.init().catch(() => {});
        audio.setMuted(!audio.muted);
        ui.setMuted(audio.muted);
      },
      onAction: (action) => {
        if (!game) return;
        if (action === 'repair') game.useRepair();
        if (action === 'trap') game.useTrap();
        if (action === 'reload') game.startReload();
      },
      onHidden: () => {
        if (game && !game.paused && ['wave', 'break'].includes(game.phase)) game.pause();
      },
    });

    game = new Game({
      canvas: document.getElementById('game'),
      audio,
      ui,
      controls,
    });

    // expose a tiny handle for browser verification / debugging
    window.__deadBlock = game;

    ui.setMuted(false);
    ui.showStart();
    ui.showPause(false);
    ui.hideEnd();
    ui.setPlaying(false);

    const orient = () => document.body.classList.toggle('is-portrait', innerHeight > innerWidth);
    orient();
    window.addEventListener('resize', orient);
    window.addEventListener('orientationchange', () => setTimeout(orient, 120));

    // make first tap unlock audio on iOS even if the start button is missed
    const unlock = () => { audio.init().catch(() => {}); window.removeEventListener('pointerdown', unlock); };
    window.addEventListener('pointerdown', unlock, { passive: true });

    document.body.classList.add('ready');
  } catch (error) {
    console.error(error);
    const el = document.getElementById('fatal');
    el.textContent = `The projector failed to start. ${error.message}`;
    el.classList.remove('hidden');
  }
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(boot).catch(boot);
} else {
  boot();
}
