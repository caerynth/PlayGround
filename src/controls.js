export class Controls {
  constructor(callbacks) {
    this.cb = callbacks;
    this.keys = new Set();
    this.joy = { x: 0, y: 0, active: false, id: null };
    this.firing = false;
    this.enabled = false;
    this.isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    this.updateTouchClass = () => document.body.classList.toggle('touch', this.isTouch || innerWidth <= 900);
    this.updateTouchClass();
    window.addEventListener('resize', this.updateTouchClass);

    this.zone = document.getElementById('joystick-zone');
    this.knob = document.getElementById('joystick-knob');
    this.fireBtn = document.getElementById('fire-btn');
    this.repairBtn = document.getElementById('repair-btn');
    this.trapBtn = document.getElementById('trap-btn');
    this.canvas = document.getElementById('game');
    this.bindJoystick();
    this.bindButtons();
    this.bindKeyboard();
    this.bindScreens();
  }

  bindJoystick() {
    const radius = 34;
    const update = (e) => {
      const rect = this.zone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const len = Math.hypot(dx, dy);
      const max = rect.width * .34;
      if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
      this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joy.x = dx / max;
      this.joy.y = dy / max;
    };
    const reset = () => {
      this.joy.active = false;
      this.joy.id = null;
      this.joy.x = 0; this.joy.y = 0;
      this.knob.style.transform = 'translate(0px, 0px)';
    };
    this.zone.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.joy.active = true; this.joy.id = e.pointerId;
      try { this.zone.setPointerCapture(e.pointerId); } catch {}
      update(e);
    });
    this.zone.addEventListener('pointermove', (e) => {
      if (!this.joy.active || e.pointerId !== this.joy.id) return;
      e.preventDefault(); update(e);
    });
    for (const evt of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      this.zone.addEventListener(evt, (e) => {
        if (e.pointerId !== this.joy.id) return;
        reset();
      });
    }
    // double-tap joystick centre doesn't zoom the camera
    this.zone.addEventListener('dblclick', e => e.preventDefault());
  }

  holdButton(el, down, up) {
    el.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch {}
      el.classList.add('pressed');
      down();
    });
    const release = (e) => {
      el.classList.remove('pressed');
      up();
    };
    for (const evt of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(evt, release);
  }

  bindButtons() {
    this.holdButton(this.fireBtn, () => { this.firing = true; this.fireBtn.classList.add('firing'); }, () => { this.firing = false; this.fireBtn.classList.remove('firing'); });
    this.repairBtn.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      e.preventDefault(); this.cb.onAction?.('repair');
    });
    this.trapBtn.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      e.preventDefault(); this.cb.onAction?.('trap');
    });

    if (!this.isTouch) {
      this.canvas.addEventListener('mousedown', (e) => {
        if (!this.enabled || e.button !== 0) return;
        e.preventDefault(); this.firing = true;
      });
      window.addEventListener('mouseup', () => { this.firing = false; });
      this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }
    window.addEventListener('blur', () => { this.firing = false; this.keys.clear(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { this.firing = false; this.keys.clear(); this.cb.onHidden?.(); }
    });
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (e.repeat) return;
      if (e.code === 'KeyE') this.cb.onAction?.('repair');
      if (e.code === 'KeyQ') this.cb.onAction?.('trap');
      if (e.code === 'KeyR') this.cb.onAction?.('reload');
      if (e.code === 'Escape' || e.code === 'KeyP') this.cb.onPause?.();
      if (e.code === 'Space' && this.enabled) this.firing = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      if (e.code === 'Space') this.firing = false;
    });
  }

  bindScreens() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      el?.addEventListener('click', (e) => { e.preventDefault(); fn(); });
    };
    bind('start-btn', () => this.cb.onStart?.());
    bind('resume-btn', () => this.cb.onResume?.());
    bind('quit-btn', () => this.cb.onQuit?.());
    bind('retry-btn', () => this.cb.onRetry?.());
    bind('end-quit-btn', () => this.cb.onQuit?.());
    bind('mute-btn', () => this.cb.onMute?.());
    bind('pause-btn', () => this.cb.onPause?.());
  }

  movement() {
    let x = 0, z = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) z -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) z += 1;
    x += this.joy.x;
    z += this.joy.y;
    const len = Math.hypot(x, z);
    if (len > 1) { x /= len; z /= len; }
    return { x, z, len: Math.min(1, len) };
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) { this.firing = false; this.joy.x = 0; this.joy.y = 0; this.joy.active = false; this.knob.style.transform = 'translate(0,0)'; }
  }
}
