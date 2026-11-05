const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const WAVE_TITLES = [
  'THE FIRST KNOCK',
  'UNPAID GUESTS',
  'THE DINER CROWD',
  'FULL HOUSE',
  'CHECKOUT TIME',
  'LAST CALL',
];

export class UI {
  constructor() {
    this.hud = $('#hud');
    this.start = $('#start-screen');
    this.pause = $('#pause-screen');
    this.end = $('#end-screen');
    this.lock = $('#target-lock');
    this.healthFill = $('#health-fill');
    this.healthText = $('#health-text');
    this.statusRow = $('.status-row');
    this.statusText = $('#status-text');
    this.shells = $('#shells');
    this.reloadLabel = $('#reload-label');
    this.score = $('#score');
    this.scrap = $('#scrap');
    this.waveTitle = $('#wave-title');
    this.waveState = $('#wave-state');
    this.nightLabel = $('#night-label');
    this.waveProgress = $('#wave-progress');
    this.clearBanner = $('#clear-banner');
    this.breakBanner = $('#break-banner');
    this.breakCount = $('#break-count');
    this.clearBonus = $('#clear-bonus');
    this.toasts = $('#toast-stack');
    this.damageFlash = $('#damage-flash');
    this.lowHealth = $('#low-health');
    this.objective = $('#objective');
    this.objectiveTitle = $('#objective-title');
    this.objectiveSub = $('#objective-sub');
    this.repairBtn = $('#repair-btn');
    this.trapBtn = $('#trap-btn');
    this.fireBtn = $('#fire-btn');
    this.barrierRows = $$('.barricade-row');
    this.muteBtn = $('#mute-btn');
    this.lastShells = -1;
    this.lastHealth = -1;
    this.lastScrap = -1;
    this.lastScore = -1;
    this.floatEls = [];
    this.toastTimers = [];
    this.endStamp = $('#end-stamp');
    this.endKicker = $('#end-kicker');
    this.endTitle = $('#end-title');
    this.endCopy = $('#end-copy');
  }

  setPlaying(on) {
    this.hud.classList.toggle('hidden', !on);
  }

  hideStart() {
    this.start.classList.add('leaving');
    setTimeout(() => this.start.classList.add('hidden'), 620);
  }

  showStart() {
    this.start.classList.remove('hidden', 'leaving');
    this.hud.classList.add('hidden');
    this.end.classList.add('hidden');
    this.pause.classList.add('hidden');
  }

  showHud() {
    this.hud.classList.remove('hidden');
    this.objective.classList.remove('fade');
  }

  setMuted(muted) {
    this.muteBtn.classList.toggle('muted', muted);
    this.muteBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  }

  setHealth(hp, max, hurt = false) {
    const pct = Math.max(0, hp / max);
    if (this.lastHealth !== Math.round(hp)) {
      this.healthFill.style.width = `${pct * 100}%`;
      this.healthText.textContent = Math.max(0, Math.ceil(hp));
      this.lowHealth.classList.toggle('on', pct < .35);
      this.statusRow.classList.toggle('hurt', pct < .45 || hurt);
      this.statusText.textContent = pct < .2 ? 'CRITICAL' : pct < .45 ? 'BLEEDING' : hurt ? 'STUNG' : 'STEADY';
      this.healthFill.style.background = pct < .3
        ? 'linear-gradient(90deg,#7d1717,#e23b31)'
        : pct < .55
          ? 'linear-gradient(90deg,#a83731,#f28d4a)'
          : 'linear-gradient(90deg,#a83731,#d74b40 60%,#ee7054)';
      this.lastHealth = Math.round(hp);
    }
  }

  setScore(score) {
    if (score === this.lastScore) return;
    this.lastScore = score;
    this.score.textContent = String(Math.max(0, Math.floor(score))).padStart(6, '0');
  }

  setScrap(scrap) {
    if (scrap === this.lastScrap) return;
    this.lastScrap = scrap;
    this.scrap.textContent = String(scrap).padStart(2, '0');
  }

  setAmmo(shells, max, reloading) {
    if (shells !== this.lastShells) {
      this.lastShells = shells;
      if (this.shells.children.length !== max) {
        this.shells.innerHTML = '';
        for (let i = 0; i < max; i++) {
          const s = document.createElement('i');
          s.className = 'shell';
          this.shells.appendChild(s);
        }
      }
      [...this.shells.children].forEach((el, i) => el.classList.toggle('empty', i >= shells));
    }
    this.reloadLabel.classList.toggle('hidden', !reloading);
  }

  setWave(index, total, phase, timeLeft = 0) {
    const n = String(index + 1).padStart(2, '0');
    this.nightLabel.textContent = `NIGHT ${n}`;
    if (phase === 'break') {
      this.waveState.textContent = 'REGROUP';
      this.waveTitle.textContent = 'THEY COME IN WAVES';
    } else if (phase === 'victory') {
      this.waveState.textContent = 'DAWN';
      this.waveTitle.textContent = 'SUNRISE';
    } else {
      this.waveState.textContent = `WAVE ${index + 1} / ${total}`;
      this.waveTitle.textContent = WAVE_TITLES[index] || 'HOLD THE LINE';
    }
  }

  setWaveProgress(pct) {
    this.waveProgress.style.width = `${Math.min(1, Math.max(0, pct)) * 100}%`;
  }

