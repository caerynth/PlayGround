/* Tiny synthesized soundscape: rockabilly loop, shotgun, groans, creaks. */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.noise = null;
    this.muted = false;
    this.started = false;
    this.step = 0;
    this.nextNote = 0;
    this.musicOn = false;
    this.intensity = 0;
  }

  async init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.72;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 16;
    comp.ratio.value = 5;
    comp.attack.value = 0.003;
    comp.release.value = 0.24;
    this.master.connect(comp).connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.14;
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.72;
    this.sfxGain.connect(this.master);

    const len = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buffer;

    this.startWind();
    this.started = true;
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.72, this.ctx.currentTime + 0.12);
    }
  }

  startWind() {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise; src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 340; filter.Q.value = 0.6;
    const gain = this.ctx.createGain(); gain.gain.value = 0.028;
    const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(gain.gain);
    src.connect(filter).connect(gain).connect(this.master);
    src.start(); lfo.start();
    this.wind = { src, gain, filter };
  }

  noiseBurst(duration = 0.22, volume = 0.6, frequency = 900, q = 0.8, type = 'lowpass') {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type; filter.frequency.setValueAtTime(frequency, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(100, frequency * 0.28), t + duration);
    filter.Q.value = q;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.connect(filter).connect(gain).connect(this.sfxGain);
    src.start(t); src.stop(t + duration);
  }

  tone(freq, duration, volume = 0.1, type = 'sine', slide = null, delay = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g).connect(this.sfxGain);
    o.start(t); o.stop(t + duration + 0.02);
  }

  shot() {
    if (!this.ctx) return;
    this.noiseBurst(0.3, 0.75, 2100, 1.1);
    this.noiseBurst(0.14, 0.35, 5600, 0.8, 'highpass');
    this.tone(92, 0.2, 0.3, 'sine', 38);
    this.tone(42, 0.3, 0.22, 'triangle', 28);
  }
  empty() { this.tone(540, 0.06, 0.1, 'square', 320); this.tone(210, 0.06, 0.06, 'square', 160, 0.04); }
  reload() {
    this.tone(320, 0.05, 0.1, 'square', 240);
    this.tone(640, 0.04, 0.08, 'square', 480, 0.36);
    this.tone(410, 0.06, 0.09, 'square', 280, 0.78);
  }
  hit() { this.noiseBurst(0.08, 0.22, 1500, 0.6); this.tone(130, 0.1, 0.12, 'triangle', 60); }
  crit() { this.tone(880, 0.06, 0.08, 'square', 1400); this.tone(1600, 0.05, 0.05, 'sine', 1900, 0.04); }
  splat() { this.noiseBurst(0.22, 0.28, 700, 0.7); this.tone(75, 0.25, 0.14, 'sawtooth', 32); }
  growl() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(56 + Math.random() * 16, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.55);
    f.type = 'lowpass'; f.frequency.value = 260;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.055, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(f).connect(g).connect(this.sfxGain); o.start(t); o.stop(t + 0.62);
  }
  hurt() { this.noiseBurst(0.18, 0.4, 650, 0.6); this.tone(180, 0.22, 0.16, 'sawtooth', 70); }
  repair() {
    this.tone(310, 0.12, 0.13, 'square', 620);
    this.tone(460, 0.18, 0.1, 'triangle', 220, 0.09);
    this.noiseBurst(0.1, 0.1, 2400, 1.4, 'bandpass');
  }
  trap() {
    this.noiseBurst(0.08, 0.32, 3200, 0.9, 'bandpass');
    this.tone(900, 0.18, 0.13, 'square', 120);
    this.tone(70, 0.3, 0.16, 'triangle', 35, 0.04);
  }
  build() { this.noiseBurst(0.12, 0.2, 1600, 0.4); this.tone(190, 0.08, 0.1, 'square', 110); }
  reloadDone() { this.tone(720, 0.06, 0.1, 'square', 920); this.tone(380, 0.05, 0.06, 'square', 300, 0.08); }
  ui() { this.tone(620, 0.04, 0.055, 'square', 820); }
  levelUp() {
    [392, 523, 659, 784].forEach((f, i) => this.tone(f, 0.18, 0.065, 'triangle', null, i * 0.08));
  }
  horn() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [138, 174, 207].forEach((f, i) => {
      const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
      o.type = i === 1 ? 'sawtooth' : 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.055, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
      o.connect(g).connect(this.sfxGain); o.start(t); o.stop(t + 1.2);
    });
  }
  victory() {
    [262, 330, 392, 523, 659].forEach((f, i) => this.tone(f, 0.5, 0.08, 'triangle', null, i * 0.12));
    this.noiseBurst(0.7, 0.05, 3000, 0.4);
  }
  death() {
    [196, 165, 131, 98].forEach((f, i) => this.tone(f, 0.5, 0.1, 'sawtooth', f * .92, i * .16));
    this.noiseBurst(1.2, 0.1, 500, .4);
  }

  startMusic() {
    if (!this.ctx || this.musicOn) return;
    this.musicOn = true;
    this.step = 0;
    this.nextNote = this.ctx.currentTime + 0.1;
    this.musicGain.gain.setTargetAtTime(0.13, this.ctx.currentTime, .4);
  }
  stopMusic() {
    this.musicOn = false;
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, .4);
  }

  update(intensity = 0) {
    if (!this.ctx || !this.musicOn) return;
    this.intensity = intensity;
    const bpm = 104 + intensity * 18;
    const stepDur = 60 / bpm / 2;
    while (this.nextNote < this.ctx.currentTime + 0.16) {
      this.playStep(this.step, this.nextNote, bpm);
      this.nextNote += stepDur;
      this.step = (this.step + 1) % 32;
    }
  }

  playStep(step, time, bpm) {
    const ctx = this.ctx;
    const bar = Math.floor(step / 8);
    const beat = step % 8;
    const bassRoots = [55, 55, 43.65, 49]; // A, A, F, G
    const root = bassRoots[bar % 4];

    // kick on 1 & 3 of each 4/4 bar
    if (beat === 0 || beat === 4) this.musicKick(time, beat === 0 ? .16 : .1);
    // brush snare backbeat
    if (beat === 2 || beat === 6) this.musicSnare(time);
    // hats
    if (step % 2 === 1) this.musicHat(time, .012);
    // walking bass
    const pattern = [0, 0, 12, 7, 0, 0, -5, 7];
    const freq = root * Math.pow(2, pattern[beat] / 12);
    if (beat % 2 === 0 || Math.random() > .45) this.musicBass(freq, time, beat === 0 ? .11 : .075);
    // twangy guitar on upbeats
    if (beat === 1 || beat === 5) this.musicTwang(root * 4, time);
    if (bar === 3 && beat === 7) this.musicTwang(root * 6, time + .02);
    // tambourine/shaker
    this.musicShaker(time, .009);
  }

  musicKick(time, vol) {
    const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(105, time); o.frequency.exponentialRampToValueAtTime(42, time + .14);
    g.gain.setValueAtTime(vol, time); g.gain.exponentialRampToValueAtTime(.0001, time + .18);
    o.connect(g).connect(this.musicGain); o.start(time); o.stop(time + .2);
  }
  musicSnare(time) {
    const src = this.ctx.createBufferSource(); src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1600; f.Q.value = .7;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(.055, time); g.gain.exponentialRampToValueAtTime(.0001, time + .11);
    src.connect(f).connect(g).connect(this.musicGain); src.start(time); src.stop(time + .12);
  }
  musicHat(time, vol) {
    const src = this.ctx.createBufferSource(); src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6100;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(vol, time); g.gain.exponentialRampToValueAtTime(.0001, time + .035);
    src.connect(f).connect(g).connect(this.musicGain); src.start(time); src.stop(time + .04);
  }
  musicShaker(time, vol) {
    if (Math.random() > .7) return;
    const src = this.ctx.createBufferSource(); src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 7300; f.Q.value = 1.2;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(vol, time); g.gain.exponentialRampToValueAtTime(.0001, time + .06);
    src.connect(f).connect(g).connect(this.musicGain); src.start(time); src.stop(time + .07);
  }
  musicBass(freq, time, vol) {
    const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(.0001, time); g.gain.linearRampToValueAtTime(vol, time + .015); g.gain.exponentialRampToValueAtTime(.0001, time + .15);
    o.connect(f).connect(g).connect(this.musicGain); o.start(time); o.stop(time + .17);
  }
  musicTwang(freq, time) {
    const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(2400, time); f.frequency.exponentialRampToValueAtTime(800, time + .18);
    o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, time); o.frequency.exponentialRampToValueAtTime(freq * .995, time + .2);
    g.gain.setValueAtTime(.022, time); g.gain.exponentialRampToValueAtTime(.0001, time + .22);
    o.connect(f).connect(g).connect(this.musicGain); o.start(time); o.stop(time + .24);
  }
}
