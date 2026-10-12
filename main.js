/* =========================================================
   PRESENTASI EKONOMI — WEBGL PIXEL 3D
   Kelompok 2 · Sistem Ekonomi Komando
   ========================================================= */
(function () {
'use strict';

/* ========== PALETTE (jangan ganti) ========== */
const PAL = {
  bg:      '#0a0e1a',
  bgDeep:  '#050810',
  navy:    '#17306b',
  blue:    '#3d8bff',
  blueDk:  '#1f56c4',
  gold:    '#ffd23f',
  goldDk:  '#d4b23a',
  red:     '#ff5d5d',
  redDk:   '#b32b30',
  green:   '#4ade80',
  ink:     '#f2f4f8',
  muted:   '#8a92a6',
  card:    '#f4f9ff',
  cardIn:  '#e8f2ff',
  cardSh:  '#cfe0f7',
  text:    '#17306b',
  textSub: '#3a4a66',
};

/* ========== FONT ========== */
const FONT = s => `${s}px 'Press Start 2P', monospace`;
const NATIVE = 8; // pixel font native grid

/* ========== RENDER SETUP ========== */
const canvas   = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(1);
renderer.setClearColor(PAL.bgDeep, 1);

const SHORT_SIDE = 240;   // render target short side = 240px (native)
let renderW = 427, renderH = 240;

/* ========== CAMERA ========== */
const FOV      = 50;
const CAM_DIST = 15;      // distance from camera to active slide
const GAP      = 30;      // z-distance between slides
const camera = new THREE.PerspectiveCamera(FOV, 16/9, 0.3, 80);
camera.position.set(0, 0, CAM_DIST);

/* ========== PIXEL SCALE (world units per render pixel) ========== */
let PX = 1;
function computePX() {
  const visH = 2 * Math.tan((FOV / 2) * Math.PI / 180) * CAM_DIST;
  PX = visH / renderH;
}

/* ========== SCENE ========== */
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAL.bgDeep);

/* ========== RESIZE ========== */
function resize() {
  const aspect = window.innerWidth / window.innerHeight;
  if (aspect >= 1) {
    renderH = SHORT_SIDE;
    renderW = Math.min(640, Math.round(SHORT_SIDE * aspect));
  } else {
    renderW = SHORT_SIDE;
    renderH = Math.min(640, Math.round(SHORT_SIDE / aspect));
  }
  renderer.setSize(renderW, renderH, false);
  canvas.style.width  = '100%';
  canvas.style.height = '100%';
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}

/* =========================================================
   CANVAS HELPERS
   ========================================================= */
const _measure = document.createElement('canvas').getContext('2d');

function canvasMake(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  return { c, x };
}

function texFromCanvas(c) {
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.anisotropy = 1;
  return t;
}

/**
 * Force alpha channel ke 0/255, dan RGB ke warna solid.
 * Bikin text crisp — tanpa edge blur.
 */
function binarizeAlpha(x, c, hexColor) {
  const id = x.getImageData(0, 0, c.width, c.height);
  const d  = id.data;
  const R = parseInt(hexColor.slice(1, 3), 16);
  const G = parseInt(hexColor.slice(3, 5), 16);
  const B = parseInt(hexColor.slice(5, 7), 16);
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] >= 128) {
      d[i] = R; d[i + 1] = G; d[i + 2] = B; d[i + 3] = 255;
    } else {
      d[i + 3] = 0;
    }
  }
  x.putImageData(id, 0, 0);
}

/* =========================================================
   TEXT MESH — PlaneGeometry + CanvasTexture (1:1 pixel)
   ========================================================= */
