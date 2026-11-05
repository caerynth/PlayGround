import * as THREE from 'three';

const MAX = 520;

class PointPool {
  constructor(scene, { size = .09, additive = true, opacity = .9, gravity = 9 } = {}) {
    this.scene = scene;
    this.gravity = gravity;
    this.pos = new Float32Array(MAX * 3);
    this.col = new Float32Array(MAX * 3);
    this.vel = new Float32Array(MAX * 3);
    this.life = new Float32Array(MAX);
    this.max = new Float32Array(MAX);
    this.cursor = 0;
    for (let i = 0; i < MAX; i++) this.pos[i * 3 + 1] = -999;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    const mat = new THREE.PointsMaterial({
      size, vertexColors: true, transparent: true, opacity, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
    this.geo = geo;
  }
  spawn(position, color, count, speed = 2, up = 2, life = .7, spread = 1) {
    const c = new THREE.Color(color);
    for (let n = 0; n < count; n++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % MAX;
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * speed * spread;
      this.pos[i * 3] = position.x + (Math.random() - .5) * .25;
      this.pos[i * 3 + 1] = position.y + (Math.random() - .5) * .25;
      this.pos[i * 3 + 2] = position.z + (Math.random() - .5) * .25;
      this.vel[i * 3] = Math.cos(a) * r;
      this.vel[i * 3 + 1] = Math.random() * up + .5;
      this.vel[i * 3 + 2] = Math.sin(a) * r;
      const cc = c.clone().offsetHSL((Math.random() - .5) * .04, 0, (Math.random() - .5) * .25);
      this.col[i * 3] = cc.r; this.col[i * 3 + 1] = cc.g; this.col[i * 3 + 2] = cc.b;
      this.life[i] = life * (.6 + Math.random() * .8);
      this.max[i] = this.life[i];
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
  }
  update(dt) {
    let dirty = false;
    for (let i = 0; i < MAX; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.pos[i * 3 + 1] = -999; dirty = true; continue; }
      this.vel[i * 3 + 1] -= this.gravity * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      if (this.pos[i * 3 + 1] < .04) {
        this.pos[i * 3 + 1] = .04;
        this.vel[i * 3 + 1] *= -.28;
        this.vel[i * 3] *= .65; this.vel[i * 3 + 2] *= .65;
      }
      dirty = true;
    }
    if (dirty) this.geo.attributes.position.needsUpdate = true;
  }
}

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.sparks = new PointPool(scene, { size: .085, additive: true, opacity: .95, gravity: 7 });
    this.blood = new PointPool(scene, { size: .115, additive: false, opacity: .9, gravity: 12 });
    this.dust = new PointPool(scene, { size: .16, additive: false, opacity: .34, gravity: 1.8 });
    this.tracers = [];
    this.shells = [];
    this.debris = [];
    this.rings = [];
    this.lastBlood = 0;
  }

