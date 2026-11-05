import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createWorld } from './world.js';
import { createSurvivor, animateSurvivor, updateMuzzle, flashMuzzle, createZombie, animateZombie, hitZombie } from './character.js';
import { Effects } from './fx.js';

const TOTAL_WAVES = 6;
const WAVES = [
  { count: 8, interval: .9, hp: 50, speed: 1.04, damage: 7, title: 'THE FIRST KNOCK' },
  { count: 11, interval: .8, hp: 62, speed: 1.12, damage: 8, title: 'UNPAID GUESTS' },
  { count: 15, interval: .7, hp: 78, speed: 1.2, damage: 9, title: 'THE DINER CROWD' },
  { count: 20, interval: .6, hp: 94, speed: 1.3, damage: 10, title: 'FULL HOUSE' },
  { count: 26, interval: .52, hp: 112, speed: 1.4, damage: 12, title: 'CHECKOUT TIME' },
  { count: 32, interval: .44, hp: 132, speed: 1.52, damage: 14, title: 'LAST CALL' },
];
const LANES = [
  { barrier: 0, spawn: new THREE.Vector3(1.2, 0, -11.6), out: new THREE.Vector3(0, 0, -1), tangent: new THREE.Vector3(1, 0, 0) },
  { barrier: 1, spawn: new THREE.Vector3(-12.1, 0, 1.2), out: new THREE.Vector3(-1, 0, 0), tangent: new THREE.Vector3(0, 0, 1) },
  { barrier: 2, spawn: new THREE.Vector3(12.1, 0, .8), out: new THREE.Vector3(1, 0, 0), tangent: new THREE.Vector3(0, 0, 1) },
];
const ARENA = { minX: -7.7, maxX: 7.7, minZ: -6.2, maxZ: 7.6 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
function dampAngle(a, b, lambda, dt) {
  let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  return a + d * (1 - Math.exp(-lambda * dt));
}
const horiz = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export class Game {
  constructor({ canvas, audio, ui, controls }) {
    this.canvas = canvas;
    this.audio = audio;
    this.ui = ui;
    this.controls = controls;
    this.mobile = controls.isTouch || innerWidth < 720;
    this.phase = 'menu';
    this.paused = false;
    this.elapsed = 0;
    this.waveIndex = 0;
    this.kills = 0;
    this.score = 0;
    this.scrap = 8;
    this.health = 100;
    this.maxHealth = 100;
    this.shells = 8;
    this.maxShells = 8;
    this.reloadT = 0;
    this.fireCd = 0;
    this.invuln = 0;
    this.hurtT = 0;
    this.lastHurt = 0;
    this.shake = 0;
    this.deathT = 0;
    this.breakT = 0;
    this.waveElapsed = 0;
    this.spawnQueue = [];
    this.spawned = 0;
    this.waveKills = 0;
    this.zombies = [];
    this.menuZombies = [];
    this.traps = [];
    this.targetZombie = null;
    this.facing = Math.PI;
    this.vel = new THREE.Vector3();
    this.camFocus = new THREE.Vector3(0, 1.1, 1);
    this.camPos = new THREE.Vector3(10, 9, 16);
    this.introCam = null;
    this.aimPulse = 0;
    this.beaconTimer = 0;
    this.growlTimer = 4;
    this.emberT = 0;
    this.best = this.loadBest();
    this.lastFrame = performance.now();
    this.lowFPS = 0;

    this.setupRenderer();
    this.setupScene();
    this.setupPlayer();
    this.effects = new Effects(this.scene);
    this.spawnMenuZombies();
    this.bindResize();
    this.renderer.setAnimationLoop((t) => this.frame(t));
  }

  loadBest() {
    try { return Number(localStorage.getItem('deadblock-best') || 0) || 0; } catch { return 0; }
  }
  saveBest() {
    if (this.score > this.best) { this.best = Math.floor(this.score); try { localStorage.setItem('deadblock-best', String(this.best)); } catch {} }
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: !this.mobile, powerPreference: 'high-performance', alpha: false, stencil: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.55 : 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.showFatal('The projector jammed. Reload the page to keep the dead at bay.'); });
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080a12);
    this.camera = new THREE.PerspectiveCamera(innerHeight > innerWidth ? 64 : innerWidth < 900 ? 52 : 47, innerWidth / innerHeight, .1, 160);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(0, 2.4, -5);
    this.world = createWorld(this.scene, { mobile: this.mobile });

    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: this.mobile ? 0 : 2 });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), this.mobile ? .52 : .72, .72, .58);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    // moon hover
    this.world.update(0, 0);
  }

  setupPlayer() {
    this.player = createSurvivor();
    this.player.root.scale.setScalar(1.08);
    this.scene.add(this.player.root);
    this.playerPos = new THREE.Vector3(0, 0, 2.4);
    this.player.root.position.copy(this.playerPos);
    this.player.root.rotation.y = Math.PI;
    this.player.root.visible = false;
    this.tmpA = new THREE.Vector3();
    this.tmpB = new THREE.Vector3();
    this.playerLight = new THREE.PointLight(0xffb27f, 5.8, 6.8, 2);
    this.playerLight.position.set(0, 3.1, 1);
    this.scene.add(this.playerLight);
  }

  spawnMenuZombies() {
    const spots = [
      [.6, -10.6, .05], [-11.4, 1.8, 1.3], [11.5, 1.4, -1.1], [-10.9, -3.9, 2.1], [11.1, -4.4, -2.4],
    ];
    for (const [x, z, r] of spots) {
      const zed = createZombie();
      zed.root.position.set(x, 0, z);
      zed.root.rotation.y = r;
      zed.root.scale.multiplyScalar(1.02);
      zed.phase = Math.random() * 10;
      zed.menuT = Math.random() * 5;
      zed.menuBase = new THREE.Vector3(x, 0, z);
      this.scene.add(zed.root);
      this.menuZombies.push(zed);
    }
  }

  clearMenuZombies() {
    this.menuZombies.forEach(z => { this.scene.remove(z.root); this.disposeObject(z.root); });
    this.menuZombies = [];
  }

  start() {
    this.audio.init().then(() => {
      this.audio.startMusic();
    });
    this.clearMenuZombies();
    this.resetGameData();
    this.ui.hideStart();
    this.ui.showHud();
    this.ui.reset();
    this.player.root.visible = true;
    this.playerPos.set(0, 0, 2.4);
    this.player.root.position.copy(this.playerPos);
    this.facing = Math.PI;
    this.camFocus.set(0, 1.1, 1);
    this.introCam = { t: 0 };
    this.phase = 'wave';
    this.controls.setEnabled(true);
    this.startWave(0);
    this.ui.toast('WAVE 1 — THE FIRST KNOCK');
    this.ui.objectiveSet('HOLD THE COURTYARD', 'Survive six waves until dawn');
    setTimeout(() => this.ui.fadeObjective(), 6500);
    this.audio.horn();
  }

  resetGameData() {
    this.phase = 'menu';
    this.paused = false;
    this.elapsed = 0;
    this.waveIndex = 0;
    this.kills = 0;
    this.score = 0;
    this.scrap = 8;
    this.health = 100;
    this.maxHealth = 100;
    this.shells = 8;
    this.reloadT = 0;
    this.fireCd = 0;
    this.invuln = 0;
    this.hurtT = 0;
    this.lastHurt = 0;
    this.shake = 0;
    this.deathT = 0;
    this.breakT = 0;
    this.waveElapsed = 0;
    this.spawnQueue = [];
    this.spawned = 0;
    this.waveKills = 0;
    this.targetZombie = null;
    this.vel.set(0, 0, 0);
    this.zombies.forEach(z => { this.scene.remove(z.root); this.disposeObject(z.root); });
    this.zombies = [];
    this.traps.forEach(t => this.scene.remove(t.group));
    this.traps = [];
    this.effects.clear();
    for (const b of this.world.barriers) {
      b.hp = b.maxHp; b.destroyed = false; b.shake = 0; b.planks.forEach(p => p.visible = true);
      b.group.position.y = 0; b.group.rotation.z = 0;
    }
    for (const z of this.menuZombies) { this.scene.remove(z.root); this.disposeObject(z.root); }
    this.menuZombies = [];
    this.player.recoil = 0;
    this.player.flashMat.opacity = 0;
    this.player.root.rotation.set(0, Math.PI, 0);
    this.player.root.visible = false;
    this.ui.hideEnd();
    this.ui.hideBreak();
    this.ui.showPause(false);
    this.ui.setHealth(100, 100);
    this.ui.setAmmo(8, 8, false);
    this.ui.setScore(0); this.ui.setScrap(8);
    this.ui.setBarriers(this.world.barriers);
    this.ui.showTarget(null, this.camera, false);
  }

  startWave(index) {
    this.waveIndex = index;
    this.waveConfig = WAVES[index];
    this.waveElapsed = 0;
    this.waveKills = 0;
    this.spawned = 0;
    this.phase = 'wave';
    this.breakT = 0;
    this.spawnQueue = [];
    const count = this.waveConfig.count;
    let t = .15;
    for (let i = 0; i < count; i++) {
      const brute = index >= 2 && i > 3 && Math.random() < .075;
      const runner = !brute && Math.random() < .16;
      const lane = (i % 3 + (index % 3)) % 3;
      this.spawnQueue.push({ t, brute, runner, lane });
      t += this.waveConfig.interval * (brute ? 1.7 : runner ? .72 : 1) * (this.mobile ? 1.12 : 1);
    }
    this.ui.hideBreak();
    this.ui.setWave(index, TOTAL_WAVES, 'wave');
    this.ui.setWaveProgress(0);
    this.ui.setBarriers(this.world.barriers);
    this.ui.objectiveSet(`WAVE ${index + 1} — ${this.waveConfig.title}`, index === TOTAL_WAVES - 1 ? 'Last call. Make it count.' : 'Defend all three barricades');
    setTimeout(() => this.ui.fadeObjective(), 4200);
    if (index > 0) {
      this.audio.horn();
      this.ui.toast(`WAVE ${index + 1} — ${this.waveConfig.title}`, index === TOTAL_WAVES - 1 ? 'bad' : '');
    }
  }

  completeWave() {
    this.phase = 'break';
    this.breakT = 8.5;
    const bonus = 6;
    this.scrap = Math.min(99, this.scrap + bonus);
    this.score += 700 + this.waveIndex * 350;
    this.health = Math.min(this.maxHealth, this.health + 26);
    this.shells = this.maxShells;
    this.reloadT = 0;
    for (const b of this.world.barriers) {
      b.destroyed = false;
      b.hp = Math.min(b.maxHp, Math.max(b.hp, b.maxHp * .62) + 100);
      b.planks.forEach(p => p.visible = true);
      b.group.position.y = 0; b.group.rotation.z = 0;
    }
    this.ui.setScrap(this.scrap);
    this.ui.setScore(this.score);
    this.ui.setHealth(this.health, this.maxHealth);
    this.ui.setAmmo(this.shells, this.maxShells, false);
    this.ui.setBarriers(this.world.barriers);
    this.ui.setWave(this.waveIndex, TOTAL_WAVES, 'break');
    this.ui.setWaveProgress(1);
    this.ui.showClear(bonus);
    this.ui.showBreak(this.breakT);
    this.ui.toast('LINE HELD — SUPPLIES DELIVERED', 'good');
    this.audio.levelUp();
    this.audio.stopMusic();
    if (this.waveIndex >= TOTAL_WAVES - 1) {
      setTimeout(() => this.victory(), 1600);
    }
  }

  nextWave() {
    this.ui.hideBreak();
    this.audio.startMusic();
    this.ui.setWaveProgress(0);
    this.startWave(this.waveIndex + 1);
  }

  victory() {
    if (this.phase === 'victory') return;
    this.phase = 'victory';
    this.controls.setEnabled(false);
    this.saveBest();
    this.score += 5000 + this.health * 20;
    this.ui.setScore(this.score);
    this.ui.setWave(TOTAL_WAVES - 1, TOTAL_WAVES, 'victory');
    this.ui.setWaveProgress(1);
    this.audio.victory();
    setTimeout(() => {
      this.ui.showEnd({ victory: true, waves: TOTAL_WAVES, kills: this.kills, score: Math.floor(this.score), best: this.best });
    }, 1500);
  }

  die() {
    if (this.phase === 'dead') return;
    this.phase = 'dead';
    this.deathT = 0;
    this.controls.setEnabled(false);
    this.saveBest();
    this.audio.death();
    this.audio.stopMusic();
    this.shake = 1.2;
    setTimeout(() => {
      this.ui.showEnd({ victory: false, waves: this.waveIndex + (this.phase === 'wave' ? 0 : 1), kills: this.kills, score: Math.floor(this.score), best: this.best });
    }, 1800);
  }

  retry() {
    this.ui.hideEnd();
    this.ui.showPause(false);
    this.ui.reset();
    this.phase = 'menu';
    this.paused = false;
    this.start();
  }

  quit() {
    this.audio.stopMusic();
    this.resetGameData();
    this.controls.setEnabled(false);
    this.ui.showStart();
    this.ui.showPause(false);
    this.ui.setPlaying(false);
    this.phase = 'menu';
    this.player.root.visible = false;
    this.spawnMenuZombies();
    this.camPos.set(10, 9, 16);
    this.camFocus.set(0, 1.1, 1);
  }

  pause() {
    if (!['wave', 'break'].includes(this.phase) || this.paused) return;
    this.paused = true;
    this.controls.setEnabled(false);
    this.ui.showPause(true);
    this.audio.stopMusic();
  }

  resume() {
    if (!this.paused) return;
    this.paused = false;
    this.controls.setEnabled(true);
    this.ui.showPause(false);
    if (this.phase === 'wave') this.audio.startMusic();
  }

  togglePause() {
    if (this.paused) this.resume();
    else if (['wave', 'break'].includes(this.phase)) this.pause();
  }

  bindResize() {
    this.onResize = () => {
      if (!this.renderer) return;
      const w = innerWidth, h = innerHeight;
      this.mobile = this.controls.isTouch || w < 720;
      this.camera.aspect = w / h;
      this.camera.fov = h > w ? 64 : w < 900 ? 52 : 47;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.composer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.55 : 2));
      this.bloom.strength = this.mobile ? .52 : .72;
    };
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', () => setTimeout(this.onResize, 160));
  }

  showFatal(text) {
    const el = document.getElementById('fatal');
    el.textContent = text;
    el.classList.remove('hidden');
  }

  frame(now) {
    const dt = Math.min(.05, Math.max(.001, (now - this.lastFrame) / 1000));
    this.lastFrame = now;
    if (!this.paused) this.update(dt);
    this.composer.render();
    this.adaptQuality(dt);
  }

  adaptQuality(dt) {
    // Fade bloom a touch when the camera is close to the ground on smaller screens.
    const portrait = innerWidth < innerHeight;
    if (this.bloom) this.bloom.strength = this.mobile ? (portrait ? .32 : .38) : .52;
  }

  update(dt) {
    this.elapsed += dt;
    if (this.phase === 'menu') {
      this.updateMenu(dt);
    } else {
      this.updateGame(dt);
    }
    this.world.update(this.elapsed, dt);
    this.effects.update(dt);
    this.updateCamera(dt);
    this.audio.update(this.zombies.length / 16);
    this.ui.setBarriers(this.world.barriers);
    if (this.phase !== 'menu') {
      this.emberT -= dt;
      if (this.emberT <= 0) {
        this.emberT = .09 + Math.random() * .14;
        this.effects.sparks.spawn(new THREE.Vector3(-5.2 + (Math.random() - .5) * .45, 1.55, 4.6 + (Math.random() - .5) * .45), 0xff7d35, 1, .65, 1.9, .85);
      }
    }
  }

  updateMenu(dt) {
    this.camPos.set(10.6 + Math.sin(this.elapsed * .05) * 1.1, 8.4 + Math.sin(this.elapsed * .09) * .35, 16.4 + Math.cos(this.elapsed * .04) * .8);
    this.camFocus.set(-.4, 2.6, -4.6);
    for (const z of this.menuZombies) {
      z.menuT += dt;
      const bob = Math.sin(this.elapsed * .7 + z.phase) * .4;
      z.root.position.x = z.menuBase.x + Math.sin(this.elapsed * .28 + z.phase) * .45;
      z.root.position.z = z.menuBase.z + bob;
      z.root.rotation.y += Math.sin(this.elapsed * .16 + z.phase) * dt * .1;
      animateZombie(z, this.elapsed, .25, 'walk');
    }
    this.player.root.visible = false;
    this.ui.showTarget(null, this.camera, false);
  }

  updateGame(dt) {
    this.fireCd = Math.max(0, this.fireCd - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.hurtT = Math.max(0, this.hurtT - dt);
    this.aimPulse += dt;
    this.growlTimer -= dt;

    if (this.phase === 'wave' || this.phase === 'break' || this.phase === 'victory') {
      this.updatePlayer(dt);
    }
    if (this.phase === 'wave') {
      this.updateWave(dt);
    } else if (this.phase === 'break') {
      this.breakT -= dt;
      this.ui.updateBreak(this.breakT);
      if (this.breakT <= 0) this.nextWave();
    } else if (this.phase === 'dead') {
      this.updateDeath(dt);
    }

    this.updateZombies(dt);
    this.updateTraps(dt);
    this.updateTarget();
    this.ui.setHealth(this.health, this.maxHealth, this.hurtT > 0);
    this.ui.setAmmo(this.shells, this.maxShells, this.reloadT > 0);
    this.ui.setScore(Math.floor(this.score));
    this.ui.setScrap(this.scrap);
    this.updateReload(dt);
    this.updateHealthRegen(dt);

    if (this.phase === 'wave') {
      const progress = this.waveConfig.count ? this.waveKills / this.waveConfig.count : 0;
      this.ui.setWaveProgress(progress);
    }
    this.ui.setRepairReady(this.nearestBarrier() !== null);

    if (this.growlTimer <= 0 && this.zombies.length) {
      this.growlTimer = rr(3.5, 7.5);
      this.audio.growl();
    }
  }

  updatePlayer(dt) {
    const phaseAllows = this.phase === 'wave' || this.phase === 'break';
    const move = phaseAllows ? this.controls.movement() : { x: 0, z: 0, len: 0 };
    const speed = this.controls.firing ? 4.1 : 5.15;
    const targetVX = move.x * speed;
    const targetVZ = move.z * speed;
    this.vel.x = damp(this.vel.x, targetVX, 13, dt);
    this.vel.z = damp(this.vel.z, targetVZ, 13, dt);
    this.playerPos.x = clamp(this.playerPos.x + this.vel.x * dt, ARENA.minX, ARENA.maxX);
    this.playerPos.z = clamp(this.playerPos.z + this.vel.z * dt, ARENA.minZ, ARENA.maxZ);
    this.player.root.position.copy(this.playerPos);
    this.playerPos.y = 0;
    const moving = Math.hypot(this.vel.x, this.vel.z);

    const target = this.findTarget();
    this.targetZombie = target;
    if (this.controls.firing && target) {
      const dx = target.root.position.x - this.playerPos.x;
      const dz = target.root.position.z - this.playerPos.z;
      this.facing = dampAngle(this.facing, Math.atan2(dx, dz), 18, dt);
    } else if (move.len > .06) {
      this.facing = dampAngle(this.facing, Math.atan2(move.x, move.z), 13, dt);
    }
    this.player.root.rotation.y = this.facing;
    this.player.root.position.y = Math.sin(this.elapsed * 19) * .012 * Math.min(1, moving);
    animateSurvivor(this.player, this.elapsed, Math.min(1, moving / 4.6), dt);
    updateMuzzle(this.player, dt);

    if (this.controls.firing && this.fireCd <= 0 && this.reloadT <= 0) {
      this.shoot();
    }
    this.ui.showTarget(target ? this.tmpA.copy(target.root.position).setY(target.root.position.y + 1.75) : null, this.camera, !!target);
    this.updateNearBarrier();
  }

  updateNearBarrier() {
    const near = this.nearestBarrier();
    this.ui.setRepairReady(near !== null && near.hp < near.maxHp && this.scrap >= 2);
  }

  nearestBarrier() {
    let best = null, bestD = 3.6;
    for (const b of this.world.barriers) {
      const d = horiz(b.pos, this.playerPos);
      if (d < bestD) { best = b; bestD = d; }
    }
    return best;
  }

  updateReload(dt) {
    if (this.reloadT > 0) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) {
        this.reloadT = 0;
        this.shells = this.maxShells;
        this.audio.reloadDone();
        this.ui.setAmmo(this.shells, this.maxShells, false);
      }
    }
  }

  updateHealthRegen(dt) {
    if (this.phase !== 'wave' && this.phase !== 'break') return;
    if (this.elapsed - this.lastHurt > 5.5 && this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + dt * 3.4);
    }
  }

  startReload() {
    if (this.reloadT > 0 || this.shells >= this.maxShells) return;
    this.reloadT = 1.32;
    this.audio.reload();
    this.ui.setAmmo(this.shells, this.maxShells, true);
  }

  shoot() {
    if (!['wave', 'break'].includes(this.phase)) return;
    if (this.reloadT > 0) return;
    if (this.shells <= 0) { this.audio.empty(); this.startReload(); return; }
    this.shells--;
    this.fireCd = .46;
    flashMuzzle(this.player);
    this.audio.shot();
    this.shake = Math.max(this.shake, .23);
    const muzzle = this.player.muzzle.getWorldPosition(new THREE.Vector3());
    this.effects.muzzle(muzzle);
    const dir = new THREE.Vector3(Math.sin(this.facing), 0, Math.cos(this.facing));
    this.effects.shell(muzzle.clone().add(new THREE.Vector3(.1, -.02, -.1)), dir);
    const target = this.findTarget();
    if (target) {
      const hit = this.tmpB.copy(target.root.position).setY(target.root.position.y + .9 + Math.random() * .65);
      hit.x += (Math.random() - .5) * .35; hit.z += (Math.random() - .5) * .35;
      const crit = Math.random() < .17;
      const base = 62 + this.waveIndex * 8;
      const dmg = Math.round(base * (crit ? 1.7 : 1) * (0.92 + Math.random() * .16));
      this.damageZombie(target, dmg, crit, hit);
      for (const other of this.zombies) {
        if (other === target || other.dying) continue;
        if (horiz(other.root.position, target.root.position) < 2.05) {
          this.damageZombie(other, Math.round(base * .24), false, this.tmpA.copy(other.root.position).setY(other.root.position.y + 1));
        }
      }
      this.effects.shot(muzzle, hit);
      this.effects.impact(hit);
      this.ui.hitPulse(crit);
    } else {
      const hit = this.playerPos.clone().addScaledVector(dir, 10).setY(1.1);
      this.effects.shot(muzzle, hit);
    }
    this.ui.setAmmo(this.shells, this.maxShells, false);
    if (this.shells <= 0) this.startReload();
  }

  findTarget() {
    let best = null, bestD = 15.5;
    for (const z of this.zombies) {
      if (z.dying || z.hp <= 0) continue;
      const d = horiz(z.root.position, this.playerPos);
      if (d >= bestD) continue;
      const p = this.tmpB.copy(z.root.position).setY(1.2).project(this.camera);
      if (p.z > 1 || Math.abs(p.x) > 1.08 || p.y < -1 || p.y > .95) continue;
      bestD = d; best = z;
    }
    return best;
  }

  damageZombie(z, dmg, crit, pos) {
    if (z.dying) return;
    z.hp -= dmg;
    hitZombie(z);
    this.score += dmg * (crit ? 2.2 : 1.2);
    this.ui.floatText(pos, this.camera, crit ? `${dmg}!` : `${dmg}`, crit ? 'crit' : '');
    this.effects.zombieHit(pos);
    if (Math.random() < .28) this.audio.hit();
    if (z.hp <= 0) this.killZombie(z, crit);
  }

  killZombie(z, crit) {
    if (z.dying) return;
    z.dying = true;
    z.deathT = 0;
    z.deathRoll = (Math.random() - .5) * .45;
    if (z.hpBar) z.hpBar.visible = false;
    this.kills++;
    this.waveKills++;
    const gain = 1 + (Math.random() < .16 ? 1 : 0);
    this.scrap = Math.min(99, this.scrap + gain);
    this.score += 110 + this.waveIndex * 22 + (crit ? 75 : 0);
    this.effects.zombieDeath(z.root.position.clone().setY(1));
    this.audio.splat();
    if (Math.random() < .17) this.ui.floatText(z.root.position.clone().setY(2.1), this.camera, `+${gain} ✦`, 'kill');
    if (this.targetZombie === z) this.targetZombie = null;
  }

  updateWave(dt) {
    this.waveElapsed += dt;
    const cap = this.mobile ? 13 : 19;
    while (this.spawnQueue.length && this.spawnQueue[0].t <= this.waveElapsed) {
      if (this.zombies.filter(z => !z.dying).length >= cap) break;
      const s = this.spawnQueue.shift();
      this.spawnZombie(s.lane, s.brute, s.runner);
    }
    if (!this.spawnQueue.length && this.zombies.every(z => z.dying)) {
      this.completeWave();
    }
  }

  spawnZombie(laneIndex, brute = false, runner = false) {
    const z = createZombie();
    const lane = LANES[laneIndex];
    const spread = lane.tangent;
    const spawn = lane.spawn.clone();
    spawn.x += spread.x * rr(-1.5, 1.5);
    spawn.z += spread.z * rr(-1.5, 1.5);
    z.root.position.copy(spawn);
    const cfg = this.waveConfig;
    let speed = cfg.speed * rr(.86, 1.12) * (this.mobile ? .92 : 1);
    let hp = cfg.hp * rr(.84, 1.16);
    let scale = rr(1.06, 1.22);
    if (runner) { speed *= 1.58; hp *= .68; scale *= .94; }
    if (brute) { speed *= .7; hp *= 2.2; scale *= 1.28; }
    z.root.scale.setScalar(scale);
    z.hp = hp; z.maxHp = hp; z.speed = speed; z.damage = cfg.damage * (brute ? 1.45 : runner ? .8 : 1);
    z.isBrute = brute;
    z.lane = laneIndex;
    z.offset = rr(-2.45, 2.45);
    z.phase = Math.random() * 10;
    z.attackT = 0;
    z.stun = 0;
    z.dying = false;
    z.state = 'walk';
    if (runner) {
      z.root.traverse(o => { if (o.material && o.material.color && o.material.type === 'MeshStandardMaterial') o.material.emissive?.setHex(0x220000); });
    }
    z.root.rotation.y = Math.atan2(this.playerPos.x - spawn.x, this.playerPos.z - spawn.z);
    this.scene.add(z.root);
    this.zombies.push(z);
    this.effects.dust.spawn(spawn.clone().setY(.2), 0x9c8267, 5, 1.7, .4, .6);
  }

  updateZombies(dt) {
    const active = this.zombies.filter(z => !z.dying);
    for (const z of this.zombies) {
      if (z.dying) {
        z.deathT += dt;
        const p = Math.min(1, z.deathT / .55);
        z.root.rotation.x = -p * Math.PI * .48;
        z.root.rotation.z += z.deathRoll * dt;
        if (z.deathT > 1.35) z.root.position.y -= dt * 1.1;
        if (z.deathT > 2.2) z.remove = true;
        continue;
      }
      z.attackT = Math.max(0, z.attackT - dt);
      if (z.stun > 0) {
        z.stun -= dt;
        animateZombie(z, this.elapsed, .12, 'walk');
        continue;
      }
      const barrier = this.world.barriers[z.lane];
      const barrierOpen = barrier.destroyed || barrier.hp <= 0;
      let targetX, targetZ, targetIsBarrier = false;
      if (!barrierOpen) {
        const lane = LANES[z.lane];
        targetX = barrier.pos.x + lane.out.x * .58 + lane.tangent.x * z.offset;
        targetZ = barrier.pos.z + lane.out.z * .58 + lane.tangent.z * z.offset;
        targetIsBarrier = true;
      } else {
        targetX = this.playerPos.x;
        targetZ = this.playerPos.z;
      }
      let dx = targetX - z.root.position.x;
      let dz = targetZ - z.root.position.z;
      let dist = Math.hypot(dx, dz);
      // separation from other walkers
      let sx = 0, sz = 0;
      for (const o of active) {
        if (o === z) continue;
        const ox = z.root.position.x - o.root.position.x;
        const oz = z.root.position.z - o.root.position.z;
        const od = Math.hypot(ox, oz);
        if (od > .001 && od < 1.02) {
          sx += (ox / od) * (1.02 - od) * 2.2;
          sz += (oz / od) * (1.02 - od) * 2.2;
        }
      }
      // keep out of the player's capsule
      const pd = horiz(z.root.position, this.playerPos);
      if (pd < .78 && !targetIsBarrier) {
        const kick = (.78 - pd) * 3;
        sx += (z.root.position.x - this.playerPos.x) * kick;
        sz += (z.root.position.z - this.playerPos.z) * kick;
      }

      const attackingBarrier = targetIsBarrier && dist < .72;
      const attackingPlayer = !targetIsBarrier && dist < 1.18;
      if (attackingBarrier) {
        z.state = 'attack';
        if (z.attackT <= 0) {
          z.attackT = 1.05;
          this.hitBarrier(barrier, z);
        }
      } else if (attackingPlayer) {
        z.state = 'attack';
        if (z.attackT <= 0) {
          z.attackT = 1.0;
          this.hurtPlayer(z.damage);
        }
      } else {
        z.state = 'walk';
        if (dist > .01) {
          const vx = dx / dist, vz = dz / dist;
          const sp = z.speed * (z === this.targetZombie ? .94 : 1);
          z.root.position.x += (vx * sp + sx) * dt;
          z.root.position.z += (vz * sp + sz) * dt;
        }
      }
      z.root.rotation.y = dampAngle(z.root.rotation.y, Math.atan2(targetX - z.root.position.x, targetZ - z.root.position.z), 7, dt);
      animateZombie(z, this.elapsed, z.speed, z.state);
      if (z.hpBar) {
        const ratio = clamp(z.hp / z.maxHp, 0, 1);
        const show = z.isBrute || ratio < .999;
        z.hpBar.visible = show;
        if (show) {
          z.hpBar.lookAt(this.camera.position);
          z.hpFill.scale.x = Math.max(.001, ratio);
          z.hpFill.position.x = -(.92 * (1 - ratio)) / 2;
          z.hpFill.material.color.setHex(ratio > .55 ? 0x9bd06f : ratio > .25 ? 0xf2a73b : 0xd74b40);
        }
      }
    }
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      if (this.zombies[i].remove) {
        this.scene.remove(this.zombies[i].root);
        this.disposeObject(this.zombies[i].root);
        this.zombies.splice(i, 1);
      }
    }
  }

  hitBarrier(barrier, z) {
    if (barrier.destroyed) return;
    barrier.hp -= z.damage * 1.6;
    barrier.shake = 1;
    const hit = barrier.group.position.clone().add(new THREE.Vector3((Math.random() - .5) * 4, .8 + Math.random() * 1.2, (Math.random() - .5) * .4));
    this.effects.barrierHit(hit);
    if (Math.random() < .65) this.audio.hit();
    if (barrier.hp <= 0) {
      barrier.hp = 0;
      barrier.destroyed = true;
      barrier.planks.forEach(p => p.visible = false);
      this.effects.debrisBurst(barrier.group);
      this.effects.breach(barrier.pos.clone().setY(.5));
      this.shake = Math.max(this.shake, .75);
      this.audio.trap();
      this.ui.toast(`${barrier.label} BARRICADE BREACHED`, 'bad');
      this.ui.setBarriers(this.world.barriers);
    }
  }

  hurtPlayer(amount) {
    if (this.phase !== 'wave' || this.invuln > 0) return;
    this.health -= amount;
    this.invuln = .42;
    this.hurtT = .5;
    this.lastHurt = this.elapsed;
    this.shake = Math.max(this.shake, .35);
    this.ui.damage();
    this.audio.hurt();
    if (navigator.vibrate) navigator.vibrate(24);
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  updateTraps(dt) {
    for (const t of this.traps) {
      t.pulse += dt;
      t.jaw.rotation.z = Math.sin(t.pulse * 2.8) * .04;
      t.glow.material.opacity = .2 + Math.sin(t.pulse * 4) * .08;
      if (t.dead) {
        t.deadT += dt;
        t.group.scale.setScalar(Math.max(.01, 1 - t.deadT * 2.5));
        if (t.deadT > .35) t.remove = true;
        continue;
      }
      for (const z of this.zombies) {
        if (z.dying || z.stun > 0) continue;
        if (horiz(z.root.position, t.group.position) < .8) {
          this.damageZombie(z, 58 + this.waveIndex * 7, false, z.root.position.clone().setY(1));
          z.stun = 2.9;
          z.attackT = .8;
          t.dead = true; t.deadT = 0;
          this.effects.trap(t.group.position.clone().setY(.5));
          this.audio.trap();
          this.shake = Math.max(this.shake, .18);
          this.ui.toast('TRAP SPRUNG', 'good');
          break;
        }
      }
    }
    for (let i = this.traps.length - 1; i >= 0; i--) if (this.traps[i].remove) { this.scene.remove(this.traps[i].group); this.traps.splice(i, 1); }
  }

  updateDeath(dt) {
    this.deathT += dt;
    // slow cinematic pull away
    this.camFocus.lerp(new THREE.Vector3(this.playerPos.x, .4, this.playerPos.z), 1 - Math.exp(-2 * dt));
    this.player.root.rotation.z = Math.min(1.2, this.player.root.rotation.z + dt * 1.4);
    this.player.root.position.y = Math.max(-.25, this.player.root.position.y - dt * .18);
  }

  updateTarget() {
    if (this.phase === 'wave' || this.phase === 'break') {
      const target = this.findTarget();
      this.targetZombie = target;
      if (target) this.ui.showTarget(this.tmpA.copy(target.root.position).setY(target.root.position.y + 1.75), this.camera, true);
      else this.ui.showTarget(null, this.camera, false);
    } else {
      this.ui.showTarget(null, this.camera, false);
    }
  }

  useRepair() {
    if (!['wave', 'break'].includes(this.phase)) return;
    const barrier = this.nearestBarrier();
    if (!barrier) { this.ui.toast('MOVE TO A BARRICADE', 'bad'); return; }
    if (this.scrap < 2) { this.ui.toast('NEED 2 SCRAP', 'bad'); return; }
    if (barrier.destroyed) {
      this.scrap -= 2;
      barrier.destroyed = false;
      barrier.hp = barrier.maxHp * .35;
      barrier.shake = .4;
      barrier.group.position.y = 0; barrier.group.rotation.z = 0;
      barrier.planks.forEach(p => p.visible = true);
      this.score += 60;
      const pos = barrier.pos.clone().add(new THREE.Vector3(0, 1.1, 0));
      this.effects.repair(pos);
      this.audio.repair();
      this.ui.toast('BARRICADE REBUILT', 'good');
      this.ui.setScrap(this.scrap);
      this.ui.setBarriers(this.world.barriers);
      return;
    }
    if (barrier.hp >= barrier.maxHp) { this.ui.toast('BARRICADE IS SOLID', 'bad'); return; }
    this.scrap -= 2;
    barrier.hp = Math.min(barrier.maxHp, barrier.hp + 130);
    barrier.shake = .35;
    this.score += 35;
    const pos = barrier.pos.clone().add(new THREE.Vector3(0, 1.4, 0));
    this.effects.repair(pos);
    this.audio.repair();
    this.ui.toast('BARRICADE PATCHED', 'good');
    this.ui.setScrap(this.scrap);
    this.ui.setBarriers(this.world.barriers);
  }

  useTrap() {
    if (!['wave', 'break'].includes(this.phase)) return;
    if (this.traps.filter(t => !t.dead).length >= 5) { this.ui.toast('FIVE TRAPS MAX', 'bad'); return; }
    if (this.scrap < 3) { this.ui.toast('NEED 3 SCRAP', 'bad'); return; }
    this.scrap -= 3;
    const dir = new THREE.Vector3(Math.sin(this.facing), 0, Math.cos(this.facing));
    const pos = this.playerPos.clone().addScaledVector(dir, .7);
    pos.x = clamp(pos.x, ARENA.minX + .2, ARENA.maxX - .2);
    pos.z = clamp(pos.z, ARENA.minZ + .2, ARENA.maxZ - .2);
    const group = new THREE.Group();
    group.position.copy(pos); group.rotation.y = this.facing;
    const metal = new THREE.MeshStandardMaterial({ color: 0x5f6464, roughness: .4, metalness: .7, flatShading: true });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.47, .5, .06, 10), metal);
    base.position.y = .04; base.receiveShadow = true; group.add(base);
    const jaw = new THREE.Group();
    for (const s of [-1, 1]) {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(.34, .055, 5, 9, Math.PI), metal);
      arc.rotation.x = -Math.PI / 2; arc.rotation.z = s > 0 ? 0 : Math.PI;
      arc.position.set(0, .1, 0); jaw.add(arc);
      for (let i = 0; i < 4; i++) {
        const tooth = new THREE.Mesh(new THREE.ConeGeometry(.045, .18, 4), metal);
        const a = (i / 3) * Math.PI;
        tooth.position.set(Math.cos(a) * .34 * s, .2, Math.sin(a) * .34);
        tooth.rotation.x = Math.PI; jaw.add(tooth);
      }
    }
    group.add(jaw);
    const glow = new THREE.Mesh(new THREE.RingGeometry(.58, .7, 20), new THREE.MeshBasicMaterial({ color: 0xff5b3e, transparent: true, opacity: .22, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = .05; group.add(glow);
    this.scene.add(group);
    this.traps.push({ group, jaw, glow, pulse: 0, dead: false, deadT: 0 });
    this.effects.dust.spawn(pos.clone().setY(.2), 0x8e7d69, 6, 1.4, .5, .45);
    this.audio.build();
    this.ui.toast('BEAR TRAP SET', 'good');
    this.ui.setScrap(this.scrap);
  }

  updateCamera(dt) {
    if (this.phase === 'menu') {
      this.camera.position.lerp(this.camPos, 1 - Math.exp(-3 * dt));
      const look = this.tmpA.copy(this.camFocus);
      this.camera.lookAt(look);
      return;
    }
    const portrait = innerHeight > innerWidth;
    const narrow = innerWidth < 900;
    const wantFov = portrait ? 64 : narrow ? 52 : 47;
    if (Math.abs(this.camera.fov - wantFov) > .01) {
      this.camera.fov = wantFov;
      this.camera.updateProjectionMatrix();
    }
    let offX = 0, offY = portrait ? 14.8 : narrow ? 12.0 : 12.1;
    let offZ = portrait ? 15.4 : narrow ? 15.2 : 15.8;
    const focus = this.tmpA.copy(this.playerPos);
    focus.y = 1.25;
    focus.x += this.vel.x * .14;
    focus.z += this.vel.z * .12 - (portrait ? 2.35 : 1.35);
    this.camFocus.lerp(focus, 1 - Math.exp(-5.4 * dt));
    this.playerLight.position.set(this.playerPos.x, 3.1, this.playerPos.z + .6);
    let targetX = this.camFocus.x + offX;
    let targetY = offY;
    let targetZ = this.camFocus.z + offZ;
    if (this.phase === 'dead') {
      const p = Math.min(1, this.deathT / 3);
      targetY = offY + p * 5;
      targetZ = this.camFocus.z + offZ + p * 3.5;
    }
    if (this.introCam) {
      this.introCam.t += dt;
      const p = Math.min(1, this.introCam.t / .95);
      const ease = 1 - Math.pow(1 - p, 3);
      this.camera.position.x = damp(this.camera.position.x, this.camPos.x + (targetX - this.camPos.x) * ease, 6, dt);
      this.camera.position.y = damp(this.camera.position.y, this.camPos.y + (targetY - this.camPos.y) * ease, 6, dt);
      this.camera.position.z = damp(this.camera.position.z, this.camPos.z + (targetZ - this.camPos.z) * ease, 6, dt);
      if (p >= 1) this.introCam = null;
    } else {
      this.camera.position.x = damp(this.camera.position.x, targetX, 4.5, dt);
      this.camera.position.y = damp(this.camera.position.y, targetY, 4.5, dt);
      this.camera.position.z = damp(this.camera.position.z, targetZ, 4.5, dt);
    }
    if (this.shake > 0) {
      const s = this.shake;
      this.camera.position.x += (Math.random() - .5) * s;
      this.camera.position.y += (Math.random() - .5) * s * .7;
      this.camera.position.z += (Math.random() - .5) * s;
      this.shake = Math.max(0, this.shake - dt * 2.1);
    }
    this.camera.lookAt(this.camFocus.x, this.camFocus.y + 0.15, this.camFocus.z - .4);
    if (this.phase === 'dead') this.camera.rotation.z += Math.min(.08, this.deathT * .02);
  }

  disposeObject(root) {
    const geos = new Set(), mats = new Set();
    root.traverse(o => {
      if (o.geometry && !o.isSprite) geos.add(o.geometry);
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(m => mats.add(m));
        else mats.add(o.material);
      }
    });
    geos.forEach(g => g.dispose());
    mats.forEach(m => { if (m.map && !m.userData?.shared) m.map.dispose(); m.dispose(); });
  }
}

function rr(a, b) { return a + Math.random() * (b - a); }