function makeText(text, opt) {
  opt = opt || {};
  const size     = opt.size     || NATIVE;
  const color    = opt.color    || PAL.ink;
  const bg       = opt.bg       || null;      // background fill (card-like)
  const bgBorder = opt.bgBorder || null;
  const bgShadow = opt.bgShadow || null;
  const pad      = opt.pad      || 6;
  const maxW     = opt.maxW     || Infinity;
  const align    = opt.align    || 'center';
  const lineGap  = opt.lineGap  != null ? opt.lineGap : Math.round(size * 0.55);
  const shadow   = opt.shadow   || null;      // pixel drop shadow color

  /* --- wrap text --- */
  _measure.font = FONT(size);
  const paragraphs = String(text).split('\n');
  const lines = [];
  for (const p of paragraphs) {
    if (maxW < Infinity && _measure.measureText(p).width > maxW) {
      const words = p.split(' ');
      let line = '';
      for (const w of words) {
        const t = line ? line + ' ' + w : w;
        if (_measure.measureText(t).width > maxW && line) {
          lines.push(line);
          line = w;
        } else line = t;
      }
      if (line) lines.push(line);
    } else {
      lines.push(p);
    }
  }

  /* --- measure --- */
  const maxLineW = Math.max.apply(null, lines.map(l => _measure.measureText(l).width));
  const lineH    = size + lineGap;
  const W = Math.ceil(maxLineW) + pad * 2 + (shadow ? 2 : 0);
  const H = lines.length * lineH - lineGap + pad * 2 + (shadow ? 2 : 0);

  const { c, x } = canvasMake(W, H);

  /* --- background box (opsional) --- */
  if (bg) {
    if (bgBorder) {
      x.fillStyle = bgBorder;
      x.fillRect(0, 0, W, H);
      x.fillStyle = bg;
      x.fillRect(2, 2, W - 4, H - 4);
      if (bgShadow) {
        x.fillStyle = bgShadow;
        x.fillRect(2, H - 6, W - 4, 4);
      }
    } else {
      x.fillStyle = bg;
      x.fillRect(0, 0, W, H);
    }
  }

  /* --- draw text --- */
  x.font = FONT(size);
  x.textBaseline = 'top';
  x.textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
  const ax = align === 'center' ? W / 2
           : align === 'right'  ? W - pad
           : pad;

  for (let i = 0; i < lines.length; i++) {
    const ty = pad + i * lineH;
    if (shadow) {
      x.fillStyle = shadow;
      x.fillText(lines[i], ax + 2, ty + 2);
    }
    x.fillStyle = color;
    x.fillText(lines[i], ax, ty);
  }

  /* --- crisp alpha (kalau tidak ada bg solid) --- */
  if (!bg) binarizeAlpha(x, c, color);

  /* --- mesh --- */
  const tex  = texFromCanvas(c);
  const geo  = new THREE.PlaneGeometry(W * PX, H * PX);
  const mat  = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.pixelW = W;
  mesh.userData.pixelH = H;
  return mesh;
}

/* =========================================================
   CARD MESH — BoxGeometry 3D dengan front face pixel texture
   ========================================================= */