  shot(from, to) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = new THREE.LineBasicMaterial({ color: 0xffdc9c, transparent: true, opacity: .92, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, life: .065, max: .065 });
    this.sparks.spawn(to, 0xffc56f, 8, 3.2, 2.4, .42);
  }

  impact(position) {
    this.sparks.spawn(position, 0xffbd68, 6, 2.5, 1.6, .32);
    this.blood.spawn(position, 0x7d1b1a, 9, 2.0, 1.8, .55);
  }

  zombieHit(position) {
    this.blood.spawn(position, 0x8f1d1b, 11, 2.2, 2.2, .62);
    const now = performance.now();
    if (now - this.lastBlood > 70) {
      this.lastBlood = now;
      this.blood.spawn(position, 0x4a0f10, 5, 1.5, 1.4, .45);
    }
  }

  zombieDeath(position) {
    this.blood.spawn(position, 0x731515, 26, 2.8, 2.7, .85);
    this.blood.spawn(position, 0x3c0b0c, 12, 1.5, 1.3, 1.1);
    this.dust.spawn(position.clone().setY(.18), 0x8d7d6e, 9, 2.6, .7, .9);
    this.ring(position.clone().setY(.04), 0x8d1b18, .45, 2.4, .42);
  }

  barrierHit(position) {
    this.sparks.spawn(position, 0xffc47a, 5, 2.2, 1.2, .3);
    this.dust.spawn(position, 0x9f8e75, 5, 1.5, .8, .5);
  }

  breach(position) {
    this.dust.spawn(position.clone().setY(.4), 0x9c8972, 24, 4.5, 2.4, 1.2);
    this.sparks.spawn(position.clone().setY(.7), 0xffa14d, 14, 3.0, 2.0, .5);
    this.ring(position.clone().setY(.05), 0xb08d65, 1, 4.8, .8);
  }

  repair(position) {
    this.sparks.spawn(position, 0xffd583, 13, 2.4, 2.1, .5);
    this.dust.spawn(position, 0xb8a17f, 6, 1.4, .8, .6);
  }

  trap(position) {
    this.sparks.spawn(position, 0xffb85e, 15, 3.5, 2.0, .45);
    this.dust.spawn(position, 0x8a7662, 5, 1.8, .6, .5);
    this.ring(position.clone().setY(.04), 0xb83227, .5, 2.8, .35);
  }

  muzzle(position) {
    this.sparks.spawn(position, 0xffd07a, 4, 1.8, .7, .16);
  }

  shell(position, dir) {
    const geo = new THREE.CylinderGeometry(.018, .018, .075, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xe2ad55, toneMapped: false });
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(position);
    this.scene.add(m);
    this.shells.push({
      mesh: m, life: 2.1,
      vel: new THREE.Vector3((Math.random() - .5) * 1.5 + dir.x * .5, 2.6 + Math.random(), (Math.random() - .5) * 1.5 + dir.z * .5),
      rot: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8),
    });
  }

  debrisBurst(barrierGroup) {
    const wood = new THREE.MeshStandardMaterial({ color: 0x74563c, roughness: .9, flatShading: true, transparent: true });
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(.12 + Math.random() * .35, .07 + Math.random() * .12, .06 + Math.random() * .16), wood);
      const wp = new THREE.Vector3((Math.random() - .5) * 6.5, .4 + Math.random() * 2.1, (Math.random() - .5) * .3);
      barrierGroup.localToWorld(wp);
      m.position.copy(wp);
      this.scene.add(m);
      this.debris.push({
        mesh: m, life: 2.4,
        vel: new THREE.Vector3((Math.random() - .5) * 4.5, 2.2 + Math.random() * 3.5, (Math.random() - .5) * 4.5),
        rot: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      });
    }
  }

  ring(position, color = 0xffaa55, scale = 1, duration = .55, opacity = .5) {
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const m = new THREE.Mesh(new THREE.RingGeometry(.25, .36, 24), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.copy(position);
    m.scale.setScalar(scale * .4);
    this.scene.add(m);
    this.rings.push({ mesh: m, life: duration, max: duration, scale, opacity });
  }

  update(dt) {
    this.sparks.update(dt);
    this.blood.update(dt);
    this.dust.update(dt);
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      t.line.material.opacity = Math.max(0, t.life / t.max) * .92;
      if (t.life <= 0) { this.scene.remove(t.line); t.line.geometry.dispose(); t.line.material.dispose(); this.tracers.splice(i, 1); }
    }
    for (let i = this.shells.length - 1; i >= 0; i--) {
      const s = this.shells[i];
      s.life -= dt;
      s.vel.y -= 9.5 * dt;
      s.mesh.position.addScaledVector(s.vel, dt);
      s.mesh.rotation.x += s.rot.x * dt; s.mesh.rotation.y += s.rot.y * dt;
      if (s.mesh.position.y < .03) { s.mesh.position.y = .03; s.vel.y *= -.3; s.vel.x *= .7; s.vel.z *= .7; }
      if (s.life <= 0) { this.scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); this.shells.splice(i, 1); }
    }
    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.life -= dt;
      d.vel.y -= 12 * dt;
      d.mesh.position.addScaledVector(d.vel, dt);
      d.mesh.rotation.x += d.rot.x * dt; d.mesh.rotation.y += d.rot.y * dt;
      if (d.mesh.position.y < .05) { d.mesh.position.y = .05; d.vel.y *= -.24; d.vel.x *= .72; d.vel.z *= .72; d.rot.multiplyScalar(.75); }
      if (d.life <= 0) {
        d.mesh.material.opacity = Math.max(0, d.life);
        if (d.life < -.8) { this.scene.remove(d.mesh); d.mesh.geometry.dispose(); this.debris.splice(i, 1); }
      }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life -= dt;
      const p = 1 - r.life / r.max;
      r.mesh.scale.setScalar(r.scale * (.4 + p * 1.8));
      r.mesh.material.opacity = r.opacity * (1 - p);
      if (r.life <= 0) { this.scene.remove(r.mesh); r.mesh.geometry.dispose(); r.mesh.material.dispose(); this.rings.splice(i, 1); }
    }
  }

  clear() {
    this.tracers.forEach(t => { this.scene.remove(t.line); t.line.geometry.dispose(); t.line.material.dispose(); });
    this.tracers = [];
    this.shells.forEach(s => { this.scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); });
    this.shells = [];
    this.debris.forEach(d => { this.scene.remove(d.mesh); d.mesh.geometry.dispose(); });
    this.debris = [];
    this.rings.forEach(r => { this.scene.remove(r.mesh); r.mesh.geometry.dispose(); r.mesh.material.dispose(); });
    this.rings = [];
    this.sparks.life.fill(0); this.blood.life.fill(0); this.dust.life.fill(0);
    this.sparks.pos.fill(-999); this.blood.pos.fill(-999); this.dust.pos.fill(-999);
    this.sparks.geo.attributes.position.needsUpdate = true;
    this.blood.geo.attributes.position.needsUpdate = true;
    this.dust.geo.attributes.position.needsUpdate = true;
  }
}
