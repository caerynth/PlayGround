import * as THREE from 'three';

/* ------------------------------------------------------------------ *
 *  DEAD BLOCK — procedural roadside world
 *  Everything is built from geometry and canvas textures, no downloads.
 * ------------------------------------------------------------------ */

let seed = 1959;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const rr = (a, b) => a + (b - a) * rnd();
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

function canvasTex(w, h, draw, { repeat = null, srgb = true } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

function standard(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.78,
    metalness: 0.03,
    flatShading: true,
    ...extra,
  });
}

function box(w, h, d, material, x = 0, y = 0, z = 0, cast = true, receive = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

function cyl(rt, rb, h, material, x = 0, y = 0, z = 0, segments = 8) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segments), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function makeAsphaltTexture() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#24242a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      const v = 22 + Math.floor(rnd() * 42);
      g.fillStyle = `rgba(${v},${v},${v + Math.floor(rnd() * 7)},${rr(.12, .6)})`;
      g.fillRect(rnd() * w, rnd() * h, rr(1, 3.5), rr(1, 3));
    }
    for (let i = 0; i < 14; i++) {
      g.strokeStyle = `rgba(9,9,13,${rr(.25, .65)})`;
      g.lineWidth = rr(.6, 2.4);
      g.beginPath();
      let x = rnd() * w, y = rnd() * h;
      g.moveTo(x, y);
      for (let s = 0; s < 7; s++) { x += rr(-32, 32); y += rr(8, 34); g.lineTo(x, y); }
      g.stroke();
    }
    for (let i = 0; i < 6; i++) {
      const x = rnd() * w, y = rnd() * h, r = rr(25, 90);
      const grd = g.createRadialGradient(x, y, 2, x, y, r);
      grd.addColorStop(0, 'rgba(5,6,9,.28)'); grd.addColorStop(1, 'rgba(5,6,9,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
  }, { repeat: [4, 4] });
}

function makeSandTexture() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#4c3b31'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 15000; i++) {
      const v = rnd();
      g.fillStyle = v > .5 ? `rgba(118,93,70,${rr(.06, .34)})` : `rgba(28,23,23,${rr(.05, .3)})`;
      g.fillRect(rnd() * w, rnd() * h, rr(1, 4), rr(1, 2));
    }
    for (let i = 0; i < 22; i++) {
      g.strokeStyle = `rgba(28,22,22,${rr(.08, .22)})`;
      g.lineWidth = rr(2, 8);
      g.beginPath();
      for (let x = 0; x <= w; x += 18) {
        const y = h * .2 + i * 20 + Math.sin(x * .014 + i) * 11;
        if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    }
  }, { repeat: [10, 10] });
}

function makeWoodTexture() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#5c4634'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 32) {
      g.fillStyle = pick(['#6a503b', '#594534', '#73563d', '#4c382a']);
      g.fillRect(0, y + 1, w, 30);
      g.fillStyle = 'rgba(20,13,9,.75)'; g.fillRect(0, y, w, 2);
      for (let i = 0; i < 12; i++) {
        g.strokeStyle = `rgba(30,19,12,${rr(.08, .25)})`; g.lineWidth = rr(.4, 1.4);
        g.beginPath(); g.moveTo(0, y + rnd() * 30);
        g.bezierCurveTo(w * .3, y + rnd() * 30, w * .7, y + rnd() * 30, w, y + rnd() * 30); g.stroke();
      }
    }
  }, { repeat: [2, 1] });
}

function makeChainTexture() {
  const t = canvasTex(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(124,132,132,.78)'; g.lineWidth = 2;
    for (let i = -2; i < 12; i++) {
      g.beginPath(); g.moveTo(i * 16, 0); g.lineTo(i * 16 + 64, h); g.stroke();
      g.beginPath(); g.moveTo(i * 16 + 64, 0); g.lineTo(i * 16, h); g.stroke();
    }
  }, { repeat: [3, 1] });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function makeBloodTexture() {
  return canvasTex(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(79,12,14,.65)';
    for (let i = 0; i < 18; i++) {
      g.beginPath(); g.ellipse(rr(45, 210), rr(45, 210), rr(10, 48), rr(5, 28), rnd() * 6, 0, Math.PI * 2); g.fill();
    }
    for (let i = 0; i < 40; i++) {
      g.beginPath(); g.arc(rnd() * w, rnd() * h, rr(1, 6), 0, Math.PI * 2); g.fill();
    }
  });
}