function makeCard(wWorld, hWorld, opt) {
  opt = opt || {};
  const bgCol    = opt.bg        || PAL.card;
  const borderC  = opt.border    || PAL.navy;
  const innerSh  = opt.innerSh   || PAL.cardSh;
  const title    = opt.title     || null;
  const body     = opt.body      || null;
  const titleCol = opt.titleCol  || PAL.navy;
  const bodyCol  = opt.bodyCol   || PAL.textSub;
  const flagDraw = opt.flag      || null;   // fungsi draw flag (canvas)

  const W = Math.round(wWorld / PX);
  const H = Math.round(hWorld / PX);
  const { c, x } = canvasMake(W, H);

  /* --- border --- */
  x.fillStyle = borderC;
  x.fillRect(0, 0, W, H);
  /* --- inner --- */
  x.fillStyle = bgCol;
  x.fillRect(3, 3, W - 6, H - 6);
  /* --- bottom inner shadow --- */
  x.fillStyle = innerSh;
  x.fillRect(3, H - 6, W - 6, 3);

  let cursorY = 12;

  /* --- flag area (kalau ada) --- */
  if (flagDraw) {
    const fH = Math.min(28, Math.round(H * 0.42));
    const fW = W - 16;
    flagDraw(x, 8, 10, fW, fH);
    cursorY = 10 + fH + 8;
  }

  /* --- title --- */
  if (title) {
    x.font = FONT(8);
    x.fillStyle = titleCol;
    x.textBaseline = 'top';
    x.textAlign = 'left';
    x.fillText(title, 10, cursorY);
    cursorY += 12;
  }

  /* --- body --- */
  if (body) {
    x.font = FONT(8);
    x.fillStyle = bodyCol;
    x.textBaseline = 'top';
    x.textAlign = 'left';
    const maxW = W - 20;
    const words = String(body).split(' ');
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (x.measureText(t).width > maxW && line) {
        x.fillText(line, 10, cursorY);
        cursorY += 12;
        line = w;
      } else line = t;
    }
    if (line) x.fillText(line, 10, cursorY);
  }

  /* --- mesh: box dengan front face bertekstur --- */
  const depth = PX * 6;  // 6 render pixels dalam
  const geo = new THREE.BoxGeometry(wWorld, hWorld, depth);
  const frontMat = new THREE.MeshBasicMaterial({
    map: texFromCanvas(c),
    transparent: true,
    depthWrite: false,
  });
  const sideMat = new THREE.MeshBasicMaterial({
    color: borderC,
    transparent: true,
    depthWrite: false,
  });
  const mats = [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat];
  const mesh = new THREE.Mesh(geo, mats);
  mesh.userData.pixelW = W;
  mesh.userData.pixelH = H;
  return mesh;
}

/* =========================================================
   FLAG DRAWERS (pixel style)
   ========================================================= */
function flagKP(x, px, py, w, h) {
  x.fillStyle = '#024fa2';
  x.fillRect(px, py, w, h);
  const cx = px + w * 0.28, cy = py + h / 2, r = Math.min(w, h) * 0.32;
  x.fillStyle = '#ed1c27';
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#fff';
  x.beginPath(); x.arc(cx - r * 0.15, cy, r * 0.85, 0, Math.PI * 2); x.fill();
}
function flagCU(x, px, py, w, h) {
  const stripes = 5;
  for (let i = 0; i < stripes; i++) {
    x.fillStyle = i % 2 === 0 ? '#0033a0' : '#ffffff';
    x.fillRect(px, py + (h / stripes) * i, w, h / stripes + 1);
  }
  x.fillStyle = '#cf142b';
  x.beginPath();
  x.moveTo(px, py);
  x.lineTo(px + w * 0.38, py + h / 2);
  x.lineTo(px, py + h);
  x.closePath(); x.fill();
  x.fillStyle = '#fff';
  x.fillRect(px + w * 0.10, py + h * 0.42, 5, 5);
}
function flagSU(x, px, py, w, h) {
  x.fillStyle = '#cc0000';
  x.fillRect(px, py, w, h);
  x.fillStyle = '#ffd700';
  x.font = FONT(8);
  x.textBaseline = 'top';
  x.fillText('★', px + 6, py + 6);
}
function flagCN(x, px, py, w, h) {
  x.fillStyle = '#de2910';
  x.fillRect(px, py, w, h);
  x.fillStyle = '#ffde00';
  x.font = FONT(8);
  x.textBaseline = 'top';
  x.fillText('★', px + 6, py + 6);
  x.font = FONT(5);
  x.fillText('★', px + 20, py + 4);
  x.fillText('★', px + 22, py + 12);
  x.fillText('★', px + 22, py + 20);
  x.fillText('★', px + 20, py + 28);
}

/* =========================================================
   SLIDE STORAGE
   ========================================================= */
const slides = [];
let curSlide = 0;

/* =========================================================
   SLIDE BUILDER HELPERS
   ========================================================= */
function newSlide(index) {
  const g = new THREE.Group();
  g.position.z = -index * GAP;
  g.userData = { elements: [], allMats: [] };
  scene.add(g);
  return g;
}

