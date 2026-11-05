import * as THREE from 'three';

const SKIN = [0xd8b18b, 0xa87758, 0x7d513c, 0xc29470, 0x875e45];
const SHIRTS = [0x626b55, 0x7d3d37, 0x4c5c74, 0x8d7854, 0x5a3e58, 0x7e7a69, 0x385957];
const PANTS = [0x33363f, 0x4b4038, 0x2d3430, 0x554a40, 0x3c3a4c];

function flat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.03, flatShading: true, ...extra });
}

const blobTex = (() => {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 31);
  grd.addColorStop(0, 'rgba(0,0,0,.56)'); grd.addColorStop(.65, 'rgba(0,0,0,.28)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
})();

const eyeGlowTex = (() => {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 1, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,236,184,1)'); grd.addColorStop(.28, 'rgba(255,168,72,.8)'); grd.addColorStop(.62, 'rgba(210,70,32,.2)'); grd.addColorStop(1, 'rgba(160,30,15,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();

function blob(shadowScale = 1) {
  const mat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: .75 });
  mat.userData.shared = true;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(shadowScale, shadowScale),
    mat
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = .015;
  return m;
}

function meshBox(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function createSurvivor() {
  const root = new THREE.Group();
  root.name = 'survivor';
  const body = new THREE.Group();
  root.add(body);
  root.add(blob(1.4));

  const jacket = flat(0x6d312d, { roughness: .9 });
  const jacketDark = flat(0x542a27, { roughness: .92 });
  const shirt = flat(0xd4c2a0, { roughness: .95 });
  const jeans = flat(0x35414e, { roughness: .92 });
  const boots = flat(0x2d211d, { roughness: .76 });
  const skin = flat(0x916044, { roughness: .92 });
  const hair = flat(0x241d1b, { roughness: .9 });
  const metal = flat(0x595a5e, { roughness: .35, metalness: .7 });

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.17, .92, 0);
  leftLeg.add(meshBox(.26, .78, .28, jeans, 0, -.38, 0));
  leftLeg.add(meshBox(.3, .2, .42, boots, 0, -.84, .05));
  leftLeg.add(meshBox(.29, .35, .3, jacketDark, 0, -.66, -.01));
  body.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.x = .17;
  body.add(rightLeg);

  const torso = meshBox(.64, .7, .38, jacket, 0, 1.27, 0);
  body.add(torso);
  // shirt V
  const vShirt = meshBox(.26, .32, .02, shirt, 0, 1.42, .2, false);
  vShirt.rotation.z = 0; body.add(vShirt);
  // collar
  for (const s of [-1, 1]) {
    const c = meshBox(.22, .1, .13, jacketDark, .11 * s, 1.61, .15);
    c.rotation.z = s * .4; body.add(c);
  }
  // belt
  body.add(meshBox(.66, .1, .4, boots, 0, .92, 0));
  body.add(meshBox(.12, .12, .04, metal, 0, .92, .22, false));
  // neck
  body.add(meshBox(.2, .16, .2, skin, 0, 1.68, 0));
  // head
  const head = new THREE.Mesh(new THREE.CapsuleGeometry(.19, .16, 4, 8), skin);
  head.position.set(0, 1.88, .02); head.castShadow = true; body.add(head);
  // nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.05, .12, 4), skin);
  nose.rotation.x = Math.PI / 2; nose.position.set(0, 1.87, .22); body.add(nose);
  // eyes
  for (const x of [-.075, .075]) body.add(meshBox(.045, .045, .02, flat(0x171512), x, 1.92, .2, false));
  // brow
  body.add(meshBox(.27, .035, .025, hair, 0, 1.965, .2, false));
  // hair cap
  const capBrim = meshBox(.36, .055, .24, flat(0x4f3a22), 0, 2.035, .16, false);
  const capTop = new THREE.Mesh(new THREE.SphereGeometry(.205, 8, 5, 0, Math.PI * 2, 0, Math.PI * .48), flat(0x5f4827));
  capTop.position.set(0, 2.02, 0); capTop.scale.z = 1.1; capTop.castShadow = true;
  body.add(capTop); body.add(capBrim);
  const hairSide = meshBox(.38, .16, .08, hair, 0, 1.92, -.17, false); body.add(hairSide);
  // bandana
  body.add(meshBox(.54, .12, .4, flat(0x9c3931), 0, 1.59, 0));

  const leftArm = new THREE.Group();
  leftArm.position.set(-.4, 1.55, 0);
  leftArm.add(meshBox(.18, .5, .2, jacket, 0, -.23, 0));
  leftArm.add(meshBox(.16, .38, .18, jacketDark, 0, -.62, .03));
  leftArm.add(meshBox(.14, .16, .16, skin, 0, -.86, .05));
  body.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(.4, 1.55, 0);
  rightArm.add(meshBox(.18, .5, .2, jacket, 0, -.23, 0));
  rightArm.add(meshBox(.16, .38, .18, jacketDark, 0, -.62, .03));
  rightArm.add(meshBox(.14, .16, .16, skin, 0, -.86, .05));
  body.add(rightArm);

  // shotgun, held at hip / chest
  const gun = new THREE.Group();
  gun.position.set(.14, 1.34, .27);
  const stock = meshBox(.12, .16, .45, flat(0x56392b), 0, -.04, -.38);
  stock.rotation.x = -.08; gun.add(stock);
  gun.add(meshBox(.1, .1, .95, flat(0x383a3d, { metalness: .8, roughness: .32 }), 0, .03, .28));
  gun.add(meshBox(.09, .08, .88, flat(0x54575a, { metalness: .75, roughness: .28 }), 0, .11, .3));
  gun.add(meshBox(.17, .16, .2, flat(0x4b2f23), 0, -.05, -.05));
  gun.add(meshBox(.12, .06, .18, flat(0x6b4a37), 0, -.17, .04));
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, .06, .75); gun.add(muzzle);
  // muzzle flash
  const flashMat = new THREE.MeshBasicMaterial({ color: 0xffd38a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const flash = new THREE.Group();
  const flashCore = new THREE.Mesh(new THREE.ConeGeometry(.16, .68, 5), flashMat);
  flashCore.rotation.x = -Math.PI / 2; flashCore.position.z = .3; flash.add(flashCore);
  const flashSide = new THREE.Mesh(new THREE.ConeGeometry(.1, .42, 4), flashMat);
  flashSide.rotation.z = Math.PI / 2; flashSide.position.set(.2, 0, .08); flash.add(flashSide);
  const flashSide2 = flashSide.clone(); flashSide2.rotation.z = -Math.PI / 2; flashSide2.position.x = -.2; flash.add(flashSide2);
  const flashLight = new THREE.PointLight(0xffa447, 0, 7, 2);
  flash.add(flashLight);
  flash.position.set(0, .06, .75); flash.visible = false;
  gun.add(flash);
  body.add(gun);

  // ammo bandolier
  const band = meshBox(.56, .12, .41, flat(0x674232), 0, 1.28, 0);
  band.rotation.z = .5; body.add(band);
  for (let i = 0; i < 5; i++) body.add(meshBox(.055, .14, .03, flat(0xb58a52), -.22 + i * .11, 1.28 + (i - 2) * .105, .22, false));

  const state = { root, body, leftLeg, rightLeg, leftArm, rightArm, gun, muzzle, flash, flashMat, flashLight, aim: 0, recoil: 0 };

  root.userData = state;
  return state;
}

export function animateSurvivor(p, t, speed, dt) {
  const s = Math.min(1, speed);
  const walk = Math.sin(t * 10.5) * .58 * s;
  const bob = Math.abs(Math.sin(t * 10.5)) * .045 * s;
  p.leftLeg.rotation.x = walk;
  p.rightLeg.rotation.x = -walk;
  p.leftArm.rotation.x = -walk * .62 + .08;
  p.rightArm.rotation.x = walk * .35 - .3;
  p.leftArm.rotation.z = .06;
  p.rightArm.rotation.z = -.16;
  p.body.position.y = bob + Math.sin(t * 1.8) * .012;
  p.body.rotation.z = Math.sin(t * 10.5) * .02 * s;
  p.body.rotation.x = s * .035;
  p.gun.rotation.x = -.05 - p.recoil * .16;
  p.gun.position.z = .27 - p.recoil * .1;
  if (p.recoil > 0) p.recoil = Math.max(0, p.recoil - dt * 7.5);
  p.flash.visible = p.flashMat.opacity > .02;
}

export function flashMuzzle(p) {
  p.recoil = 1;
  p.flashMat.opacity = 1;
  p.flash.rotation.z = Math.random() * Math.PI * 2;
  p.flash.scale.setScalar(.8 + Math.random() * .55);
  p.flashLight.intensity = 45;
}
export function updateMuzzle(p, dt) {
  if (p.flashMat.opacity > 0) {
    p.flashMat.opacity = Math.max(0, p.flashMat.opacity - dt * 13);
    p.flashLight.intensity = Math.max(0, p.flashLight.intensity - dt * 500);
  }
}

export function createZombie() {
  const root = new THREE.Group();
  const skin = flat(SKIN[Math.floor(Math.random() * SKIN.length)], { roughness: .96 });
  const shirt = flat(SHIRTS[Math.floor(Math.random() * SHIRTS.length)], { roughness: .94 });
  const pants = flat(PANTS[Math.floor(Math.random() * PANTS.length)], { roughness: .95 });
  const shoe = flat(0x27231f, { roughness: .9 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: Math.random() > .35 ? 0xffa64a : 0xd9ff8a, toneMapped: false });
  const mouthMat = flat(0x3a1314);
  const accent = flat([0x7d2c29, 0x2c4b4a, 0x5b4b2d, 0x3e3b5b][Math.floor(Math.random() * 4)]);

  const body = new THREE.Group();
  root.add(body);
  root.add(blob(1.25));

  const legL = new THREE.Group(); legL.position.set(-.16, .83, 0);
  legL.add(meshBox(.24, .68, .27, pants, 0, -.33, 0));
  legL.add(meshBox(.27, .16, .37, shoe, 0, -.73, .05));
  body.add(legL);
  const legR = legL.clone(); legR.position.x = .16; body.add(legR);

  const torso = meshBox(.58, .72, .36, shirt, 0, 1.17, 0);
  torso.rotation.z = (Math.random() - .5) * .1;
  body.add(torso);
  // shirt tear
  body.add(meshBox(.18, .26, .02, skin, .08, 1.06, .19, false));
  if (Math.random() > .5) body.add(meshBox(.52, .14, .38, accent, 0, .9, 0));
  // shoulders
  body.add(meshBox(.72, .14, .38, shirt, 0, 1.48, 0));

  const armL = new THREE.Group(); armL.position.set(-.38, 1.42, 0);
  armL.add(meshBox(.16, .55, .18, shirt, 0, -.24, 0));
  armL.add(meshBox(.13, .42, .15, skin, 0, -.66, .02));
  armL.add(meshBox(.12, .14, .15, skin, 0, -.9, .03));
  body.add(armL);
  const armR = armL.clone(); armR.position.x = .38; body.add(armR);

  const neck = meshBox(.19, .17, .19, skin, 0, 1.58, 0); body.add(neck);
  const head = new THREE.Group(); head.position.set(0, 1.75, .01);
  const skull = new THREE.Mesh(new THREE.CapsuleGeometry(.2, .12, 4, 8), skin);
  skull.castShadow = true; skull.rotation.z = (Math.random() - .5) * .18; head.add(skull);
  // jaw
  const jaw = meshBox(.21, .12, .18, skin, 0, -.1, .04); head.add(jaw);
  head.add(meshBox(.18, .06, .03, mouthMat, 0, -.05, .18, false));
  for (const x of [-.07, .07]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.032, 5, 4), eyeMat);
    eye.position.set(x, .045, .185); head.add(eye);
  }
  // brow cavity
  head.add(meshBox(.3, .06, .06, flat(0x4a2b28), 0, .085, .16, false));
  // hat / hair
  const style = Math.random();
  if (style > .72) {
    const brim = meshBox(.47, .045, .42, accent, 0, .16, 0); head.add(brim);
    head.add(meshBox(.3, .18, .3, accent, 0, .27, 0));
  } else if (style > .42) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(.215, 7, 4, 0, Math.PI * 2, 0, Math.PI * .52), flat(0x3e3a32));
    cap.position.y = .07; head.add(cap);
    head.add(meshBox(.31, .04, .22, flat(0x302d28), 0, .1, .14, false));
  } else {
    for (let i = 0; i < 5; i++) {
      const h = meshBox(.1, .12, .08, flat(0x2b211d), -.18 + i * .09, .13 + Math.random() * .04, -.02, false);
      h.rotation.z = (Math.random() - .5) * .7; head.add(h);
    }
  }
  body.add(head);

  // wounds / blood
  const blood = flat(0x5d1e1c, { roughness: 1 });
  body.add(meshBox(.16, .2, .02, blood, -.17, 1.21, .19, false));
  body.add(meshBox(.12, .12, .02, blood, .22, 1.02, .19, false));

  const hitFlash = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.9, .6), new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  hitFlash.position.y = 1; body.add(hitFlash);

  // warm eye bloom so the dead read clearly at a distance
  const eyeGlowMat = new THREE.SpriteMaterial({
    map: eyeGlowTex, color: 0xffb35a, transparent: true, opacity: .62,
    depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  });
  eyeGlowMat.userData.shared = true;
  const eyeGlow = new THREE.Sprite(eyeGlowMat);
  eyeGlow.position.set(0, 1.83, .2);
  eyeGlow.scale.set(.46, .26, 1);
  root.add(eyeGlow);

  // overhead health bar (hidden until damaged)
  const hpBar = new THREE.Group();
  hpBar.position.y = 2.28; hpBar.visible = false;
  const hpBack = new THREE.Mesh(new THREE.PlaneGeometry(1.0, .11), new THREE.MeshBasicMaterial({ color: 0x07080c, transparent: true, opacity: .88, depthWrite: false, toneMapped: false }));
  const hpFill = new THREE.Mesh(new THREE.PlaneGeometry(.92, .065), new THREE.MeshBasicMaterial({ color: 0xd74b40, depthWrite: false, toneMapped: false }));
  hpFill.position.z = .002;
  hpBar.add(hpBack, hpFill);
  root.add(hpBar);

  root.scale.setScalar(.98 + Math.random() * .22);
  const parts = { root, body, legL, legR, armL, armR, head, hitFlash, eyeMat, eyeGlow, hpBar, hpFill, style, phase: Math.random() * 10 };
  root.userData = parts;
  return parts;
}