function textPanel({
  w = 512, h = 192, lines, bg = 'rgba(0,0,0,0)', color = '#ffe8ca',
  glow = '#ff5e6d', font = 'Bebas Neue', size = 96, border = null, letter = 4,
  sub = null, subColor = '#ffd58c', subSize = 28,
}) {
  const tex = canvasTex(w, h, (g) => {
    if (bg !== 'transparent') { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    if (border) { g.strokeStyle = border; g.lineWidth = 5; g.strokeRect(5, 5, w - 10, h - 10); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const arr = Array.isArray(lines) ? lines : [lines];
    const lineH = h / (arr.length + (sub ? .7 : 0));
    arr.forEach((line, i) => {
      g.font = `400 ${size}px "${font}", Impact, sans-serif`;
      g.shadowColor = glow; g.shadowBlur = 26;
      g.fillStyle = glow; g.fillText(line, w / 2, lineH * (i + .58));
      g.shadowBlur = 10; g.fillStyle = color; g.fillText(line, w / 2, lineH * (i + .58));
      g.fillStyle = color; g.fillText(line, w / 2, lineH * (i + .58));
    });
    if (sub) {
      g.shadowBlur = 8; g.shadowColor = subColor;
      g.font = `600 ${subSize}px Oswald, sans-serif`;
      g.fillStyle = subColor; g.fillText(Array.isArray(sub) ? sub.join('  •  ') : sub, w / 2, h - subSize * .8);
    }
  });
  return tex;
}

function signMesh(texture, width, height, { emissive = true, doubleSided = true } = {}) {
  const mat = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, depthWrite: false,
    side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  return mesh;
}

function addFrame(group, w, h, color = 0x2a2426) {
  const m = standard(color, { roughness: .5, metalness: .55 });
  group.add(box(w + .18, .11, .12, m, 0, h / 2 + .04, 0));
  group.add(box(w + .18, .11, .12, m, 0, -h / 2 - .04, 0));
  group.add(box(.11, h, .12, m, -w / 2 - .04, 0, 0));
  group.add(box(.11, h, .12, m, w / 2 + .04, 0, 0));
}

/* ------------------------------------------------------------------ */

export function createWorld(scene, { mobile = false } = {}) {
  const root = new THREE.Group();
  root.name = 'world';
  scene.add(root);
  const animated = { signs: [], bulbs: [], dust: null, fire: null, smoke: [], flags: [], tumble: null };
  const barriers = [];

  const asphaltTex = makeAsphaltTexture();
  const sandTex = makeSandTexture();
  const woodTex = makeWoodTexture();
  const chainTex = makeChainTexture();
  const bloodTex = makeBloodTexture();

  const mats = {
    sand: standard(0xa48365, { map: sandTex, roughness: 1 }),
    asphalt: standard(0x555057, { map: asphaltTex, roughness: .94 }),
    wood: standard(0xbfa281, { map: woodTex, roughness: .84 }),
    woodDark: standard(0x4d3629, { roughness: .9 }),
    metal: standard(0x4c5054, { roughness: .34, metalness: .72 }),
    chrome: standard(0xd7d4c9, { roughness: .18, metalness: .92 }),
    rust: standard(0x783f30, { roughness: .9, metalness: .16 }),
    stucco: standard(0xbca78d, { roughness: .94 }),
    stuccoDark: standard(0x8b7663, { roughness: .94 }),
    teal: standard(0x2f6667, { roughness: .55, metalness: .1 }),
    cream: standard(0xe0cfb1, { roughness: .76 }),
    black: standard(0x121419, { roughness: .55 }),
    red: standard(0x9b332e, { roughness: .66 }),
    amber: standard(0xe49b3d, { roughness: .5 }),
    cinder: standard(0x746c63, { roughness: .97 }),
    darkMetal: standard(0x292d30, { roughness: .6, metalness: .35 }),
  };

  /* ---------------- sky, stars, moon ---------------- */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      top: { value: new THREE.Color(0x050913) },
      mid: { value: new THREE.Color(0x18213c) },
      horizon: { value: new THREE.Color(0x4a2d3b) },
      low: { value: new THREE.Color(0x1d151d) },
    },
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 low;
      varying vec3 vP;
      void main(){
        float y = normalize(vP).y;
        vec3 c = mix(low, horizon, smoothstep(-0.22, 0.04, y));
        c = mix(c, mid, smoothstep(0.02, 0.28, y));
        c = mix(c, top, smoothstep(0.26, 0.82, y));
        float glow = pow(max(0.0, 1.0 - abs(y - 0.01) * 6.0), 4.0);
        c += vec3(0.19, 0.055, 0.045) * glow;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 40, 24), skyMat);
  sky.renderOrder = -10;
  root.add(sky);
  scene.fog = new THREE.FogExp2(0x0a0c15, 0.0115);

  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 900; i++) {
    const theta = rr(0, Math.PI * 2);
    const phi = rr(0.08, 1.32);
    const r = 100;
    starPos.push(Math.cos(theta) * Math.cos(phi) * r, Math.sin(phi) * r, Math.sin(theta) * Math.cos(phi) * r);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcfd9ff, size: .21, transparent: true, opacity: .7, depthWrite: false, fog: false }));
  root.add(stars);

  const moonTex = canvasTex(256, 256, (g, w, h) => {
    const grd = g.createRadialGradient(128, 128, 30, 128, 128, 128);
    grd.addColorStop(0, 'rgba(242,238,214,1)');
    grd.addColorStop(.28, 'rgba(229,224,197,1)');
    grd.addColorStop(.32, 'rgba(229,224,197,.5)');
    grd.addColorStop(.56, 'rgba(208,190,172,.13)');
    grd.addColorStop(1, 'rgba(150,140,160,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < 15; i++) {
      g.fillStyle = `rgba(105,99,99,${rr(.05, .16)})`;
      g.beginPath(); g.arc(rr(82, 174), rr(82, 174), rr(4, 16), 0, Math.PI * 2); g.fill();
    }
  });
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex, transparent: true, depthWrite: false, fog: false, toneMapped: false }));
  moon.scale.set(26, 26, 1);
  moon.position.set(-38, 42, -85);
  root.add(moon);
  const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(128, 128, (g) => {
    const grd = g.createRadialGradient(64, 64, 1, 64, 64, 64);
    grd.addColorStop(0, 'rgba(159,181,229,.34)'); grd.addColorStop(.42, 'rgba(115,134,186,.1)'); grd.addColorStop(1, 'rgba(80,90,130,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  }), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  moonGlow.scale.set(58, 58, 1);
  moonGlow.position.copy(moon.position);
  root.add(moonGlow);

  /* ---------------- distant terrain ---------------- */
  const mesas = new THREE.Group();
  const mesaMat = standard(0x231c28, { roughness: 1, flatShading: true });
  const mesaMat2 = standard(0x342330, { roughness: 1, flatShading: true });
  for (let i = 0; i < 16; i++) {
    const a = rr(-2.9, -.15);
    const dist = rr(52, 92);
    const h = rr(5, 17);
    const geo = new THREE.CylinderGeometry(rr(4, 9), rr(8, 16), h, pick([5, 6, 7]), 1);
    const m = new THREE.Mesh(geo, i % 3 ? mesaMat : mesaMat2);
    m.position.set(Math.cos(a) * dist, h / 2 - 1, Math.sin(a) * dist);
    m.rotation.y = rnd() * 3;
    m.scale.z = rr(.5, 1.1);
    mesas.add(m);
  }
  root.add(mesas);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), mats.sand);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -.06;
  ground.receiveShadow = true;
  root.add(ground);

  // courtyard asphalt slab
  const yard = new THREE.Mesh(new THREE.BoxGeometry(22.4, .14, 21), mats.asphalt);
  yard.position.set(0, -.04, .4);
  yard.receiveShadow = true;
  root.add(yard);
  const yardEdge = standard(0x363238, { roughness: 1 });
  const edge = new THREE.Mesh(new THREE.BoxGeometry(22.8, .12, 21.4), yardEdge);
  edge.position.set(0, -.13, .4);
  edge.receiveShadow = true;
  root.add(edge);

  // road on the south side
  const road = new THREE.Mesh(new THREE.PlaneGeometry(140, 10), standard(0x29292e, { map: asphaltTex, roughness: .96 }));
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -.01, 19.2);
  road.receiveShadow = true;
  root.add(road);
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xbba467, transparent: true, opacity: .42, toneMapped: false });
  for (let i = -5; i < 6; i++) {
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(4.5, .18), stripeMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(i * 10, .006, 19.2);
    root.add(stripe);
  }

  // faded parking bays + courtyard markings
  const paint = new THREE.MeshBasicMaterial({ color: 0xc4ad76, transparent: true, opacity: .18, depthWrite: false });
  for (let i = -2; i <= 2; i++) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(.13, 5.4), paint);
    line.rotation.x = -Math.PI / 2; line.position.set(i * 4.3, .04, 5.7);
    root.add(line);
  }
  const keepOutTex = textPanel({ w: 512, h: 256, lines: ['KEEP OUT'], color: 'rgba(204,95,71,.55)', glow: 'rgba(121,31,24,.15)', size: 120, letter: 9 });
  const keepOut = signMesh(keepOutTex, 4.3, 2.15);
  keepOut.rotation.x = -Math.PI / 2; keepOut.rotation.z = -.22;
  keepOut.position.set(1.1, .042, 7.1);
  keepOut.material.opacity = .2;
  root.add(keepOut);

  const blood = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 3.7), new THREE.MeshBasicMaterial({ map: bloodTex, transparent: true, opacity: .5, depthWrite: false }));
  blood.rotation.x = -Math.PI / 2; blood.position.set(-3.6, .045, -2.5);
  root.add(blood);

  /* ---------------- motel ---------------- */
  const motel = new THREE.Group();
  motel.position.set(-9.2, 0, -13.5);
  root.add(motel);

  motel.add(box(15.5, 5.25, 4.2, mats.stucco, 0, 2.62, 0));
  motel.add(box(16.1, .28, 4.7, mats.stuccoDark, 0, 5.36, 0));
  motel.add(box(15.8, .16, 4.55, mats.teal, 0, 5.12, 0));
  // ground floor doors + windows
  const doorMat = standard(0x264b4b, { roughness: .7, metalness: .1 });
  const windowMat = new THREE.MeshBasicMaterial({ color: 0xffc871, transparent: true, opacity: .84, toneMapped: false });
  const curtainMat = new THREE.MeshBasicMaterial({ color: 0x9d4b48, transparent: true, opacity: .8 });
  for (let i = 0; i < 5; i++) {
    const x = -5.9 + i * 2.95;
    motel.add(box(1.15, 2.2, .09, doorMat, x, 1.16, 2.13));
    motel.add(box(.08, .08, .08, mats.chrome, x + .4, 1.12, 2.2, false));
    motel.add(box(1.35, .17, .18, mats.stuccoDark, x, 2.34, 2.13));
    if (i < 4) {
      motel.add(box(1.05, .8, .06, windowMat, x + 1.48, 1.72, 2.13, false));
      motel.add(box(1.17, .92, .16, mats.stuccoDark, x + 1.48, 1.72, 2.07));
      motel.add(box(.16, 1.04, .16, mats.teal, x + 1.48, 1.72, 2.16, false));
    }
  }
  // balcony deck
  motel.add(box(15.6, .2, 1.3, mats.stuccoDark, 0, 2.9, 2.7));
  motel.add(box(15.5, .35, .1, mats.teal, 0, 3.78, 3.28));
  for (let i = 0; i <= 10; i++) {
    const x = -7.5 + i * 1.5;
    motel.add(box(.07, .95, .07, mats.teal, x, 3.33, 3.28, false));
  }
  // second floor doors/windows
  for (let i = 0; i < 5; i++) {
    const x = -5.9 + i * 2.95;
    motel.add(box(1.05, 2.02, .08, doorMat, x, 4.04, 2.13));
    if (i < 4) {
      motel.add(box(.98, .85, .06, windowMat, x + 1.48, 4.18, 2.13, false));
      motel.add(box(1.1, .97, .14, mats.stuccoDark, x + 1.48, 4.18, 2.06));
      motel.add(box(.15, .9, .15, mats.teal, x + 1.48, 4.18, 2.15, false));
    }
  }
  // curtains / room silhouettes
  for (let i = 0; i < 4; i++) {
    const x = -4.42 + i * 2.95;
    motel.add(box(.44, .82, .02, curtainMat, x - .2, 1.6, 2.18, false));
    motel.add(box(.32, .83, .02, curtainMat, x + 1.48, 4.2, 2.18, false));
  }
  // roof AC units
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    g.add(box(.85, .45, .75, mats.metal, 0, .24, 0));
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .06, 12), mats.darkMetal));
    g.children[1].rotation.x = Math.PI / 2; g.children[1].position.set(0, .25, .38);
    g.position.set(-4.5 + i * 4, 5.55, -.3);
    motel.add(g);
  }
  // stairs
  const stair = new THREE.Group();
  for (let i = 0; i < 9; i++) stair.add(box(1.3, .18, .5, mats.stuccoDark, 0, .1 + i * .3, i * .44));
  stair.position.set(7.1, 0, 1.1);
  motel.add(stair);
  // balcony chairs
  const chair = standard(0x6f5442);
  for (let i = 0; i < 2; i++) {
    const c = new THREE.Group();
    c.add(box(.45, .06, .45, chair, 0, .42, 0));
    c.add(box(.45, .6, .06, chair, 0, .7, -.2));
    for (const [x, z] of [[-.18, -.18], [.18, -.18], [-.18, .18], [.18, .18]]) c.add(box(.05, .42, .05, mats.darkMetal, x, .2, z));
    c.position.set(-4.8 + i * 4, 2.99, 2.82);
    motel.add(c);
  }

  // roof neon sign
  const sunsetTex = textPanel({ w: 1024, h: 280, lines: ['SUNSET MOTEL'], color: '#ffaac8', glow: '#ff1f66', size: 148, letter: 8, sub: 'VACANCY  •  COLOR TV  •  AIR COOLED', subSize: 28, subColor: '#ffb6db' });
  const sunsetSign = signMesh(sunsetTex, 11.7, 3.2);
  sunsetSign.position.set(-.1, 6.55, 2.25);
  addFrame(sunsetSign, 11.7, 3.2, 0x2b2326);
  motel.add(sunsetSign);
  motel.add(box(.28, 1.15, .28, mats.metal, -5.3, 5.7, 1.8));
  motel.add(box(.28, 1.15, .28, mats.metal, 5.1, 5.7, 1.8));
  const motelGlow = new THREE.PointLight(0xff568e, 46, 20, 1.7);
  motelGlow.position.set(-9.3, 6.9, -10.4);
  root.add(motelGlow);
  animated.signs.push({ mat: sunsetSign.material, light: motelGlow, base: 46, rate: .8, seed: 1.7 });

  // little office sign at ground level
  const officeTex = textPanel({ w: 512, h: 128, lines: ['OFFICE'], color: '#ffddae', glow: '#ffa53d', size: 82, sub: 'RING BELL FOR SERVICE', subSize: 22, subColor: '#ffcb7e' });
  const office = signMesh(officeTex, 2.4, .62);
  office.position.set(-1.53, 2.58, 2.22);
  motel.add(office);
  const officeLight = new THREE.PointLight(0xffa447, 11, 7, 1.8);
  officeLight.position.set(-11.1, 2.7, -10.8);
  root.add(officeLight);

  // roadside motel pole sign (silhouette + neon)
  const poleSign = new THREE.Group();
  poleSign.position.set(-16.3, 0, -5.1);
  poleSign.add(cyl(.16, .2, 8.4, mats.darkMetal, 0, 4.2, 0, 6));
  poleSign.add(box(5.2, 3.1, .28, standard(0x1c1d22, { roughness: .7 }), 2.1, 8.2, 0));
  const towerTex = textPanel({ w: 640, h: 400, lines: ['MOTEL'], color: '#ff9fbe', glow: '#ff1f57', size: 185, letter: 14, sub: ['VACANCY', 'POOL • TV'], subSize: 40, subColor: '#ffa6c4' });
  const tower = signMesh(towerTex, 5, 3.1);
  tower.position.set(2.1, 8.38, .18);
  addFrame(tower, 5, 3.1, 0x2a2325);
  poleSign.add(tower);
  const towerLight = new THREE.PointLight(0xff4977, 38, 17, 1.6);
  towerLight.position.set(2.1, 8.2, 2.4);
  poleSign.add(towerLight);
  animated.signs.push({ mat: tower.material, light: towerLight, base: 28, rate: 1.7, seed: 4.1 });
  root.add(poleSign);

  /* ---------------- diner ---------------- */
  const diner = new THREE.Group();
  diner.position.set(9.8, 0, -13.1);
  root.add(diner);
  diner.add(box(11.2, 3.4, 4.4, standard(0xbba58f, { roughness: .88 }), 0, 1.7, 0));
  diner.add(box(11.8, .26, 4.8, mats.chrome, 0, 3.46, 0));
  diner.add(box(11.65, .16, 4.65, mats.red, 0, 3.74, 0));
  // chrome belt
  diner.add(box(11.3, .22, .16, mats.chrome, 0, 1.18, 2.24));
  diner.add(box(11.3, .12, .18, mats.chrome, 0, 2.55, 2.25));
  // window band with a hand-painted interior
  const windowTexture = canvasTex(1024, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#1c4b4a'); grd.addColorStop(.48, '#4ec4b1'); grd.addColorStop(1, '#ffc477');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(10,32,34,.72)'; g.fillRect(0, h * .56, w, h * .44);
    for (let i = 0; i < 6; i++) {
      g.fillStyle = 'rgba(19,33,35,.8)';
      g.beginPath(); g.arc(90 + i * 170, 170, 27, 0, Math.PI * 2); g.fill();
      g.fillRect(90 + i * 170 - 31, 190, 62, 46);
      g.fillStyle = 'rgba(255,209,142,.34)';
      g.fillRect(55 + i * 170, 124, 62, 30);
    }
    for (let i = 0; i < 30; i++) {
      g.fillStyle = `rgba(255,236,193,${rr(.06, .26)})`;
      g.fillRect(rnd() * w, rnd() * h, rr(3, 18), rr(2, 7));
    }
  });
  const windowStrip = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 2.25), new THREE.MeshBasicMaterial({ map: windowTexture, toneMapped: false }));
  windowStrip.position.set(-.6, 2.16, 2.26);
  diner.add(windowStrip);
  // window mullions
  for (let i = 0; i <= 5; i++) diner.add(box(.1, 2.3, .12, mats.chrome, -4.2 + i * 1.86, 2.15, 2.32, false));
  // door
  diner.add(box(1.34, 2.56, .1, mats.teal, 4.4, 1.34, 2.28));
  diner.add(box(.08, .65, .08, mats.chrome, 4.9, 1.4, 2.36));
  // canopy
  const canopy = box(11.8, .18, 1.7, mats.red, 0, 3.18, 2.95);
  diner.add(canopy);
  diner.add(box(11.5, .08, .13, mats.chrome, 0, 3.07, 3.8, false));
  // diner roof sign
  const dinerTex = textPanel({ w: 1024, h: 250, lines: ["ROSIE'S DINER"], color: '#96ffe9', glow: '#0fe3cb', size: 132, letter: 5, sub: 'OPEN ALL NIGHT  •  HOT COFFEE', subSize: 29, subColor: '#a8fff3' });
  const dinerSign = signMesh(dinerTex, 9.3, 2.28);
  dinerSign.position.set(-.2, 5.1, .3);
  addFrame(dinerSign, 9.3, 2.28, 0x353133);
  diner.add(dinerSign);
  diner.add(box(.2, 1.25, .2, mats.metal, -3.8, 4, 0));
  diner.add(box(.2, 1.25, .2, mats.metal, 3.4, 4, 0));
  const dinerLight = new THREE.PointLight(0x53e3d2, 40, 19, 1.7);
  dinerLight.position.set(9.6, 5.3, -9.8);
  root.add(dinerLight);
  animated.signs.push({ mat: dinerSign.material, light: dinerLight, base: 40, rate: 1.2, seed: 2.8 });

  // coffee cup on the roof (silhouette landmark)
  const cup = new THREE.Group();
  cup.add(cyl(.72, .56, .9, mats.cream, 0, .45, 0, 12));
  cup.add(new THREE.Mesh(new THREE.TorusGeometry(.4, .09, 6, 12, Math.PI * 1.5), mats.cream));
  cup.children[1].rotation.y = Math.PI / 2; cup.children[1].position.set(.63, .48, 0);
  cup.children[1].rotation.z = -.3;
  cup.add(cyl(.68, .68, .07, standard(0x3a231d), 0, .86, 0, 12));
  cup.position.set(3.6, 3.88, -.7); cup.rotation.z = .08;
  diner.add(cup);

  /* ---------------- gas station ---------------- */
  const gas = new THREE.Group();
  gas.position.set(14.2, 0, -5.2);
  gas.rotation.y = -.12;
  root.add(gas);
  // canopy
  gas.add(box(7.6, .38, 5.6, mats.cream, 0, 3.75, 0));
  gas.add(box(7.9, .15, 5.9, mats.red, 0, 3.96, 0));
  for (const [x, z] of [[-3.1, -2], [3.1, -2], [-3.1, 2], [3.1, 2]]) gas.add(cyl(.15, .18, 3.75, mats.chrome, x, 1.87, z, 8));
  // pumps
  for (const x of [-1.45, 1.45]) {
    const p = new THREE.Group();
    p.add(box(.82, 1.75, .62, mats.red, 0, .88, 0));
    p.add(box(.9, .18, .7, mats.chrome, 0, 1.8, 0));
    p.add(box(.5, .28, .04, mats.black, 0, 1.38, .32));
    p.add(box(.38, .5, .02, new THREE.MeshBasicMaterial({ color: 0xffd280, toneMapped: false }), 0, 1.52, .34, false));
    p.add(cyl(.07, .07, 1.2, mats.black, .48, .85, .1, 6));
    p.position.set(x, 0, .1);
    gas.add(p);
  }
  // little shop behind
  gas.add(box(7.2, 2.5, 3.4, mats.stuccoDark, 0, 1.25, -4.2));
  gas.add(box(7.6, .15, 3.7, mats.teal, 0, 2.57, -4.2));
  gas.add(box(2.4, 1.2, .05, new THREE.MeshBasicMaterial({ color: 0xffbb6c, transparent: true, opacity: .6, toneMapped: false }), -1.5, 1.5, -2.48, false));
  gas.add(box(1.1, 2.1, .08, mats.teal, 2.1, 1.06, -2.48));
  // pole sign
  gas.add(cyl(.13, .16, 6.4, mats.darkMetal, 3.9, 3.2, 2.5, 6));
  gas.add(box(3.1, 2.2, .2, standard(0x202227), 3.9, 6.5, 2.5));
  const gasTex = textPanel({ w: 512, h: 360, lines: ['GAS'], color: '#ffc0a4', glow: '#ff2c17', size: 205, sub: ['24 HR', 'SERVICE'], subSize: 39, subColor: '#ffc184' });
  const gasSign = signMesh(gasTex, 2.9, 2.05);
  gasSign.position.set(3.9, 6.5, 2.62);
  gas.add(gasSign);
  const gasLight = new THREE.PointLight(0xff5947, 30, 15, 1.7);
  gasLight.position.set(17.8, 6.5, -2.4);
  root.add(gasLight);
  animated.signs.push({ mat: gasSign.material, light: gasLight, base: 30, rate: 1.5, seed: 5.5 });
  const pumpLight = new THREE.PointLight(0xffd29b, 18, 10, 1.8);
  pumpLight.position.set(14.2, 3.4, -5.1);
  root.add(pumpLight);

  /* ---------------- arena perimeter fences ---------------- */
  const chainMat = new THREE.MeshStandardMaterial({ map: chainTex, transparent: true, opacity: .8, side: THREE.DoubleSide, roughness: .65, metalness: .3, alphaTest: .1 });
  const fenceSegments = [
    { x: -7.35, z: -7.2, len: 4.4, rot: 0 },
    { x: 7.35, z: -7.2, len: 4.4, rot: 0 },
    { x: -8.7, z: -4.8, len: 4.6, rot: Math.PI / 2 },
    { x: -8.7, z: 5.2, len: 4.6, rot: Math.PI / 2 },
    { x: 8.7, z: -4.8, len: 4.6, rot: Math.PI / 2 },
    { x: 8.7, z: 5.2, len: 4.6, rot: Math.PI / 2 },
  ];
  for (const s of fenceSegments) {
    const g = new THREE.Group();
    g.position.set(s.x, 0, s.z);
    g.rotation.y = s.rot;
    const postMat = mats.darkMetal;
    const n = Math.max(2, Math.round(s.len / 2));
    for (let i = 0; i <= n; i++) g.add(cyl(.065, .08, 2.45, postMat, -s.len / 2 + (i * s.len) / n, 1.22, 0, 6));
    g.add(box(s.len, .07, .07, postMat, 0, 2.43, 0));
    g.add(box(s.len, .05, .05, postMat, 0, 1.8, 0));
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(s.len, 2.32), chainMat);
    panel.position.y = 1.22;
    panel.receiveShadow = true;
    g.add(panel);
    root.add(g);
  }
  // low cinder walls at south corners, keeps the frame cozy
  for (const x of [-9.8, 9.8]) {
    const wall = box(2.2, .8, .5, mats.cinder, x, .4, 8.1);
    root.add(wall);
    for (let i = 0; i < 3; i++) root.add(box(.35, .12, .06, mats.red, x - .75 + i * .75, .66, 8.38, false));
  }

  /* ---------------- barricades ---------------- */
  function makeBarricade(id, x, z, rotY, label) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    const planks = [];
    const postMat = standard(0x6b4e38, { map: woodTex, roughness: .92 });
    const plankMats = [standard(0x9a7450, { map: woodTex, roughness: .84 }), standard(0xb58c61, { map: woodTex, roughness: .9 }), standard(0x7e5a3d, { map: woodTex, roughness: .88 })];

    // upright frame — deliberately waist-high: survivors shoot over it
    for (const px of [-3.55, 3.55]) {
      const post = box(.28, 1.82, .3, postMat, px, .91, 0);
      post.rotation.z = px > 0 ? -.028 : .028;
      g.add(post);
      g.add(box(.46, .16, .56, mats.darkMetal, px, .08, 0));
      g.add(cyl(.035, .035, .22, mats.metal, px, 1.9, 0, 5));
    }
    g.add(box(7.35, .19, .24, postMat, 0, 1.74, 0));
    // horizontal boards
    for (let row = 0; row < 3; row++) {
      const y = .38 + row * .43;
      const offset = row % 2 ? .3 : -.12;
      for (let i = 0; i < 5; i++) {
        const w = rr(1.2, 1.55);
        const p = box(w, .28, .13, plankMats[(i + row) % 3], -2.9 + i * 1.46 + offset, y + rr(-.025, .025), .03 + rr(-.04, .04));
        p.rotation.z = rr(-.03, .03);
        g.add(p); planks.push(p);
      }
    }
    // diagonal brace
    const brace = box(7.1, .23, .12, postMat, 0, .83, .15);
    brace.rotation.z = -.22; g.add(brace); planks.push(brace);
    // nails / metal straps
    for (const px of [-2.4, 0, 2.4]) {
      g.add(box(.07, 1.55, .03, mats.darkMetal, px, .87, .13, false));
      for (const py of [.36, .92, 1.47]) {
        const nail = new THREE.Mesh(new THREE.SphereGeometry(.035, 5, 4), mats.chrome);
        nail.position.set(px + rr(-.12, .12), py, .2); g.add(nail);
      }
    }
    // sandbags
    const sandMat = standard(0x706044, { roughness: 1 });
    for (let i = 0; i < 6; i++) {
      const bag = new THREE.Mesh(new THREE.CapsuleGeometry(.24, .34, 3, 6), sandMat);
      bag.rotation.z = Math.PI / 2; bag.rotation.y = rr(-.2, .2);
      bag.position.set(-2.52 + (i % 3) * 1.02, .19 + Math.floor(i / 3) * .26, rr(.24, .42));
      bag.scale.z = .68; bag.castShadow = true; bag.receiveShadow = true;
      g.add(bag);
    }
    // warning sign
    const warnTex = textPanel({ w: 384, h: 384, lines: ['DEAD', 'END'], color: '#e8d7b6', glow: '#891f1d', size: 121, letter: 7, border: 'rgba(240,213,169,.75)' });
    const warn = signMesh(warnTex, .74, .74);
    warn.position.set(0, 1.03, .19); warn.rotation.z = .035;
    g.add(box(.88, .88, .05, standard(0x6c2822), 0, 1.03, .14));
    g.add(warn);
    // string / barbed wire
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x5e6262, transparent: true, opacity: .65 });
    for (let w = 0; w < 2; w++) {
      const pts = [];
      for (let i = 0; i <= 12; i++) pts.push(new THREE.Vector3(-3.6 + i * .6, 1.55 + Math.sin(i * 2.2 + w) * .1 + w * .16, rr(-.05, .1)));
      const wire = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat);
      g.add(wire);
    }
    // beacon
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x7ee39e, toneMapped: false });
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(.085, 8, 6), beaconMat);
    beacon.position.set(3.55, 1.98, .1);
    g.add(beacon);
    const beaconLight = new THREE.PointLight(0x6ee49a, 5, 4, 2);
    beaconLight.position.set(3.55, 1.95, .1); g.add(beaconLight);

    // oil lantern hanging from the crossbeam
    const lantern = new THREE.Group();
    lantern.position.set(0, 1.58, .34);
    lantern.add(box(.2, .26, .18, mats.darkMetal, 0, .08, 0));
    const lampGlow = new THREE.Mesh(new THREE.BoxGeometry(.13, .16, .13), new THREE.MeshBasicMaterial({ color: 0xffc46e, toneMapped: false }));
    lampGlow.position.y = .08; lantern.add(lampGlow);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(.12, .016, 5, 10, Math.PI), mats.darkMetal);
    handle.position.y = .22; lantern.add(handle);
    g.add(lantern);
    const lanternLight = new THREE.PointLight(0xffa558, 14, 6.2, 2);
    lanternLight.position.set(0, 1.75, .6); g.add(lanternLight);
    animated.signs.push({ mat: lampGlow.material, light: lanternLight, base: 14, rate: 3.1, seed: Math.random() * 9 });

    root.add(g);
    const barrier = {
      id, group: g, planks, hp: 420, maxHp: 420, label,
      pos: new THREE.Vector3(x, 0, z), rotY, beacon, beaconMat, beaconLight,
      destroyed: false, shake: 0, breachT: 0,
    };
    barriers.push(barrier);
    return barrier;
  }

  makeBarricade(0, 0, -7.2, 0, 'NORTH');
  makeBarricade(1, -8.7, .2, Math.PI / 2, 'WEST');
  makeBarricade(2, 8.7, .2, -Math.PI / 2, 'EAST');

  /* ---------------- courtyard props ---------------- */
  // lamp post
  const lampPost = new THREE.Group();
  lampPost.position.set(4.7, 0, -2.8);
  lampPost.add(cyl(.1, .16, 5.2, mats.darkMetal, 0, 2.6, 0, 7));
  lampPost.add(box(1.4, .13, .13, mats.darkMetal, .55, 5.18, 0));
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.48, .3, 8), mats.metal);
  shade.position.set(1.18, 5.05, 0); shade.rotation.z = Math.PI; lampPost.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.19, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffd8a0, toneMapped: false }));
  bulb.position.set(1.18, 4.91, 0); lampPost.add(bulb);
  const lampLight = new THREE.PointLight(0xffb46a, 42, 15, 1.7);
  lampLight.position.set(1.18, 4.85, 0);
  lampLight.castShadow = false;
  lampPost.add(lampLight);
  root.add(lampPost);
  animated.signs.push({ mat: bulb.material, light: lampLight, base: 42, rate: 2.3, seed: 8.1 });

  // fire barrel
  const barrel = new THREE.Group();
  barrel.position.set(-5.2, 0, 4.6);
  barrel.add(cyl(.52, .47, 1.05, mats.rust, 0, .53, 0, 12));
  for (const y of [.2, .82]) barrel.add(cyl(.55, .55, .09, mats.darkMetal, 0, y, 0, 12));
  const fireMat = new THREE.MeshBasicMaterial({ color: 0xff8f37, transparent: true, opacity: .9, toneMapped: false });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(.38, 1.15, 7), fireMat);
  flame.position.y = 1.4; barrel.add(flame);
  const flame2 = new THREE.Mesh(new THREE.ConeGeometry(.22, .8, 6), new THREE.MeshBasicMaterial({ color: 0xffd477, toneMapped: false }));
  flame2.position.y = 1.5; flame2.rotation.z = .12; barrel.add(flame2);
  const fireLight = new THREE.PointLight(0xff7a2d, 18, 9, 1.8);
  fireLight.position.y = 1.7; barrel.add(fireLight);
  root.add(barrel);
  animated.fire = { flame, flame2, light: fireLight, base: 18 };
  // glow sprite
  const fireGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(64, 64, (g) => {
    const grd = g.createRadialGradient(32, 32, 1, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,149,58,.7)'); grd.addColorStop(.4, 'rgba(255,98,32,.18)'); grd.addColorStop(1, 'rgba(255,70,20,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  fireGlow.scale.set(4, 4, 1); fireGlow.position.set(-5.2, 1.25, 4.6);
  root.add(fireGlow);

  // picnic table
  const table = new THREE.Group();
  table.position.set(-4.1, 0, 1.2); table.rotation.y = .28;
  const topMat = standard(0x8b6746, { map: woodTex });
  table.add(box(2.7, .14, .9, topMat, 0, .82, 0));
  for (const x of [-1.05, 1.05]) {
    const leg = box(.14, .78, .14, mats.woodDark, x, .4, 0); leg.rotation.z = x > 0 ? -.2 : .2; table.add(leg);
    table.add(box(2.5, .1, .35, topMat, 0, .49, .74));
    table.add(box(2.5, .1, .35, topMat, 0, .49, -.74));
  }
  root.add(table);
  // bottles on table
  for (let i = 0; i < 3; i++) {
    const b = cyl(.055, .07, .3, new THREE.MeshBasicMaterial({ color: i === 1 ? 0x5a8f50 : 0x8d5a32, toneMapped: false }), -1.05 + i * .55, 1.05, rr(-.2, .2), 6);
    table.add(b);
  }

  // crates / clutter by barriers
  const crateMat = standard(0x6f5036, { map: woodTex });
  function crate(x, z, s = 1, rot = 0) {
    const c = new THREE.Group();
    c.add(box(.8 * s, .8 * s, .8 * s, crateMat, 0, .4 * s, 0));
    for (const yy of [.17 * s, .63 * s]) c.add(box(.84 * s, .06 * s, .84 * s, mats.woodDark, 0, yy, 0));
    c.position.set(x, 0, z); c.rotation.y = rot; root.add(c);
  }
  crate(6.1, -5.9, .95, .2); crate(6.8, -5.5, .7, -.15);
  crate(-6.9, -5.6, 1.05, -.1); crate(-7.4, 6.3, .8, .3);
  // tires
  for (let i = 0; i < 3; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(.45, .17, 7, 12), mats.black);
    t.rotation.x = Math.PI / 2; t.rotation.z = rr(-.1, .1);
    t.position.set(-7.6, .18 + i * .16, 4.0); t.castShadow = true; root.add(t);
  }
  // trash can
  const can = cyl(.36, .32, .9, mats.metal, 6.9, .45, 5.8, 9);
  root.add(can);
  root.add(box(.78, .06, .78, mats.darkMetal, 6.9, .92, 5.8));

  // chalk body outline near the entrance
  const chalkTex = canvasTex(256, 320, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(226,217,194,.7)';
    g.lineWidth = 4; g.lineCap = 'round';
    g.beginPath(); g.arc(w * .5, 52, 23, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(w * .5, 76); g.lineTo(w * .5, 168); g.stroke();
    g.beginPath(); g.moveTo(w * .5, 96); g.lineTo(w * .5 - 62, 148); g.moveTo(w * .5, 92); g.lineTo(w * .5 + 55, 128); g.stroke();
    g.beginPath(); g.moveTo(w * .5, 168); g.lineTo(w * .5 - 48, 252); g.moveTo(w * .5, 168); g.lineTo(w * .5 + 44, 248); g.stroke();
    for (let i = 0; i < 9; i++) {
      g.beginPath(); g.arc(24 + rnd() * (w - 48), 24 + rnd() * (h - 48), rr(1, 3), 0, Math.PI * 2); g.stroke();
    }
  });
  const chalk = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.9), new THREE.MeshBasicMaterial({ map: chalkTex, transparent: true, opacity: .42, depthWrite: false }));
  chalk.rotation.x = -Math.PI / 2; chalk.rotation.z = -.34;
  chalk.position.set(2.0, .047, 4.7);
  root.add(chalk);

  /* ---------------- south court foreground ---------------- */
  const court = new THREE.Group();
  court.position.set(3.2, 0, 7.7); court.rotation.y = -.32;
  const benchMat = standard(0x6f5138, { map: woodTex, roughness: .9 });
  court.add(box(2.4, .11, .52, benchMat, 0, .46, 0));
  const benchBack = box(2.2, .46, .08, benchMat, 0, .7, -.23);
  benchBack.rotation.x = -.13; court.add(benchBack);
  for (const x of [-1.05, 1.05]) court.add(box(.1, .46, .42, mats.darkMetal, x, .23, 0));
  court.add(cyl(.045, .055, .25, new THREE.MeshBasicMaterial({ color: 0x6d8a4f, toneMapped: false }), -.7, .62, .12, 6));
  court.add(cyl(.075, .06, .1, mats.cream, .45, .56, .14, 8));
  root.add(court);
  crate(-4.3, 7.9, .72, -.22);
  crate(4.8, 8.2, .58, .34);

  // weathered motor-court sign
  const courtSign = new THREE.Group();
  courtSign.position.set(-6.6, 0, 8.1); courtSign.rotation.y = .22;
  courtSign.add(cyl(.08, .11, 2.1, mats.woodDark, -1.1, 1.05, 0, 6));
  courtSign.add(cyl(.08, .11, 2.1, mats.woodDark, 1.1, 1.05, 0, 6));
  courtSign.add(box(2.7, 1.0, .12, standard(0x5b3f2b, { map: woodTex }), 0, 2.15, 0));
  const courtTex = textPanel({ w: 512, h: 190, lines: ['MOTOR COURT'], color: '#f2dfbc', glow: '#ff7a45', size: 78, sub: 'VACANCY  •  NIGHTLY', subSize: 24, subColor: '#f2a73b' });
  const courtPanel = signMesh(courtTex, 2.45, .9);
  courtPanel.position.set(0, 2.15, .08); courtSign.add(courtPanel);
  root.add(courtSign);

  // rolling tumbleweed
  const tumble = new THREE.Group();
  const tumbleMat = standard(0x6d5333, { roughness: 1, wireframe: true });
  for (const [r, detail, s] of [[.42, 0, 1], [.3, 1, .9], [.18, 0, .8]]) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, detail), tumbleMat);
    m.scale.set(s, s * .92, s); tumble.add(m);
  }
  tumble.position.set(-3.5, .48, 8.3);
  root.add(tumble);
  animated.tumble = { group: tumble };

  /* ---------------- cars ---------------- */
  function classicCar(color, x, z, rot, wrecked = false) {
    const car = new THREE.Group();
    car.position.set(x, 0, z); car.rotation.y = rot;
    const paint = standard(color, { metalness: .45, roughness: .42 });
    car.add(box(3.65, .55, 1.55, paint, 0, .64, 0));
    car.add(box(1.65, .55, 1.4, paint, -.18, 1.12, 0));
    car.add(box(1.5, .42, 1.3, new THREE.MeshBasicMaterial({ color: 0x18262c, transparent: true, opacity: .84 }), -.18, 1.17, 0.02, false));
    // roof
    car.add(box(1.4, .1, 1.26, paint, -.18, 1.42, 0));
    // tail fins
    for (const zz of [-.74, .74]) {
      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0); finShape.lineTo(1.5, 0); finShape.lineTo(1.15, .45); finShape.lineTo(.2, .35); finShape.closePath();
      const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(finShape, { depth: .07, bevelEnabled: false }), paint);
      fin.rotation.x = Math.PI / 2; fin.rotation.z = 0;
      fin.position.set(1.7, 1.1, zz); car.add(fin);
    }
    // chrome bumpers
    car.add(box(3.95, .13, .16, mats.chrome, 0, .45, .8));
    car.add(box(3.95, .13, .16, mats.chrome, 0, .45, -.8));
    // headlights
    for (const zz of [-.5, .5]) {
      const h = new THREE.Mesh(new THREE.SphereGeometry(.15, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe5ae, toneMapped: false }));
      h.position.set(1.83, .64, zz); car.add(h);
    }
    // wheels
    for (const [wx, wz] of [[-1.22, -.8], [1.22, -.8], [-1.22, .8], [1.22, .8]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(.37, .37, .18, 12), mats.black);
      w.rotation.x = Math.PI / 2; w.position.set(wx, .36, wz); w.castShadow = true; car.add(w);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .2, 10), mats.chrome);
      hub.rotation.x = Math.PI / 2; hub.position.set(wx, .36, wz); car.add(hub);
    }
    if (wrecked) {
      car.rotation.z = .03; car.rotation.x = -.02;
      const glassBroken = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .5), new THREE.MeshBasicMaterial({ color: 0x10151b, transparent: true, opacity: .5 }));
      glassBroken.position.set(-.18, 1.18, .68); car.add(glassBroken);
    }
    root.add(car);
    return car;
  }
  classicCar(0x4f8380, -14.1, 7.5, 1.22);
  classicCar(0x7d3130, 13.2, 7.8, -1.5, true);
  classicCar(0x9a8b68, -15.8, -2.4, 1.55, true);

  /* ---------------- telephone poles + wires ---------------- */
  function telephonePole(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.add(cyl(.16, .23, 10, standard(0x382c27), 0, 5, 0, 6));
    g.add(box(2.6, .16, .16, standard(0x382c27), 0, 8.4, 0));
    g.add(box(1.8, .13, .13, standard(0x382c27), 0, 7.6, 0));
    for (const xx of [-1.15, -.5, .5, 1.15]) {
      g.add(cyl(.05, .05, .32, standard(0x777b70), xx, 8.62, 0, 5));
    }
    root.add(g);
    return g;
  }
  telephonePole(-21, 15); telephonePole(2, 17.5); telephonePole(24, 14.5);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x17171d, transparent: true, opacity: .7 });
  const poles = [[-21, 8.6, 15], [2, 8.6, 17.5], [24, 8.6, 14.5]];
  for (let i = 0; i < poles.length - 1; i++) {
    for (const off of [-1.1, .4]) {
      const [x1, y1, z1] = poles[i], [x2, y2, z2] = poles[i + 1];
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(x1, y1, z1 + off),
        new THREE.Vector3((x1 + x2) / 2, y1 - 1.1, (z1 + z2) / 2 + off),
        new THREE.Vector3(x2, y2, z2 + off)
      );
      root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)), wireMat));
    }
  }

  /* ---------------- string lights ---------------- */
  const stringGroup = new THREE.Group();
  const wirePts = [];
  const start = new THREE.Vector3(-9.5, 6.2, -9.4);
  const end = new THREE.Vector3(5.6, 4.9, -2.8);
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const p = new THREE.Vector3().lerpVectors(start, end, t);
    p.y -= Math.sin(t * Math.PI) * 1.5;
    wirePts.push(p);
  }
  stringGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(wirePts), wireMat));
  const bulbColors = [0xffd7a0, 0xffb66d, 0xfff0c9];
  for (let i = 2; i < wirePts.length - 2; i += 2) {
    const p = wirePts[i];
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.075, 6, 5), new THREE.MeshBasicMaterial({ color: pick(bulbColors), toneMapped: false }));
    bulb.position.copy(p); bulb.position.y -= .14;
    stringGroup.add(bulb);
    animated.bulbs.push({ mesh: bulb, phase: rnd() * 10 });
  }
  root.add(stringGroup);

  /* ---------------- cacti / rocks ---------------- */
  const cactusMat = standard(0x3e5442, { roughness: .93 });
  function cactus(x, z, s) {
    const g = new THREE.Group();
    g.position.set(x, 0, z); g.scale.setScalar(s);
    g.add(cyl(.22, .31, 2.6, cactusMat, 0, 1.3, 0, 7));
    const arm = cyl(.14, .16, 1.25, cactusMat, -.45, 1.75, 0, 6); arm.rotation.z = .5; g.add(arm);
    const arm2 = cyl(.11, .13, .9, cactusMat, .42, 1.35, 0, 6); arm2.rotation.z = -.65; g.add(arm2);
    g.add(new THREE.Mesh(new THREE.SphereGeometry(.22, 6, 5), cactusMat));
    root.add(g);
  }
  cactus(-20, 4, 1.1); cactus(20, 10, 1.35); cactus(17.5, -10.5, .8); cactus(-23, -7, .9);
  const rockMat = standard(0x40363a, { roughness: 1 });
  for (let i = 0; i < 18; i++) {
    const a = rr(0, Math.PI * 2), d = rr(13, 30);
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rr(.25, 1.1), 0), rockMat);
    r.position.set(Math.cos(a) * d, rr(.05, .25), Math.sin(a) * d);
    r.scale.y = rr(.4, .8); r.rotation.set(rnd(), rnd(), rnd());
    r.castShadow = true; r.receiveShadow = true; root.add(r);
  }

  // highway sign in the distance
  const billboard = new THREE.Group();
  billboard.position.set(-18, 0, 21); billboard.rotation.y = .15;
  billboard.add(cyl(.12, .15, 4.5, mats.darkMetal, -1.4, 2.25, 0, 6));
  billboard.add(cyl(.12, .15, 4.5, mats.darkMetal, 1.4, 2.25, 0, 6));
  billboard.add(box(5.3, 2.3, .18, standard(0x1b1c21), 0, 4.3, 0));
  const bbTex = textPanel({ w: 640, h: 260, lines: ['NO VACANCY'], color: '#dfcbae', glow: '#6d2023', size: 105, sub: 'SUNSET MOTEL  •  NEXT RIGHT', subSize: 24, subColor: '#ba8f70' });
  const bb = signMesh(bbTex, 5.1, 2.05); bb.position.set(0, 4.35, .11); billboard.add(bb);
  root.add(billboard);

  /* ---------------- dust + smoke ---------------- */
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = [];
  for (let i = 0; i < 380; i++) {
    const a = rr(0, Math.PI * 2), d = rr(1, 25);
    dustPos.push(Math.cos(a) * d, rr(.1, 6), Math.sin(a) * d);
  }
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xd2b58d, size: .045, transparent: true, opacity: .38, depthWrite: false, blending: THREE.AdditiveBlending }));
  root.add(dust);
  animated.dust = dust;

  // chimney smoke sprites
  const smokeCanvas = canvasTex(64, 64, (g) => {
    const grd = g.createRadialGradient(32, 32, 1, 32, 32, 32);
    grd.addColorStop(0, 'rgba(144,142,148,.3)'); grd.addColorStop(.4, 'rgba(87,85,95,.15)'); grd.addColorStop(1, 'rgba(50,50,60,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  });
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeCanvas, transparent: true, depthWrite: false, opacity: .3 }));
    s.position.set(-10.8 + i * .1, 6.6 + i * .7, -13.4);
    s.scale.setScalar(1.3 + i * .55);
    s.userData = { baseY: s.position.y, phase: i * 1.2, baseScale: s.scale.x };
    root.add(s); animated.smoke.push(s);
  }

  /* ---------------- lighting ---------------- */
  const hemi = new THREE.HemisphereLight(0x8699c8, 0x332226, 1.45);
  scene.add(hemi);
  const ambient = new THREE.AmbientLight(0x566487, 0.62);
  scene.add(ambient);
  const moonLight = new THREE.DirectionalLight(0xb3c6ff, 2.65);
  moonLight.position.set(-16, 24, 10);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  moonLight.shadow.camera.left = -20;
  moonLight.shadow.camera.right = 20;
  moonLight.shadow.camera.top = 20;
  moonLight.shadow.camera.bottom = -20;
  moonLight.shadow.camera.near = 1;
  moonLight.shadow.camera.far = 60;
  moonLight.shadow.bias = -0.0007;
  moonLight.shadow.normalBias = 0.035;
  scene.add(moonLight);
  scene.add(moonLight.target);
  moonLight.target.position.set(0, 0, 0);

  // subtle warm fill from the courtyard
  const fill = new THREE.PointLight(0xff9b5a, 34, 22, 1.8);
  fill.position.set(-1, 5, 4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x8da3dc, 1.05);
  rim.position.set(8, 12, 20);
  scene.add(rim);

  return {
    root, barriers, animated, moonLight,
    update(t, dt) {
      dust.rotation.y = t * .006;
      dust.position.y = Math.sin(t * .12) * .08;
      stars.rotation.y = t * .0015;
      for (const s of animated.signs) {
        const flicker = .9 + Math.sin(t * s.rate + s.seed) * .07 + (Math.sin(t * 13.7 + s.seed) > .96 ? -.3 : 0);
        if (s.mat && s.mat.opacity !== undefined) s.mat.opacity = Math.min(1, .78 + flicker * .2);
        if (s.light) s.light.intensity = s.base * flicker;
      }
      for (const b of animated.bulbs) {
        const glow = .65 + Math.sin(t * 2.2 + b.phase) * .2;
        b.mesh.material.opacity = glow;
      }
      if (animated.fire) {
        const f = animated.fire;
        const flick = .82 + Math.sin(t * 13) * .1 + Math.sin(t * 23.7) * .07;
        f.flame.scale.y = flick; f.flame.scale.x = .88 + Math.sin(t * 17) * .08;
        f.flame2.scale.y = .9 + Math.sin(t * 20 + 2) * .12;
        f.light.intensity = f.base * flick;
      }
      if (animated.tumble) {
        const g = animated.tumble.group;
        const p = (t * .045) % 1;
        g.position.x = -10.5 + p * 21;
        g.position.z = 8.3 + Math.sin(t * .7) * .35;
        g.position.y = .42 + Math.abs(Math.sin(t * 2.6)) * .08;
        g.rotation.z = -t * 2.9;
        g.rotation.x = t * 1.7;
      }
      for (const s of animated.smoke) {
        const p = (t * .12 + s.userData.phase) % 1;
        s.position.y = s.userData.baseY + p * 3.2;
        s.material.opacity = .23 * (1 - p);
        s.scale.setScalar(s.userData.baseScale * (1 + p * 1.4));
      }
      for (let i = 0; i < barriers.length; i++) {
        const b = barriers[i];
        if (b.shake > 0) {
          b.shake = Math.max(0, b.shake - dt * 2.4);
          b.group.rotation.z = Math.sin(t * 54 + i) * b.shake * .012;
          b.group.position.y = Math.sin(t * 40) * b.shake * .025;
        }
        if (b.beaconMat) {
          const ratio = b.hp / b.maxHp;
          b.beaconMat.color.setHex(ratio > .55 ? 0x7ee39e : ratio > .22 ? 0xffb04c : 0xff5246);
        }
      }
    },
  };
}