function add(slide, mesh, opt) {
  opt = opt || {};
  slide.add(mesh);
  mesh.userData.basePos = mesh.position.clone();
  mesh.userData.entryDelay = opt.delay   || 0;
  mesh.userData.entryDur   = opt.dur     || 750;
  mesh.userData.fromOffset = opt.from    || { x: 0, y: -1.2, z: 2.5 };
  mesh.userData.fromScale  = opt.fromScale != null ? opt.fromScale : 0.85;
  mesh.userData.animated   = false;
  mesh.userData.enterAt    = 0;

  slide.userData.elements.push(mesh);

  const m = mesh.material;
  if (Array.isArray(m)) m.forEach(mm => slide.userData.allMats.push(mm));
  else if (m)           slide.userData.allMats.push(m);

  return mesh;
}

/* =========================================================
   BUILD SLIDES
   ========================================================= */
const NAMES = [
  'Nur Fadilah Rezkia',
  'Joshua Rafael Saranga',
  'Federer Leonardus Walter',
  'Elma Aglucia Lupita Rahael',
  'Salwa Dwi Anggaran',
  'Maytreecya Balialo',
  'Achmad Daniswara Javas Muchie',
];

/* ---------- 1. HERO ---------- */
function buildHero() {
  const s = newSlide(0);

  const tag = makeText('[ PRESENTASI EKONOMI ]', { size: 8, color: PAL.gold });
  tag.position.set(0, 5.4, 0);
  add(s, tag, { delay: 0 });

  const title = makeText('KELOMPOK 2', { size: 40, color: PAL.ink, shadow: PAL.navy });
  title.position.set(0, 3.9, 0);
  add(s, title, { delay: 120 });

  const sub = makeText('SISTEM EKONOMI KOMANDO', { size: 16, color: PAL.gold });
  sub.position.set(0, 2.4, 0);
  add(s, sub, { delay: 300 });

  const lab = makeText('· ANGGOTA ·', { size: 8, color: PAL.muted });
  lab.position.set(0, 0.9, 0);
  add(s, lab, { delay: 450 });

  NAMES.forEach((n, i) => {
    const t = makeText('> ' + n, { size: 8, color: PAL.ink });
    t.position.set(0, -0.3 - i * 0.55, 0);
    add(s, t, {
      delay: 560 + i * 70,
      from:  { x: 0, y: 0, z: 2 },
      fromScale: 0.6,
    });
  });

  const hint = makeText('[ TEKAN -> UNTUK LANJUT ]', { size: 8, color: PAL.gold });
  hint.position.set(0, -5.4, 0);
  add(s, hint, { delay: 1400 });

  return s;
}

/* ---------- 2. PENGERTIAN ---------- */
function buildPengertian() {
  const s = newSlide(1);

  const tag = makeText('[ MATERI PERTAMA ]', { size: 8, color: PAL.gold });
  tag.position.set(0, 5.6, 0);
  add(s, tag);

  const t1 = makeText('PENGERTIAN', { size: 24, color: PAL.ink, shadow: PAL.navy });
  t1.position.set(0, 4.4, 0);
  add(s, t1, { delay: 100 });

  const t2 = makeText('SISTEM EKONOMI KOMANDO', { size: 16, color: PAL.gold });
  t2.position.set(0, 3.3, 0);
  add(s, t2, { delay: 220 });

  const body = makeText(
    'Sistem ekonomi komando adalah sistem yang menyerahkan seluruh kegiatan ekonomi ' +
    '— mulai dari produksi, distribusi, hingga penetapan harga — kepada perencanaan ' +
    'dan pengendalian pemerintah pusat.',
    {
      size: 8, color: PAL.text, maxW: 360, align: 'center',
      bg: PAL.card, bgBorder: PAL.navy, bgShadow: PAL.cardSh, pad: 10,
    }
  );
  body.position.set(0, 1.4, 0);
  add(s, body, { delay: 400 });

  const cards = [
    ['PRODUKSI',  'Negara menentukan jenis dan jumlah barang yang dibuat.'],
    ['DISTRIBUSI','Pemerintah mengatur arus barang ke masyarakat.'],
    ['HARGA',     'Harga ditetapkan negara, bukan mekanisme pasar.'],
  ];
  cards.forEach((c, i) => {
    const card = makeCard(6.8, 2.7, { title: c[0], body: c[1] });
    card.position.set((i - 1) * 7.4, -2.6, 0);
    add(s, card, {
      delay: 620 + i * 110,
      from:  { x: 0, y: -1.2, z: 1.5 },
    });
  });

  return s;
}