export function animateZombie(z, t, speed, state = 'walk') {
  const s = Math.min(1.4, speed);
  const phase = t * (7.2 + s) + z.phase;
  const limp = Math.sin(phase) * .58 * s;
  z.legL.rotation.x = limp;
  z.legR.rotation.x = -limp;
  z.body.position.y = Math.abs(Math.sin(phase)) * .045 * s;
  z.body.rotation.z = Math.sin(phase) * .055 * s;
  z.armL.rotation.x = -1.1 + Math.sin(phase + .4) * .17;
  z.armR.rotation.x = -1.02 + Math.sin(phase + 1.4) * .2;
  z.armL.rotation.z = .12;
  z.armR.rotation.z = -.1;
  z.head.rotation.z = Math.sin(phase * .7) * .11;
  z.head.rotation.y = Math.sin(phase * .4) * .1;
  if (z.eyeGlow) z.eyeGlow.material.opacity = .5 + Math.sin(t * 3.4 + z.phase) * .16;
  if (state === 'attack') {
    z.armL.rotation.x = -1.5 + Math.sin(t * 9) * .6;
    z.armR.rotation.x = -1.4 + Math.sin(t * 9 + 2) * .55;
    z.body.rotation.x = .18 + Math.sin(t * 9) * .07;
  } else {
    z.body.rotation.x = .03;
  }
  if (z.hitFlash.material.opacity > 0) z.hitFlash.material.opacity = Math.max(0, z.hitFlash.material.opacity - .13);
}

export function hitZombie(z) {
  z.hitFlash.material.opacity = .22;
}