  setBarriers(barriers) {
    barriers.forEach((b, i) => {
      const row = this.barrierRows[i];
      if (!row) return;
      const pct = Math.max(0, b.hp / b.maxHp);
      row.querySelector('.mini-bar span').style.width = `${pct * 100}%`;
      row.querySelector('b').textContent = b.destroyed ? 'OPEN' : `${Math.round(pct * 100)}%`;
      row.classList.toggle('crit', pct < .3 || b.destroyed);
      row.classList.toggle('warn', pct >= .3 && pct < .6);
    });
  }

  setRepairReady(ready) {
    this.repairBtn.classList.toggle('armed', ready);
  }

  showTarget(worldPos, camera, active = true) {
    if (!active || !worldPos) {
      this.lock.classList.add('hidden');
      return;
    }
    const p = worldPos.clone().project(camera);
    if (p.z > 1 || p.z < -1 || Math.abs(p.x) > 1.2 || Math.abs(p.y) > 1.2) {
      this.lock.classList.add('hidden');
      return;
    }
    const x = (p.x * .5 + .5) * window.innerWidth;
    const y = (-p.y * .5 + .5) * window.innerHeight;
    this.lock.style.left = `${x}px`;
    this.lock.style.top = `${y}px`;
    this.lock.classList.remove('hidden');
  }

  hitPulse(crit = false) {
    this.lock.style.transform = 'translate(-50%, -50%) scale(1.3)';
    this.lock.querySelector('span').style.color = crit ? '#ffdc86' : '#d74b40';
    clearTimeout(this.hitTimer);
    this.hitTimer = setTimeout(() => {
      if (this.lock) {
        this.lock.style.transform = 'translate(-50%, -50%) scale(1)';
        this.lock.querySelector('span').style.color = '#d74b40';
      }
    }, 90);
  }

  damage() {
    this.damageFlash.classList.add('hit');
    clearTimeout(this.damageTimer);
    this.damageTimer = setTimeout(() => this.damageFlash.classList.remove('hit'), 100);
  }

  toast(text, type = '') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = text;
    this.toasts.appendChild(el);
    const t = setTimeout(() => el.remove(), 2200);
    this.toastTimers.push(t);
  }

  objectiveSet(title, sub) {
    this.objectiveTitle.textContent = title;
    this.objectiveSub.textContent = sub;
    this.objective.classList.remove('fade');
  }

  fadeObjective() { this.objective.classList.add('fade'); }

  showClear(bonus, seconds) {
    this.clearBanner.classList.remove('hidden');
    this.clearBonus.textContent = `+${bonus} SCRAP`;
    setTimeout(() => this.clearBanner.classList.add('hidden'), 3300);
  }

  showBreak(seconds) {
    this.breakBanner.classList.remove('hidden');
    this.breakCount.textContent = `00:0${Math.max(0, Math.ceil(seconds))}`;
    this.breakCount.style.color = seconds < 3 ? '#d74b40' : '';
  }

  updateBreak(seconds) {
    this.breakCount.textContent = `00:0${Math.max(0, Math.ceil(seconds))}`;
    this.breakCount.style.color = seconds < 3 ? '#d74b40' : '';
  }

  hideBreak() { this.breakBanner.classList.add('hidden'); }

  floatText(worldPos, camera, text, cls = '') {
    const p = worldPos.clone().project(camera);
    if (p.z > 1) return;
    const x = (p.x * .5 + .5) * window.innerWidth;
    const y = (-p.y * .5 + .5) * window.innerHeight;
    const el = document.createElement('div');
    el.className = `damage-num ${cls}`;
    el.textContent = text;
    el.style.left = `${x + (Math.random() - .5) * 20}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  showPause(on) {
    this.pause.classList.toggle('hidden', !on);
  }

  showEnd({ victory, waves, kills, score, best }) {
    this.end.classList.remove('hidden');
    this.hud.classList.add('hidden');
    this.endStamp.textContent = victory ? 'SURVIVED' : 'YOU DIED';
    this.endStamp.style.webkitTextStroke = victory ? '2px rgba(242,167,59,.55)' : '2px rgba(215,75,64,.48)';
    this.endKicker.textContent = victory ? 'THE SUN CAME UP' : 'THE NIGHT WINS';
    this.endTitle.innerHTML = victory ? 'THE ROAD IS<br/>YOURS AGAIN.' : 'THE MOTEL<br/>KEEPS ITS GUESTS.';
    this.endCopy.textContent = victory
      ? 'Six waves. One busted shotgun. A sunrise worth waiting for.'
      : 'They got through the line. They always do. But the night can be beaten.';
    $('#stat-wave').textContent = `${waves} / 6`;
    $('#stat-kills').textContent = String(kills);
    $('#stat-score').textContent = String(score).padStart(6, '0');
    $('#stat-best').textContent = String(best).padStart(6, '0');
  }

  hideEnd() {
    this.end.classList.add('hidden');
  }

  reset() {
    this.setScore(0); this.setScrap(8); this.setHealth(100, 100);
    this.setAmmo(8, 8, false);
    this.clearBanner.classList.add('hidden');
    this.breakBanner.classList.add('hidden');
    this.lock.classList.add('hidden');
    this.lowHealth.classList.remove('on');
    this.toasts.innerHTML = '';
    this.setRepairReady(false);
  }
}