/* ---------- 3. CIRI-CIRI ---------- */
function buildCiri() {
  const s = newSlide(2);

  const tag = makeText('[ MATERI KEDUA ]', { size: 8, color: PAL.gold });
  tag.position.set(0, 5.6, 0);
  add(s, tag);

  const t1 = makeText('CIRI-CIRI UTAMA', { size: 24, color: PAL.ink, shadow: PAL.navy });
  t1.position.set(0, 4.4, 0);
  add(s, t1, { delay: 100 });

  const items = [
    ['DIKUASAI NEGARA',      'SDA, tanah, dan alat produksi dimiliki negara.'],
    ['RENCANA TERPUSAT',     'Target produksi ditentukan pemerintah pusat.'],
    ['HARGA DITETAPKAN',     'Negara yang menentukan, bukan pasar bebas.'],
    ['MINIM PERSAINGAN',     'Pelaku usaha ikut arahan negara, bukan bersaing.'],
    ['KEPUTUSAN TOP-DOWN',   'Kebijakan mengalir dari pusat ke daerah.'],
    ['SWASTA TERBATAS',      'Kepemilikan pribadi dan kebebasan dibatasi.'],
  ];
  items.forEach((it, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const card = makeCard(7.2, 3.2, { title: it[0], body: it[1] });
    card.position.set((col - 1) * 7.8, 1.6 - row * 3.8, 0);
    add(s, card, {
      delay: 250 + i * 90,
      from:  { x: 0, y: -1.2, z: 1.8 },
    });
  });

  return s;
}

/* ---------- 4. KELEBIHAN ---------- */
function buildKelebihan() {
  const s = newSlide(3);

  const tag = makeText('[ MATERI KETIGA ]', { size: 8, color: PAL.gold });
  tag.position.set(0, 5.6, 0);
  add(s, tag);

  const t1 = makeText('KELEBIHAN', { size: 24, color: PAL.ink, shadow: PAL.navy });
  t1.position.set(0, 4.4, 0);
  add(s, t1, { delay: 100 });

  const items = [
    ['DISTRIBUSI MERATA',   'Kebutuhan pokok dibagi adil, kesenjangan ditekan.'],
    ['HARGA STABIL',        'Harga dikendalikan negara, gejolak pasar minim.'],
    ['PENGANGGURAN RENDAH', 'Negara menempatkan tenaga kerja secara terencana.'],
    ['PRIORITAS CEPAT',     'Proyek besar bisa digerakkan cepat karena terpusat.'],
  ];
  items.forEach((it, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const card = makeCard(10.6, 3.4, { title: it[0], body: it[1] });
    card.position.set((col - 0.5) * 11.2, 1.4 - row * 4.1, 0);
    add(s, card, {
      delay: 250 + i * 110,
      from:  { x: 0, y: -1.3, z: 1.8 },
    });
  });

  return s;
}

/* ---------- 5. KEKURANGAN ---------- */
function buildKekurangan() {
  const s = newSlide(4);

  const tag = makeText('[ MATERI KEEMPAT ]', { size: 8, color: PAL.red });
  tag.position.set(0, 5.6, 0);
  add(s, tag);

  const t1 = makeText('KEKURANGAN', { size: 24, color: PAL.ink, shadow: PAL.redDk });
  t1.position.set(0, 4.4, 0);
  add(s, t1, { delay: 100 });

  const items = [
    ['INOVASI TERHAMBAT',   'Tanpa persaingan, kreativitas sulit berkembang.'],
    ['KURANG EFISIEN',      'Birokrasi panjang, respons jadi lambat.'],
    ['KELANGKAAN BARANG',   'Salah rencana memicu antrean dan penimbunan.'],
    ['KEBEBASAN TERBATAS',  'Individu tak bebas memilih usaha atau harga.'],
  ];
  items.forEach((it, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const card = makeCard(10.6, 3.4, {
      title: it[0], body: it[1],
      border: PAL.redDk, bg: '#fff0f0', innerSh: '#ffd0d0',
      titleCol: PAL.redDk, bodyCol: '#7a3030',
    });
    card.position.set((col - 0.5) * 11.2, 1.4 - row * 4.1, 0);
    add(s, card, {
      delay: 250 + i * 110,
      from:  { x: 0, y: -1.3, z: 1.8 },
    });
  });

  return s;
}

/* ---------- 6. NEGARA PENGANUT ---------- */
function buildNegara() {
  const s = newSlide(5);

  const tag = makeText('[ MATERI KELIMA ]', { size: 8, color: PAL.gold });
  tag.position.set(0, 5.6, 0);
  add(s, tag);

  const t1 = makeText('NEGARA PENGANUT', { size: 24, color: PAL.ink, shadow: PAL.navy });
  t1.position.set(0, 4.4, 0);
  add(s, t1, { delay: 100 });

  const items = [
    { name: 'KOREA UTARA', flag: flagKP, desc: 'Rencana negara mengatur hampir seluruh sektor ekonomi.', badge: 'MASIH', old: false },
    { name: 'KUBA',        flag: flagCU, desc: 'Pemerintah kuasai sektor utama, ruang swasta kecil.',    badge: 'MASIH', old: false },
    { name: 'UNI SOVIET',  flag: flagSU, desc: 'Rencana lima tahunan atur produksi nasional.',           badge: '1991',  old: true  },
    { name: 'TIONGKOK',    flag: flagCN, desc: 'Ekonomi terencana ketat sebelum reformasi pasar 1978.',  badge: '1978',  old: true  },
  ];
  items.forEach((it, i) => {
    const card = makeCard(5.3, 6.6, {
      title: it.name, body: it.desc,
      flag: it.flag,
      titleCol: it.old ? PAL.goldDk : PAL.navy,
    });
    card.position.set((i - 1.5) * 5.8, -0.9, 0);
    add(s, card, {
      delay: 250 + i * 120,
      from:  { x: 0, y: -1.6, z: 1.8 },
    });
  });

  return s;
}

/* ---------- 7. KESIMPULAN ---------- */
function buildKesimpulan() {
  const s = newSlide(6);

  const tag = makeText('[ PENUTUP ]', { size: 8, color: PAL.gold });
  tag.position.set(0, 5.6, 0);
  add(s, tag);

  const t1 = makeText('KESIMPULAN', { size: 24, color: PAL.gold, shadow: PAL.navy });
  t1.position.set(0, 4.4, 0);
  add(s, t1, { delay: 100 });

  const body = makeText(
    'Sistem ekonomi komando menempatkan pemerintah pusat sebagai pengendali penuh ' +
    'kegiatan ekonomi, sehingga distribusi lebih merata dan harga cenderung stabil. ' +
    'Namun minimnya persaingan membuat inovasi terhambat dan efisiensi menurun, ' +
    'sehingga sistem ini jarang diterapkan secara utuh pada masa kini.',
    {
      size: 8, color: PAL.text, maxW: 360, align: 'center',
      bg: PAL.card, bgBorder: PAL.navy, bgShadow: PAL.cardSh, pad: 10,
    }
  );
  body.position.set(0, 1.9, 0);
  add(s, body, { delay: 400 });

  const items = [
    ['TERPUSAT',  'Semua keputusan ekonomi di tangan negara.'],
    ['KELEBIHAN', 'Pemerataan, harga stabil, arah jelas.'],
    ['KEKURANGAN','Inovasi rendah, birokrasi panjang.'],
  ];
  items.forEach((it, i) => {
    const card = makeCard(6.8, 2.9, { title: it[0], body: it[1] });
    card.position.set((i - 1) * 7.4, -3.1, 0);
    add(s, card, {
      delay: 620 + i * 100,
      from:  { x: 0, y: -1.2, z: 1.5 },
    });
  });

  return s;
}

/* ---------- 8. TERIMA KASIH ---------- */
function buildTerimakasih() {
  const s = newSlide(7);

  const big = makeText('TERIMA KASIH', { size: 40, color: PAL.gold, shadow: PAL.navy });
  big.position.set(0, 1.4, 0);
  add(s, big, { delay: 120 });

  const sub = makeText('KELOMPOK 2 — SISTEM EKONOMI KOMANDO', { size: 12, color: PAL.ink });
  sub.position.set(0, -1.1, 0);
  add(s, sub, { delay: 400 });

  const hint = makeText('[ TEKAN -> UNTUK ULANG ]', { size: 8, color: PAL.muted });
  hint.position.set(0, -3.5, 0);
  add(s, hint, { delay: 700 });

  /* halo pixels (grid pixel melingkar) */
  for (let i = 0; i < 3; i++) {
    const ring = makeText('· · · · · · · · · · · · · · · · · · · · · · ·',
      { size: 8, color: i === 1 ? PAL.blue : PAL.gold });
    ring.position.set(0, 3.6 + i * 0.1, -2 - i * 0.5);
    ring.material.opacity = 0.55 - i * 0.15;
    add(s, ring, { delay: 200 + i * 200, fromScale: 0.4 });
  }

  return s;
}

/* =========================================================
   BUILD SEMUA
   ========================================================= */
const BUILDERS = [
  buildHero, buildPengertian, buildCiri, buildKelebihan,
  buildKekurangan, buildNegara, buildKesimpulan, buildTerimakasih,
];

function buildAll() {
  BUILDERS.forEach(fn => slides.push(fn()));
}

/* =========================================================
   OPACITY HELPERS
   ========================================================= */
function setOpacity(mesh, o) {
  const m = mesh.material;
  if (Array.isArray(m)) m.forEach(mm => { mm.opacity = o; });
  else if (m)           m.opacity = o;
}

function setSlideOpacity(slide, o) {
  slide.userData.elements.forEach(el => setOpacity(el, o));
}

/* =========================================================
   NAVIGATION
   ========================================================= */
const TRANS_DUR = 1300;
let transitioning = false;
let transStart = 0;
let transFrom = 0;
let transTo = 0;

function resetSlide(slide) {
  slide.userData.elements.forEach(el => {
    el.userData.animated = false;
    el.userData.enterAt = 0;
    const b = el.userData.basePos;
    const off = el.userData.fromOffset;
    el.position.set(b.x + off.x, b.y + off.y, b.z + off.z);
    el.scale.setScalar(el.userData.fromScale);
    setOpacity(el, 0);
  });
}

function goTo(n) {
  if (transitioning) return;
  if (n < 0 || n >= slides.length) return;
  if (n === curSlide) return;

  resetSlide(slides[n]);

  transFrom = curSlide;
  transTo = n;
  transStart = performance.now();
  transitioning = true;
  curSlide = n;
  updateUI();
}

/* =========================================================
   UI
   ========================================================= */
const dtEl = document.getElementById('dt');
const cnEl = document.getElementById('cn');

function buildUI() {
  dtEl.innerHTML = slides.map(() => '<i></i>').join('');
}

function updateUI() {
  const dots = dtEl.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = i === curSlide ? 'on' : '';
  }
  cnEl.textContent = String(curSlide + 1).padStart(2, '0') +
                     ' / ' + String(slides.length).padStart(2, '0');
}

/* =========================================================
   MAIN LOOP
   ========================================================= */
const camZFrom = new THREE.Vector3();
const camZTo   = new THREE.Vector3();

function tick(now) {
  requestAnimationFrame(tick);
  if (!now) now = performance.now();

  /* --- camera transition --- */
  if (transitioning) {
    const t = Math.min(1, (now - transStart) / TRANS_DUR);
    const e = 1 - Math.pow(1 - t, 3);  // easeOutCubic

    const fromZ = -transFrom * GAP + CAM_DIST;
    const toZ   = -transTo   * GAP + CAM_DIST;
    camera.position.z = fromZ + (toZ - fromZ) * e;

    /* fade-out slide lama */
    const exitP = Math.min(1, t / 0.55);
    setSlideOpacity(slides[transFrom], 1 - exitP);

    if (t >= 1) {
      transitioning = false;
      setSlideOpacity(slides[transFrom], 1);
      /* slide lama sudah tidak akan terlihat lagi, aman direset */
      slides[transFrom].userData.elements.forEach(el => {
        el.userData.animated = true;
      });
    }
  } else {
    /* idle: kamera tetap */
    camera.position.z = -curSlide * GAP + CAM_DIST;
  }

  /* --- entry animation slide aktif --- */
  const cur = slides[curSlide];
  if (cur) {
    for (const el of cur.userData.elements) {
      if (el.userData.animated) continue;
      if (el.userData.enterAt === 0) el.userData.enterAt = now;
      const et = now - el.userData.enterAt - el.userData.entryDelay;
      if (et < 0) continue;

      const t = Math.min(1, et / el.userData.entryDur);
      const e = 1 - Math.pow(1 - t, 4);  // easeOutQuart

      const b   = el.userData.basePos;
      const off = el.userData.fromOffset;
      el.position.set(
        b.x + off.x * (1 - e),
        b.y + off.y * (1 - e),
        b.z + off.z * (1 - e)
      );
      const s = el.userData.fromScale + (1 - el.userData.fromScale) * e;
      el.scale.setScalar(s);

      /* kalau material punya baseOpacity dari dekorasi, hormati itu */
      const baseOp = el.userData.baseOpacity != null ? el.userData.baseOpacity : 1;
      setOpacity(el, baseOp * e);

      if (t >= 1) el.userData.animated = true;
    }
  }

  renderer.render(scene, camera);
}

/* =========================================================
   EVENT HANDLERS
   ========================================================= */
function onNext() { goTo(curSlide + 1); }
function onPrev() { goTo(curSlide - 1); }

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault(); onNext();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault(); onPrev();
  }
});

let downX = 0, downY = 0, downT = 0;
canvas.addEventListener('pointerdown', e => {
  downX = e.clientX; downY = e.clientY; downT = performance.now();
});
canvas.addEventListener('pointerup', e => {
  const dx = e.clientX - downX;
  const dy = e.clientY - downY;
  const dt = performance.now() - downT;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) onNext(); else onPrev();
  } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && dt < 400) {
    onNext();
  }
});

/* =========================================================
   INIT
   ========================================================= */
function init() {
  resize();
  computePX();
  buildAll();
  buildUI();

  /* simpan baseOpacity dekorasi untuk slide 8 (halo) */
  slides.forEach(slide => {
    slide.userData.elements.forEach(el => {
      el.userData.baseOpacity = el.material.opacity != null ? 1 : 1;
    });
  });

  /* reset semua slide ke state "belum masuk" */
  slides.forEach((s, i) => {
    resetSlide(s);
    if (i === 0) {
      s.userData.elements.forEach(el => {
        el.userData.animated = false;
        el.userData.enterAt = 0;
      });
    } else {
      s.userData.elements.forEach(el => {
        el.userData.animated = false;
        el.userData.enterAt = 0;
      });
    }
  });

  updateUI();
  requestAnimationFrame(tick);

  /* fade boot */
  const boot = document.getElementById('boot');
  setTimeout(() => {
    boot.classList.add('gone');
    setTimeout(() => boot.remove(), 800);
  }, 400);
}

window.addEventListener('resize', () => {
  resize();
  /* PX tetap — landscape sudah dikunci ke SHORT_SIDE */
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
