(() => {
"use strict";

/* ============================================================
   CONSTANTS
   ============================================================ */
const CW = 1200, CH = 600;
const GRAVITY = 280;
const VEL_SCALE = 7.0;
const TANK_W = 36, TANK_H = 12, TURRET_R = 9, BARREL_LEN = 26;
const MOVES_PER_GAME = 5;
const MOVE_DIST = 88;
const MOVE_SPEED = 220;
const MIN_ANGLE = 0, MAX_ANGLE = 360;

const CAMPAIGN_OPPONENTS = [
  { name:"BEAN",   title:"The Rookie",    desc:"Misses more than hits",        accuracy:0.2,  personality:"random",  color:"#88cc44" },
  { name:"DUKE",   title:"The Soldier",   desc:"Plays by the book",            accuracy:0.3,  personality:"balanced",color:"#44aaff" },
  { name:"RAVEN",  title:"The Sniper",    desc:"Waits for the perfect shot",   accuracy:0.45, personality:"sniper",  color:"#cc44ff" },
  { name:"BLAZE",  title:"The Hothead",   desc:"Loves big explosions",         accuracy:0.35, personality:"aggressive",color:"#ff4444" },
  { name:"SHADOW", title:"The Tactician", desc:"Always two steps ahead",       accuracy:0.5,  personality:"tactical",color:"#666699" },
  { name:"STORM",  title:"The Berserker", desc:"Chaos is the strategy",        accuracy:0.4,  personality:"chaotic", color:"#ff8800" },
  { name:"VIPER",  title:"The Assassin",  desc:"Strikes when you least expect",accuracy:0.6,  personality:"sniper",  color:"#44ff88" },
  { name:"TITAN",  title:"The Heavy",     desc:"Overwhelming firepower",       accuracy:0.55, personality:"heavy",   color:"#ffaa00" },
  { name:"OMEGA",  title:"The Commander", desc:"Battlefield master",           accuracy:0.7,  personality:"balanced",color:"#ff44aa" },
  { name:"APEX",   title:"The Legend",    desc:"Has never been beaten",        accuracy:0.85, personality:"expert",  color:"#ffd700" },
];

const SKY_PRESETS = [
  { stops:[[0,26,10,46],[0.15,74,25,66],[0.4,192,80,80],[0.6,224,128,64],[0.78,240,192,112],[0.9,253,232,176],[1,253,240,208]], star:0.4 },
  { stops:[[0,6,9,26],[0.15,14,27,61],[0.4,28,68,116],[0.6,59,125,186],[0.78,106,176,217],[0.9,160,212,234],[1,200,230,240]], star:0 },
  { stops:[[0,10,10,32],[0.15,26,16,64],[0.4,74,32,96],[0.6,192,64,96],[0.78,224,112,64],[0.9,224,160,80],[1,192,160,112]], star:0.2 },
  { stops:[[0,2,2,8],[0.15,5,5,16],[0.4,8,8,24],[0.6,10,10,34],[0.78,12,12,40],[0.9,14,16,48],[1,16,18,56]], star:1 },
];

const WEAPONS = [
  { name:"Single Shot",    radius:22,  damage:20,  speed:1,    count:1,  color:"#ffeedd" },
  { name:"Big Shot",       radius:42,  damage:30,  speed:1,    count:1,  color:"#ff8800" },
  { name:"3 Shot",         radius:16,  damage:12,  speed:1,    count:3,  spread:5,   color:"#ffee44" },
  { name:"5 Shot",         radius:12,  damage:8,   speed:1,    count:5,  spread:4,   color:"#ffcc22" },
  { name:"Scatter Shot",   radius:10,  damage:6,   speed:1,    count:9,  spread:3,   color:"#ffdd88" },
  { name:"Sniper Rifle",   radius:8,   damage:55,  speed:2.0,  count:1,  color:"#ff2244" },
  { name:"Jackhammer",     radius:14,  damage:15,  speed:1.2,  count:3,  spread:1,   color:"#cc88ff" },
  { name:"Heatseeker",     radius:28,  damage:35,  speed:1.3,  count:1,  color:"#ff4466", homing:true },
  { name:"Homing Missile", radius:32,  damage:40,  speed:1.1,  count:1,  color:"#ff6688", homing:true },
  { name:"Napalm",         radius:50,  damage:22,  speed:0.9,  count:1,  color:"#ff6600", napalm:true },
  { name:"Firecracker",    radius:12,  damage:8,   speed:1,    count:1,  color:"#ff4400", chain:7,  chainSpread:30 },
  { name:"Chain Reaction",  radius:18, damage:10,  speed:1,    count:1,  color:"#ffaa00", chain:5,  chainSpread:18 },
  { name:"Crazy Ivan",     radius:14,  damage:10,  speed:1.1,  count:1,  color:"#aa44ff", splitAbove:true, splitCount:8 },
  { name:"Carpet Bomb",    radius:14,  damage:10,  speed:1,    count:11, spread:2.2, color:"#bb6633" },
  { name:"Fission Bomb",   radius:8,   damage:5,   speed:1,    count:1,  color:"#44ddff", splitAbove:true, splitCount:14 },
  { name:"Cannon Ball",    radius:6,   damage:60,  speed:1.5,  count:1,  color:"#aaaaaa", bounce:3 },
  { name:"Cruiser",        radius:30,  damage:28,  speed:0.8,  count:1,  color:"#88cc44", roller:true },
  { name:"Skipper",        radius:18,  damage:15,  speed:1.2,  count:1,  color:"#44aaff", bounce:5 },
  { name:"Pineapple",      radius:16,  damage:8,   speed:1,    count:1,  color:"#88dd22", splitAbove:true, splitCount:10 },
  { name:"Dirt Mover",     radius:70,  damage:3,   speed:1,    count:1,  color:"#aa7744" },
  { name:"Crater Maker",   radius:55,  damage:15,  speed:0.9,  count:1,  color:"#996633" },
  { name:"Digger",         radius:35,  damage:5,   speed:1,    count:1,  color:"#775522" },
  { name:"Bunker Buster",  radius:45,  damage:45,  speed:1.6,  count:1,  color:"#dd4400" },
  { name:"Hail Storm",     radius:10,  damage:4,   speed:1,    count:15, spread:8,   color:"#aaddff" },
  { name:"Tommy Gun",      radius:8,   damage:5,   speed:1.4,  count:12, spread:1.5, color:"#ffcc00" },
  { name:"Nuke",           radius:80,  damage:50,  speed:0.7,  count:1,  color:"#ffff00", nuke:true },
  { name:"Mega Reaction",  radius:22,  damage:12,  speed:1,    count:1,  color:"#ff5500", chain:10, chainSpread:25 },
  { name:"Mass Driver",    radius:65,  damage:42,  speed:0.6,  count:1,  color:"#ff8844", nuke:true },
  { name:"Fireball",       radius:20,  damage:18,  speed:1.1,  count:1,  color:"#ff3300", bounce:4, napalm:true },
  { name:"Dive Bomb",      radius:12,  damage:7,   speed:1.2,  count:10, spread:1.8, color:"#5599ff" },
];

const P1_COLORS = { body:"#c0392b", mid:"#e74c3c", light:"#ff6b6b", dark:"#7b1a1a", accent:"#ff8888" };
const P2_COLORS = { body:"#1a8a7d", mid:"#2ec4b6", light:"#4ecdc4", dark:"#0e5c54", accent:"#80ece5" };

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ============================================================
   AUDIO
   ============================================================ */
let audioCtx;
function ensureAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playSound(type) {
  if (!gameSettings.sound) return;
  try {
    ensureAudio();
    const now = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);
    if (type === "fire") {
      const o = audioCtx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(220, now);
      o.frequency.exponentialRampToValueAtTime(60, now + 0.18);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      o.connect(gain); o.start(now); o.stop(now + 0.22);
      const n = audioCtx.createBufferSource();
      const nb = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.08, audioCtx.sampleRate);
      const nd = nb.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * (1 - i / nd.length);
      n.buffer = nb;
      const g2 = audioCtx.createGain();
      g2.gain.setValueAtTime(0.12, now);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      n.connect(g2); g2.connect(audioCtx.destination);
      n.start(now);
    } else if (type === "explode") {
      const sz = audioCtx.sampleRate * 0.4;
      const buf = audioCtx.createBuffer(1, sz, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sz, 1.5);
      const src = audioCtx.createBufferSource(); src.buffer = buf;
      const lp = audioCtx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(800, now);
      lp.frequency.exponentialRampToValueAtTime(40, now + 0.4);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      src.connect(lp); lp.connect(gain); src.start(now);
    }
  } catch(e) {}
}

/* ============================================================
   DOM REFS
   ============================================================ */
const $ = id => document.getElementById(id);
const angVal = $("ang-val"), powVal = $("pow-val");
const p1Score = $("p1-score"), p2Score = $("p2-score");
const roundLabel = $("round-label");
const windVal = $("wind-val");
const turnBanner = $("turn-banner");
const fireBtn = $("fire-btn");
const moveCounter = $("move-counter");
const moveLeftBtn = $("move-left");
const moveRightBtn = $("move-right");
const weaponSelect = $("weapon-select");
const modeOverlay = $("mode-overlay");
const nameOverlay = $("name-overlay");
const goOverlay = $("game-over-overlay");

/* ============================================================
   GAME STATE
   ============================================================ */
let terrain = [];
let tanks = [];
let projectiles = [];
let particles = [];
let smokeParticles = [];
let floatingTexts = [];
let explosions = [];
let currentPlayer = 0;
let angle = 45, power = 50, selectedWeapon = 0;
let moveAnim = null;
let phase = "menu";
let wind = 0;
let vsCPU = false;
let playerNames = ["PLAYER 1", "PLAYER 2"];
let roundNumber = 0;
let shotsThisRound = 0;
let shakeTimer = 0, shakeIntensity = 0;
let bannerTimer = 0;
let settleTimer = 0;
let aiDelay = 0;
let gameTime = 0;
let gameSettings = { rounds: 10, sound: true, gravity: 1.0, autoDraft: false };
let draftPool = [], draftPicks = [[], []], draftTurn = 0;
let campaignMode = false, campaignLevel = 0;
let weatherType = "none", weatherDrops = [];
const draftOverlay = $("draft-overlay");
const campaignOverlay = $("campaign-overlay");
const settingsOverlay = $("settings-overlay");

/* ============================================================
   PRE-RENDERED BACKGROUNDS (offscreen canvases)
   ============================================================ */
let mountainLayers = [];
let starField = null;
let terrainTexture = null;

function generateStarField() {
  const c = document.createElement("canvas");
  c.width = CW; c.height = CH;
  const cx = c.getContext("2d");
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * CW;
    const y = Math.random() * CH * 0.45;
    const r = 0.3 + Math.random() * 1.2;
    const a = 0.15 + Math.random() * 0.5;
    cx.fillStyle = `rgba(255,255,240,${a})`;
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fill();
  }
  starField = c;
}

function generateMountainLayer(color1, color2, heightMin, heightMax, roughness, yOffset) {
  const c = document.createElement("canvas");
  c.width = CW; c.height = CH;
  const cx = c.getContext("2d");
  const h = new Float32Array(CW);
  h[0] = heightMin + Math.random() * (heightMax - heightMin);
  h[CW - 1] = heightMin + Math.random() * (heightMax - heightMin);
  function sub(l, r, d) {
    if (r - l <= 1) return;
    const m = (l + r) >> 1;
    h[m] = (h[l] + h[r]) / 2 + (Math.random() - 0.5) * d;
    h[m] = Math.max(heightMin * 0.5, Math.min(h[m], heightMax * 1.2));
    sub(l, m, d * roughness); sub(m, r, d * roughness);
  }
  sub(0, CW - 1, heightMax);
  for (let p = 0; p < 3; p++)
    for (let x = 1; x < CW - 1; x++)
      h[x] = (h[x - 1] + h[x] + h[x + 1]) / 3;

  const g = cx.createLinearGradient(0, CH - heightMax - yOffset, 0, CH);
  g.addColorStop(0, color1);
  g.addColorStop(1, color2);
  cx.fillStyle = g;
  cx.beginPath();
  cx.moveTo(0, CH);
  for (let x = 0; x < CW; x++) cx.lineTo(x, CH - h[x] - yOffset);
  cx.lineTo(CW, CH);
  cx.closePath();
  cx.fill();
  return c;
}

function generateAllBackgrounds() {
  generateStarField();
  mountainLayers = [
    generateMountainLayer("rgba(30,35,60,0.5)", "rgba(20,22,40,0.5)", 140, 220, 0.55, 80),
    generateMountainLayer("rgba(25,40,55,0.6)", "rgba(15,25,35,0.6)", 100, 180, 0.58, 40),
    generateMountainLayer("rgba(20,45,40,0.7)", "rgba(12,28,22,0.7)", 80, 150, 0.6, 10),
  ];
  generateTerrainTexture();
}

let terrainDetailCanvas = null;

function generateTerrainTexture() {
  const c = document.createElement("canvas");
  c.width = 128; c.height = 128;
  const cx = c.getContext("2d");
  const img = cx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 30;
    img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v; img.data[i+3] = 25;
  }
  cx.putImageData(img, 0, 0);
  terrainTexture = ctx.createPattern(c, "repeat");
}

function buildTerrainDetailLayer() {
  const c = document.createElement("canvas");
  c.width = CW; c.height = CH;
  const cx = c.getContext("2d");

  // exposed dirt patches (large soft blobs that break up the uniform gradient)
  for (let i = 0; i < 40; i++) {
    const px = Math.random() * CW;
    const depthRatio = 0.1 + Math.random() * 0.6;
    const sy = CH - terrain[Math.floor(px)] + terrain[Math.floor(px)] * depthRatio;
    const rw = 15 + Math.random() * 40, rh = 8 + Math.random() * 18;
    const hue = Math.random();
    const r = hue < 0.4 ? 70 + Math.random() * 40 : 50 + Math.random() * 30;
    const g = hue < 0.4 ? 50 + Math.random() * 25 : 40 + Math.random() * 20;
    const b = hue < 0.4 ? 30 + Math.random() * 15 : 25 + Math.random() * 15;
    const grad = cx.createRadialGradient(px, sy, 0, px, sy, rw);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    cx.fillStyle = grad;
    cx.beginPath();
    cx.ellipse(px, sy, rw, rh, Math.random() * 0.5, 0, Math.PI * 2);
    cx.fill();
  }

  // topsoil band — root fibers and humus specks
  for (let x = 0; x < CW; x++) {
    const sy = CH - terrain[x];
    for (let dy = 2; dy < 18; dy++) {
      if (Math.random() < 0.08) {
        const r = 0.5 + Math.random() * 2;
        cx.fillStyle = `rgba(${30+Math.random()*35},${20+Math.random()*18},${8},${0.2+Math.random()*0.2})`;
        cx.beginPath(); cx.arc(x, sy + dy, r, 0, Math.PI * 2); cx.fill();
      }
    }
    // small root-like lines in topsoil
    if (Math.random() < 0.008) {
      cx.strokeStyle = `rgba(55,35,15,0.2)`;
      cx.lineWidth = 0.7;
      cx.beginPath();
      cx.moveTo(x, sy + 4 + Math.random() * 6);
      cx.quadraticCurveTo(x + (Math.random()-0.5)*15, sy + 8 + Math.random()*8, x + (Math.random()-0.5)*20, sy + 12 + Math.random()*6);
      cx.stroke();
    }

    // pebbles in clay layer 18-60px
    if (Math.random() < 0.04) {
      const dy = 20 + Math.random() * 40;
      const sz = 2 + Math.random() * 4;
      const gray = 90 + Math.random() * 60;
      cx.fillStyle = `rgba(${gray},${gray-15},${gray-25},${0.35+Math.random()*0.2})`;
      cx.beginPath();
      cx.ellipse(x, sy + dy, sz, sz * 0.55, Math.random() * Math.PI, 0, Math.PI * 2);
      cx.fill();
      cx.strokeStyle = `rgba(${gray+30},${gray+15},${gray},0.15)`;
      cx.lineWidth = 0.5;
      cx.stroke();
    }
    // larger rocks in deep layer 60-150px
    if (Math.random() < 0.02) {
      const dy = 65 + Math.random() * 90;
      const sz = 3 + Math.random() * 7;
      const gray = 60 + Math.random() * 55;
      cx.fillStyle = `rgba(${gray},${gray-8},${gray-12},${0.3+Math.random()*0.2})`;
      cx.beginPath();
      cx.ellipse(x, sy + dy, sz, sz * 0.45, Math.random() * Math.PI, 0, Math.PI * 2);
      cx.fill();
      cx.strokeStyle = `rgba(${gray+20},${gray+10},${gray+5},0.12)`;
      cx.lineWidth = 0.5;
      cx.stroke();
    }
  }

  // strata lines (wavy, doubled for better visibility)
  const bands = [
    { depth: 16, color1: "rgba(40,28,12,0.3)",  color2: "rgba(80,60,35,0.12)", width: 2, wave: 0.035 },
    { depth: 55, color1: "rgba(70,50,30,0.25)", color2: "rgba(100,75,45,0.10)", width: 1.5, wave: 0.028 },
    { depth: 110, color1: "rgba(55,50,45,0.22)", color2: "rgba(75,68,60,0.08)", width: 2, wave: 0.022 },
    { depth: 170, color1: "rgba(45,40,38,0.18)", color2: "rgba(60,55,50,0.06)", width: 1.5, wave: 0.018 },
  ];
  for (const b of bands) {
    // dark line
    cx.beginPath();
    cx.strokeStyle = b.color1;
    cx.lineWidth = b.width;
    for (let x = 0; x < CW; x++) {
      const sy = CH - terrain[x] + b.depth + Math.sin(x * b.wave) * 5 + Math.sin(x * b.wave * 3.1) * 2.5;
      if (x === 0) cx.moveTo(x, sy); else cx.lineTo(x, sy);
    }
    cx.stroke();
    // lighter companion line above
    cx.beginPath();
    cx.strokeStyle = b.color2;
    cx.lineWidth = b.width * 2.5;
    for (let x = 0; x < CW; x++) {
      const sy = CH - terrain[x] + b.depth - 2 + Math.sin(x * b.wave) * 5 + Math.sin(x * b.wave * 3.1) * 2.5;
      if (x === 0) cx.moveTo(x, sy); else cx.lineTo(x, sy);
    }
    cx.stroke();
  }

  terrainDetailCanvas = c;
}

/* ============================================================
   TERRAIN
   ============================================================ */
function generateTerrain() {
  terrain = new Float32Array(CW);
  terrain[0] = 120 + Math.random() * 130;
  terrain[CW - 1] = 120 + Math.random() * 130;
  function subdivide(l, r, disp) {
    if (r - l <= 1) return;
    const m = (l + r) >> 1;
    terrain[m] = (terrain[l] + terrain[r]) / 2 + (Math.random() - 0.5) * disp;
    terrain[m] = Math.max(50, Math.min(terrain[m], CH - 100));
    subdivide(l, m, disp * 0.6);
    subdivide(m, r, disp * 0.6);
  }
  subdivide(0, CW - 1, 250);
  for (let p = 0; p < 5; p++)
    for (let x = 1; x < CW - 1; x++)
      terrain[x] = (terrain[x - 1] + terrain[x] + terrain[x + 1]) / 3;
}

function terrainY(x) {
  const ix = Math.max(0, Math.min(CW - 1, Math.floor(x)));
  return CH - terrain[ix];
}
function terrainSlope(x) {
  const d = 8;
  const xl = Math.max(0, Math.floor(x - d));
  const xr = Math.min(CW - 1, Math.ceil(x + d));
  return Math.atan2(terrain[xr] - terrain[xl], xr - xl);
}

/* ============================================================
   CLOUDS  (pre-rendered cumulus sprites)
   ============================================================ */
let clouds = [];

function buildCloudSprite(w, h) {
  const pad = 20;
  const cw = w + pad * 2, ch = h + pad * 2;

  const shape = document.createElement("canvas");
  shape.width = cw; shape.height = ch;
  const sc = shape.getContext("2d");

  const baseY = ch * 0.58;
  const puffs = [];

  const cols = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < cols; i++) {
    const t = (i + 0.5) / cols;
    const env = Math.sin(t * Math.PI);
    const r = (w / cols) * (0.42 + Math.random() * 0.22) * (0.65 + env * 0.55);
    const px = pad + t * w + (Math.random() - 0.5) * r * 0.3;
    const py = baseY - r * (0.15 + env * 0.65) - Math.random() * r * 0.2;
    puffs.push({ x: px, y: py, r });
    const extras = env > 0.5 ? 2 : 1;
    for (let e = 0; e < extras; e++) {
      if (Math.random() > 0.25) {
        const sr = r * (0.4 + Math.random() * 0.35);
        puffs.push({
          x: px + (Math.random() - 0.5) * r * 0.9,
          y: py - r * 0.2 - Math.random() * sr * 0.6,
          r: sr,
        });
      }
    }
  }

  const bottomCount = cols + 2;
  for (let i = 0; i < bottomCount; i++) {
    const t = (i + 0.3) / bottomCount;
    const br = (w / bottomCount) * (0.5 + Math.random() * 0.2);
    puffs.push({
      x: pad + t * w,
      y: baseY + Math.random() * 3,
      r: br,
      isBase: true,
    });
  }

  sc.fillStyle = "#fff";
  sc.shadowColor = "rgba(255,255,255,0.6)";
  sc.shadowBlur = 6;
  for (const p of puffs) {
    sc.beginPath();
    if (p.isBase) {
      sc.ellipse(p.x, p.y, p.r, p.r * 0.4, 0, 0, Math.PI * 2);
    } else {
      sc.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    }
    sc.fill();
  }
  sc.shadowBlur = 0;

  const oc = document.createElement("canvas");
  oc.width = cw; oc.height = ch;
  const c = oc.getContext("2d");

  c.drawImage(shape, 0, 0);

  c.globalCompositeOperation = "source-atop";

  const lg = c.createLinearGradient(0, baseY - h * 1.1, 0, baseY + h * 0.35);
  lg.addColorStop(0, "#fdfeff");
  lg.addColorStop(0.3, "#eef1f8");
  lg.addColorStop(0.55, "#d2d9e8");
  lg.addColorStop(0.75, "#a8b2c8");
  lg.addColorStop(0.9, "#8892aa");
  lg.addColorStop(1, "#6a738c");
  c.fillStyle = lg;
  c.fillRect(0, 0, cw, ch);

  for (const p of puffs) {
    if (p.isBase) continue;
    const rg = c.createRadialGradient(
      p.x - p.r * 0.3, p.y - p.r * 0.35, p.r * 0.05,
      p.x, p.y, p.r
    );
    rg.addColorStop(0, "rgba(255,255,255,0.6)");
    rg.addColorStop(0.45, "rgba(255,255,255,0.15)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = rg;
    c.beginPath();
    c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    c.fill();
  }

  c.globalCompositeOperation = "source-over";

  const soft = document.createElement("canvas");
  soft.width = cw; soft.height = ch;
  const sf = soft.getContext("2d");
  sf.filter = "blur(2px)";
  sf.drawImage(oc, 0, 0);

  sf.globalCompositeOperation = "source-atop";
  sf.filter = "none";
  sf.drawImage(oc, 0, 0);

  return { canvas: soft, ox: pad, oy: pad };
}

function initClouds() {
  clouds = [];
  for (let i = 0; i < 6; i++) {
    const depth = 0.2 + Math.random() * 0.8;
    const scale = 0.5 + depth * 0.7;
    const w = (90 + Math.random() * 180) * scale;
    const h = (35 + Math.random() * 25) * scale;
    const sprite = buildCloudSprite(w, h);
    clouds.push({
      x: Math.random() * CW * 1.4 - CW * 0.2,
      y: 25 + (1 - depth) * 120 + Math.random() * 40,
      w, h, depth,
      speed: 1.5 + depth * 4 + Math.random() * 2,
      alpha: 0.45 + depth * 0.4,
      sprite,
    });
  }
  clouds.sort((a, b) => a.depth - b.depth);
}
initClouds();

function updateClouds(dt) {
  for (const c of clouds) {
    c.x += c.speed * dt;
    if (c.x > CW + c.w + 20) c.x = -c.w - 30;
  }
}

function drawClouds() {
  for (const c of clouds) {
    ctx.globalAlpha = c.alpha;
    ctx.drawImage(
      c.sprite.canvas,
      c.x - c.sprite.ox,
      c.y - c.sprite.oy
    );
  }
  ctx.globalAlpha = 1;
}

/* ============================================================
   BATS
   ============================================================ */
let bats = [];
function initBats() {
  bats = [];
  const count = 6 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    bats.push({
      x: Math.random() * CW,
      y: 30 + Math.random() * 120,
      vx: 15 + Math.random() * 30,
      vy: 0,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 8 + Math.random() * 6,
      size: 3 + Math.random() * 3,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.5 + Math.random() * 1.2,
    });
  }
}
initBats();

function updateBats(dt) {
  for (const b of bats) {
    b.wingPhase += b.wingSpeed * dt;
    b.drift += b.driftSpeed * dt;
    b.vy = Math.sin(b.drift) * 18;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.y = Math.max(15, Math.min(180, b.y));
    if (b.x > CW + 20) { b.x = -20; b.y = 30 + Math.random() * 120; }
  }
}

function drawBats() {
  ctx.fillStyle = "#0a0a12";
  for (const b of bats) {
    const wing = Math.sin(b.wingPhase);
    const s = b.size;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.4, s * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    const span = s * 1.6;
    const lift = wing * s * 0.7;
    const midLift = wing * s * 0.35;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(span * 0.4, midLift, span, lift);
    ctx.lineTo(span * 0.7, midLift * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-span * 0.4, midLift, -span, lift);
    ctx.lineTo(-span * 0.7, midLift * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

/* ============================================================
   WEATHER
   ============================================================ */
function initWeather() {
  const r = Math.random();
  weatherType = r < 0.45 ? "none" : r < 0.78 ? "rain" : "snow";
  weatherDrops = [];
  const count = weatherType === "rain" ? 180 : weatherType === "snow" ? 70 : 0;
  for (let i = 0; i < count; i++) {
    weatherDrops.push({
      x: Math.random() * CW, y: Math.random() * CH,
      speed: weatherType === "rain" ? 300 + Math.random() * 200 : 18 + Math.random() * 28,
      size: weatherType === "rain" ? 8 + Math.random() * 12 : 1.5 + Math.random() * 2.5,
      drift: Math.random() * Math.PI * 2,
    });
  }
}
function updateWeather(dt) {
  for (const d of weatherDrops) {
    if (weatherType === "rain") {
      d.y += d.speed * dt;
      d.x += (wind * 0.5 + 15) * dt;
    } else {
      d.y += d.speed * dt;
      d.drift += dt;
      d.x += Math.sin(d.drift) * 15 * dt + wind * 0.1 * dt;
    }
    if (d.y > CH) { d.y = -10; d.x = Math.random() * CW; }
    if (d.x > CW + 20) d.x = -20;
    if (d.x < -20) d.x = CW + 20;
  }
}
function drawWeather() {
  if (weatherType === "rain") {
    ctx.strokeStyle = "rgba(150,180,220,0.3)"; ctx.lineWidth = 1;
    for (const d of weatherDrops) {
      ctx.beginPath(); ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + wind * 0.01, d.y + d.size); ctx.stroke();
    }
  } else if (weatherType === "snow") {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (const d of weatherDrops) {
      ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2); ctx.fill();
    }
  }
}

/* ============================================================
   SKY RENDERING
   ============================================================ */
function drawSky() {
  const dp = phase === "menu" ? 0.3 : roundNumber / Math.max(1, gameSettings.rounds);
  let s1, s2, blend;
  if (dp < 0.15) { s1 = 0; s2 = 1; blend = dp / 0.15; }
  else if (dp < 0.55) { s1 = 1; s2 = 1; blend = 0; }
  else if (dp < 0.75) { s1 = 1; s2 = 2; blend = (dp - 0.55) / 0.2; }
  else { s1 = 2; s2 = 3; blend = Math.min(1, (dp - 0.75) / 0.25); }

  const g = ctx.createLinearGradient(0, 0, 0, CH);
  for (let i = 0; i < SKY_PRESETS[s1].stops.length; i++) {
    const a = SKY_PRESETS[s1].stops[i], b = SKY_PRESETS[s2].stops[i];
    const r = Math.round(a[1] + (b[1] - a[1]) * blend);
    const gv = Math.round(a[2] + (b[2] - a[2]) * blend);
    const bl = Math.round(a[3] + (b[3] - a[3]) * blend);
    g.addColorStop(a[0], `rgb(${r},${gv},${bl})`);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CW, CH);

  const starA = SKY_PRESETS[s1].star + (SKY_PRESETS[s2].star - SKY_PRESETS[s1].star) * blend;
  if (starField && starA > 0.01) {
    ctx.globalAlpha = starA;
    ctx.drawImage(starField, 0, 0);
    ctx.globalAlpha = 1;
  }

  const sunAlpha = Math.max(0, 1 - Math.max(0, dp - 0.65) * 5);
  if (sunAlpha > 0.01) {
    const sunX = CW * 0.82 - dp * CW * 0.3;
    const sunY = 90 + dp * 180;
    ctx.globalAlpha = sunAlpha;
    const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180);
    sg.addColorStop(0, "rgba(255,250,220,0.9)");
    sg.addColorStop(0.05, "rgba(255,240,180,0.6)");
    sg.addColorStop(0.15, "rgba(255,200,100,0.15)");
    sg.addColorStop(0.5, "rgba(255,180,80,0.03)");
    sg.addColorStop(1, "rgba(255,150,50,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(sunX - 180, sunY - 180, 360, 360);
    ctx.fillStyle = "rgba(255,252,235,1)";
    ctx.beginPath(); ctx.arc(sunX, sunY, 14, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  if (dp > 0.7) {
    const moonA = Math.min(1, (dp - 0.7) * 3.3) * 0.8;
    const mx = CW * 0.25, my = 70;
    ctx.globalAlpha = moonA;
    ctx.fillStyle = "#e8e0cc";
    ctx.beginPath(); ctx.arc(mx, my, 16, 0, Math.PI * 2); ctx.fill();
    const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
    mg.addColorStop(0, "rgba(232,224,204,0.2)"); mg.addColorStop(1, "rgba(232,224,204,0)");
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(mx, my, 80, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  const hazeA = 0.12 * Math.max(0, 1 - dp * 0.8);
  if (hazeA > 0.005) {
    const hz = ctx.createLinearGradient(0, CH * 0.6, 0, CH);
    hz.addColorStop(0, "rgba(180,210,230,0)");
    hz.addColorStop(1, `rgba(180,210,230,${hazeA})`);
    ctx.fillStyle = hz;
    ctx.fillRect(0, CH * 0.6, CW, CH * 0.4);
  }
}

function drawMountains() {
  for (const layer of mountainLayers) {
    ctx.drawImage(layer, 0, 0);
  }
}

/* ============================================================
   TERRAIN RENDERING
   ============================================================ */
function drawTerrain() {
  // clip to terrain shape for all sub-draws
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, CH);
  for (let x = 0; x < CW; x++) ctx.lineTo(x, CH - terrain[x]);
  ctx.lineTo(CW, CH);
  ctx.closePath();

  // clip to terrain shape
  ctx.clip();

  // base fill with distinct strata bands
  const g = ctx.createLinearGradient(0, CH - 400, 0, CH);
  g.addColorStop(0,    "#4a8820");  // grass green
  g.addColorStop(0.03, "#3a7218");
  g.addColorStop(0.06, "#5c5528");  // topsoil
  g.addColorStop(0.14, "#6b4c28");  // brown earth
  g.addColorStop(0.30, "#7a5a30");  // clay
  g.addColorStop(0.50, "#5e4228");  // deeper brown
  g.addColorStop(0.70, "#4a3a2a");  // dark earth
  g.addColorStop(0.85, "#3c3530");  // rock transition
  g.addColorStop(1,    "#2a2420");  // bedrock
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CW, CH);

  // noise grain overlay
  if (terrainTexture) { ctx.fillStyle = terrainTexture; ctx.fillRect(0, 0, CW, CH); }

  // pre-rendered detail (pebbles, rocks, strata lines)
  if (terrainDetailCanvas) {
    ctx.drawImage(terrainDetailCanvas, 0, 0);
  }

  ctx.restore();

  // grass surface — thick base + highlight
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#3a6a15";
  ctx.beginPath();
  for (let x = 0; x < CW; x++) {
    if (x === 0) ctx.moveTo(x, CH - terrain[x]); else ctx.lineTo(x, CH - terrain[x]);
  }
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#6cc035";
  ctx.beginPath();
  for (let x = 0; x < CW; x++) {
    if (x === 0) ctx.moveTo(x, CH - terrain[x] - 1); else ctx.lineTo(x, CH - terrain[x] - 1);
  }
  ctx.stroke();

  // grass tufts — two layers (dark behind, bright front) with varied height
  for (let pass = 0; pass < 2; pass++) {
    for (let x = 1 + pass; x < CW - 1; x += 3) {
      const sy = CH - terrain[x];
      const seed = x * 1.37 + pass * 50;
      const h = 4 + Math.sin(seed) * 3 + Math.sin(seed * 2.7) * 2;
      const lean = Math.sin(x * 0.19 + gameTime * 0.7 + pass) * 0.35 + wind * 0.002;
      const green = pass === 0
        ? `rgba(50,${80 + Math.floor(Math.sin(seed)*20)},20,0.45)`
        : `rgba(${80 + Math.floor(Math.sin(seed)*15)},${140 + Math.floor(Math.sin(seed*1.3)*25)},${30+Math.floor(Math.sin(seed)*10)},0.6)`;
      ctx.strokeStyle = green;
      ctx.lineWidth = pass === 0 ? 1.2 : 0.8;
      ctx.beginPath();
      ctx.moveTo(x, sy - 1);
      ctx.quadraticCurveTo(x + lean * h * 0.6, sy - h * 0.6, x + lean * h, sy - h);
      ctx.stroke();
    }
  }
}

/* ============================================================
   WATER (at canvas bottom)
   ============================================================ */
function drawWater() {
  const waterTop = CH - 18;
  const wg = ctx.createLinearGradient(0, waterTop, 0, CH);
  wg.addColorStop(0, "rgba(20,60,120,0.3)");
  wg.addColorStop(0.5, "rgba(15,50,100,0.5)");
  wg.addColorStop(1, "rgba(10,30,60,0.7)");
  ctx.fillStyle = wg;
  ctx.fillRect(0, waterTop, CW, 18);

  ctx.strokeStyle = "rgba(100,180,255,0.15)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    const wy = waterTop + 4 + i * 5;
    for (let x = 0; x < CW; x += 4) {
      const y = wy + Math.sin(x * 0.03 + gameTime * 1.5 + i) * 1.5;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/* ============================================================
   TANK RENDERING
   ============================================================ */
function createTank(id, x, inventory) {
  return { id, x, hp: 100, score: 0, barrelAngle: 45, movesLeft: MOVES_PER_GAME,
    savedAngle: 45, savedPower: 50, savedWeapon: inventory ? inventory[0] : 0,
    usedWeapons: new Set(), inventory: inventory || [] };
}
function tankSurfaceY(tank) { return terrainY(tank.x); }

function drawTank(tank, isActive) {
  const x = tank.x;
  const sy = tankSurfaceY(tank);
  const c = tank.id === 0 ? P1_COLORS : P2_COLORS;
  const dir = tank.id === 0 ? 1 : -1;
  const W = 44, H = 14, TR = 11, BL = 30;

  ctx.save();
  ctx.translate(x, sy);
  const slope = terrainSlope(x);
  ctx.rotate(slope);

  // ground shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 3, W * 0.62, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // ─── TRACK ASSEMBLY (left + right pods) ───
  const trackH = 11, trackW = W + 6, trackY = -trackH / 2;
  // outer track shell
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.roundRect(-trackW / 2, trackY, trackW, trackH, 5);
  ctx.fill();
  // inner track rubber
  ctx.fillStyle = "#2a2a2a";
  ctx.beginPath();
  ctx.roundRect(-trackW / 2 + 2, trackY + 2, trackW - 4, trackH - 4, 3);
  ctx.fill();
  // track tread marks
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let i = -trackW / 2 + 5; i < trackW / 2 - 3; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, trackY + 1);
    ctx.lineTo(i + 1.5, trackY + trackH - 1);
    ctx.stroke();
  }
  // road wheels (large)
  const wCount = 6;
  for (let i = 0; i < wCount; i++) {
    const wx = -trackW / 2 + 6 + i * ((trackW - 12) / (wCount - 1));
    const wy = trackY + trackH / 2;
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(wx, wy, 4.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#222";
    ctx.beginPath(); ctx.arc(wx, wy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#333";
    ctx.beginPath(); ctx.arc(wx, wy, 1.3, 0, Math.PI * 2); ctx.fill();
  }
  // drive sprocket (front) + idler (rear)
  for (const side of [-1, 1]) {
    const sx = side * (trackW / 2 - 2);
    ctx.fillStyle = "#181818";
    ctx.beginPath(); ctx.arc(sx, trackY + trackH / 2, 3.5, 0, Math.PI * 2); ctx.fill();
  }
  // top track guide
  ctx.strokeStyle = "rgba(60,60,60,0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-trackW / 2 + 4, trackY + 1);
  ctx.lineTo(trackW / 2 - 4, trackY + 1);
  ctx.stroke();

  // ─── HULL ───
  const hullTop = -H - 6, hullH = H + 2;
  // main hull body — trapezoid shape (wider at bottom)
  ctx.beginPath();
  ctx.moveTo(-W / 2 + 4, -4);           // bottom-left
  ctx.lineTo(-W / 2 + 8, hullTop);      // top-left (narrower)
  ctx.lineTo(W / 2 - 8, hullTop);       // top-right
  ctx.lineTo(W / 2 - 4, -4);            // bottom-right
  ctx.closePath();
  const hullG = ctx.createLinearGradient(0, hullTop, 0, -2);
  hullG.addColorStop(0, c.light);
  hullG.addColorStop(0.35, c.body);
  hullG.addColorStop(0.75, c.dark);
  hullG.addColorStop(1, c.dark);
  ctx.fillStyle = hullG;
  ctx.fill();
  // hull edge highlight
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // armor panel lines
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(-W / 2 + 12, hullTop + 2);
  ctx.lineTo(-W / 2 + 10, -5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2 - 12, hullTop + 2);
  ctx.lineTo(W / 2 - 10, -5);
  ctx.stroke();

  // front glacis plate highlight
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.moveTo(dir * W / 2 - dir * 4, -4);
  ctx.lineTo(dir * W / 2 - dir * 8, hullTop);
  ctx.lineTo(dir * W / 2 - dir * 14, hullTop);
  ctx.lineTo(dir * W / 2 - dir * 10, -4);
  ctx.closePath();
  ctx.fill();

  // reactive armor blocks on hull sides
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let i = 0; i < 3; i++) {
    const bx = -W / 2 + 13 + i * 9;
    ctx.fillRect(bx, hullTop + 3, 6, 4);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, hullTop + 3, 6, 4);
  }

  // exhaust on rear
  ctx.fillStyle = "rgba(40,35,30,0.7)";
  ctx.beginPath();
  ctx.roundRect(dir * (-W / 2 + 5), hullTop + 2, dir * 4, 5, 1);
  ctx.fill();

  // ─── TURRET ───
  const turretCy = hullTop - 2;
  // turret base (wider ellipse)
  const turBasG = ctx.createRadialGradient(-dir * 2, turretCy + 2, 0, 0, turretCy + 1, TR + 4);
  turBasG.addColorStop(0, c.light);
  turBasG.addColorStop(0.6, c.body);
  turBasG.addColorStop(1, c.dark);
  ctx.fillStyle = turBasG;
  ctx.beginPath();
  ctx.ellipse(0, turretCy + 1, TR + 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // turret dome
  const turG = ctx.createRadialGradient(-dir * 2, turretCy - 4, 1, 0, turretCy, TR + 1);
  turG.addColorStop(0, c.light);
  turG.addColorStop(0.45, c.mid);
  turG.addColorStop(1, c.dark);
  ctx.fillStyle = turG;
  ctx.beginPath();
  ctx.arc(0, turretCy, TR, Math.PI, 0);
  ctx.fill();
  // turret rim
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, turretCy, TR, Math.PI, 0);
  ctx.stroke();
  // specular highlight on dome
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(-dir * 2, turretCy - 5, 4, 2.5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // commander's hatch
  ctx.fillStyle = c.dark;
  ctx.beginPath();
  ctx.ellipse(dir * -4, turretCy - 1, 3.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.ellipse(dir * -4, turretCy - 1, 3.5, 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // ─── BARREL ───
  const drawAng = isActive ? angle : tank.barrelAngle;
  const ang = drawAng * Math.PI / 180;
  ctx.save();
  ctx.translate(0, turretCy);
  ctx.rotate(-ang * dir - slope);
  // barrel shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.roundRect(dir > 0 ? 2 : -BL - 2, -2.5, BL, 7, 2);
  ctx.fill();
  // barrel body gradient
  const bG = ctx.createLinearGradient(0, -4, 0, 4);
  bG.addColorStop(0, c.mid);
  bG.addColorStop(0.3, c.dark);
  bG.addColorStop(0.7, "#111");
  bG.addColorStop(1, c.dark);
  ctx.fillStyle = bG;
  ctx.beginPath();
  ctx.roundRect(dir > 0 ? 0 : -BL, -3.5, BL, 7, 2);
  ctx.fill();
  // barrel highlight
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(dir > 0 ? 2 : -BL + 2, -3.5, BL - 4, 2);
  // muzzle brake
  const mEnd = dir > 0 ? BL : -BL;
  ctx.fillStyle = c.dark;
  ctx.beginPath();
  ctx.roundRect(mEnd - dir * 5, -5, dir * 6, 10, 1.5);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(mEnd - dir * 4, -4, dir * 1, 8);
  ctx.strokeRect(mEnd - dir * 2, -4, dir * 1, 8);
  ctx.restore();

  // ─── ANTENNA ───
  ctx.strokeStyle = "rgba(200,200,200,0.4)";
  ctx.lineWidth = 0.8;
  const antX = dir * -8;
  ctx.beginPath();
  ctx.moveTo(antX, turretCy - 2);
  ctx.quadraticCurveTo(antX - dir * 2, turretCy - 16, antX - dir * 1, turretCy - 24);
  ctx.stroke();
  ctx.fillStyle = c.light;
  ctx.beginPath();
  ctx.arc(antX - dir * 1, turretCy - 24, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // ─── ACTIVE INDICATOR ───
  if (isActive && phase === "aiming") {
    const pulse = 0.25 + 0.2 * Math.sin(gameTime * 4);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = pulse;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(0, -H / 2, W * 0.65, H * 1.8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  // damage smoke
  if (tank.hp < 40 && phase !== "menu") {
    if (Math.random() < (tank.hp < 20 ? 0.015 : 0.005)) {
      smokeParticles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: sy + hullTop - 5,
        vx: (Math.random() - 0.5) * 8,
        vy: -15 - Math.random() * 25,
        size: 3 + Math.random() * 6,
        life: 0.8 + Math.random() * 0.8,
        elapsed: 0,
      });
    }
  }

  ctx.restore();
}

/* ============================================================
   AIM CROSSHAIR
   ============================================================ */
function barrelTip(tank, ang, dir) {
  const sy = tankSurfaceY(tank);
  const slope = terrainSlope(tank.x);
  const cosS = Math.cos(slope), sinS = Math.sin(slope);
  const localTY = -14 - 6 - 2;
  const BL = 30;
  const turretX = tank.x - localTY * sinS;
  const turretY = sy + localTY * cosS;
  const tipDx = dir * BL * Math.cos(ang);
  const tipDy = -BL * Math.sin(ang);
  return {
    x: turretX + tipDx,
    y: turretY + tipDy,
    cosS, sinS
  };
}

function drawAimGuide() {
  if (phase !== "aiming") return;
  const tank = tanks[currentPlayer];
  const dir = tank.id === 0 ? 1 : -1;
  const ang = angle * Math.PI / 180;
  const tip = barrelTip(tank, ang, dir);
  const dist = 55 + power * 0.65;
  const cx = tip.x + dir * dist * Math.cos(ang);
  const cy = tip.y - dist * Math.sin(ang);

  const size = 8;
  const pulse = 0.4 + 0.3 * Math.sin(gameTime * 5);
  ctx.save();
  ctx.strokeStyle = `rgba(255,80,80,${pulse})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - size, cy); ctx.lineTo(cx + size, cy);
  ctx.moveTo(cx, cy - size); ctx.lineTo(cx, cy + size);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.55, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/* ============================================================
   WIND ARROW
   ============================================================ */
function drawWindArrow() {
  if (Math.abs(wind) < 1) return;
  const cx = CW / 2, cy = 24;
  const len = Math.min(Math.abs(wind) * 0.9, 55);
  const d = Math.sign(wind);
  ctx.save();
  ctx.strokeStyle = "rgba(255,209,102,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - len * d, cy);
  ctx.lineTo(cx + len * d, cy);
  ctx.lineTo(cx + len * d - 8 * d, cy - 5);
  ctx.moveTo(cx + len * d, cy);
  ctx.lineTo(cx + len * d - 8 * d, cy + 5);
  ctx.stroke();
  ctx.restore();
}

/* ============================================================
   PROJECTILE
   ============================================================ */
function createProjectile(ox, oy, vx, vy, weapon) {
  return { x: ox, y: oy, vx, vy, weapon, trail: [], alive: true };
}

function fireProjectile() {
  if (phase !== "aiming") return;
  const tank = tanks[currentPlayer];
  tank.barrelAngle = angle;
  const w = WEAPONS[selectedWeapon];
  tank.usedWeapons.add(selectedWeapon);
  const dir = tank.id === 0 ? 1 : -1;
  const ang = angle * Math.PI / 180;
  const tip = barrelTip(tank, ang, dir);
  const sx = tip.x;
  const sy = tip.y;
  const spd = power * VEL_SCALE * w.speed;

  for (let i = 0; i < 8; i++) {
    const a = ang + (Math.random() - 0.5) * 0.5;
    const s = 50 + Math.random() * 100;
    particles.push({
      x: sx, y: sy,
      vx: dir * Math.cos(a) * s, vy: -Math.sin(a) * s - 20,
      life: 0.1 + Math.random() * 0.15, elapsed: 0,
      size: 2 + Math.random() * 3,
      color: "#fff8cc"
    });
  }

  if (w.count > 1) {
    const spr = (w.spread || 5) * Math.PI / 180;
    for (let i = 0; i < w.count; i++) {
      const a = ang + (i - (w.count - 1) / 2) * spr;
      const p = createProjectile(sx, sy, dir * spd * Math.cos(a), -spd * Math.sin(a), w);
      if (w.bounce) p.bouncesLeft = w.bounce;
      if (w.homing) p.homing = true;
      if (w.roller) p.roller = true;
      if (w.napalm) p.napalm = true;
      projectiles.push(p);
    }
  } else {
    const p = createProjectile(sx, sy, dir * spd * Math.cos(ang), -spd * Math.sin(ang), w);
    if (w.bounce) p.bouncesLeft = w.bounce;
    if (w.homing) p.homing = true;
    if (w.splitAbove) { p.splitAbove = true; p.splitCount = w.splitCount; }
    if (w.roller) p.roller = true;
    if (w.napalm) p.napalm = true;
    projectiles.push(p);
  }
  phase = "firing";
  fireBtn.disabled = true;
  playSound("fire");
  buildWeaponSelect();
}

function updateProjectiles(dt) {
  const newProjectiles = [];

  for (const p of projectiles) {
    if (!p.alive) continue;

    if (p.homing && p.vy > 0) {
      const enemy = tanks[1 - currentPlayer];
      const dx = enemy.x - p.x;
      const steer = Math.sign(dx) * 120;
      p.vx += steer * dt;
    }

    if (p.roller) {
      const tsy = terrainY(p.x);
      if (p.y >= tsy - 2) {
        p.y = tsy - 2;
        p.vy = 0;
        const slope = terrainSlope(p.x);
        p.vx += Math.sin(slope) * 300 * dt;
        p.vx *= 0.98;
        p.rollerTime = (p.rollerTime || 0) + dt;
        if (p.rollerTime > 2.5 || Math.abs(p.vx) < 5) {
          p.alive = false;
          triggerExplosion(p.x, tsy, p.weapon);
          continue;
        }
      } else {
        p.vy += GRAVITY * gameSettings.gravity * dt;
      }
      p.vx += wind * dt * 0.3;
    } else {
      p.vx += wind * dt;
      p.vy += GRAVITY * gameSettings.gravity * dt;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.trail.push({ x: p.x, y: p.y, t: gameTime });
    if (p.trail.length > 35) p.trail.shift();

    if (Math.random() < 0.5) {
      smokeParticles.push({
        x: p.x + (Math.random() - 0.5) * 3,
        y: p.y + (Math.random() - 0.5) * 3,
        vx: (Math.random() - 0.5) * 10,
        vy: -5 - Math.random() * 10,
        size: 2 + Math.random() * 3,
        life: 0.4 + Math.random() * 0.4,
        elapsed: 0,
      });
    }

    if (!isFinite(p.x) || !isFinite(p.y)) { p.alive = false; continue; }
    if (p.x < -50 || p.x > CW + 50 || p.y > CH + 50) { p.alive = false; continue; }
    if (p.y < -800) continue;

    if (p.splitAbove && p.vy > 0 && p.y < terrainY(p.x) - 80) {
      p.alive = false;
      for (let i = 0; i < p.splitCount; i++) {
        const sa = Math.PI + (Math.random() - 0.5) * 1.6;
        const ss = 60 + Math.random() * 120;
        const sp = createProjectile(p.x, p.y,
          Math.cos(sa) * ss + p.vx * 0.3, Math.sin(sa) * ss + Math.abs(p.vy) * 0.2, p.weapon);
        newProjectiles.push(sp);
      }
      continue;
    }

    if (p.roller) continue;

    const tsy = terrainY(p.x);
    let hitTank = null;
    for (const t of tanks) {
      const ty = tankSurfaceY(t) - 8;
      if (Math.abs(p.x - t.x) < 20 && Math.abs(p.y - ty) < 16) { hitTank = t; break; }
    }

    if (hitTank || p.y >= tsy) {
      if (!hitTank && p.bouncesLeft > 0) {
        p.bouncesLeft--;
        p.y = tsy - 1;
        p.vy = -Math.abs(p.vy) * 0.6;
        p.vx *= 0.85;
        continue;
      }
      p.alive = false;
      const hy = hitTank ? p.y : tsy;
      triggerExplosion(p.x, hy, p.weapon);

      if (p.weapon.chain) {
        const cs = p.weapon.chainSpread || 20;
        for (let c = 1; c <= p.weapon.chain; c++) {
          setTimeout(() => {
            const cx = p.x + (c % 2 === 0 ? 1 : -1) * Math.ceil(c / 2) * cs;
            const cy = terrainY(cx);
            triggerExplosion(cx, cy, p.weapon);
          }, c * 80);
        }
      }

      if (p.napalm) {
        for (let i = 0; i < 6; i++) {
          const na = -Math.PI * Math.random();
          const ns = 60 + Math.random() * 100;
          const np = createProjectile(p.x, hy,
            Math.cos(na) * ns, Math.sin(na) * ns - 40,
            { radius: 12, damage: 6, color: "#ff4400", speed: 1, count: 1 });
          newProjectiles.push(np);
        }
      }
    }
  }

  for (const np of newProjectiles) projectiles.push(np);

  if (phase === "firing" && projectiles.every(p => !p.alive)) {
    projectiles = [];
    phase = "exploding";
  }
}

function drawProjectiles() {
  for (const p of projectiles) {
    if (!p.alive || !isFinite(p.x) || !isFinite(p.y)) continue;
    for (let i = 0; i < p.trail.length; i++) {
      const pt = p.trail[i];
      if (!isFinite(pt.x) || !isFinite(pt.y)) continue;
      const a = (i / p.trail.length) * 0.4;
      const r = 1 + (i / p.trail.length) * 1.5;
      ctx.fillStyle = `rgba(255,200,120,${a})`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
    pg.addColorStop(0, "rgba(255,240,200,0.4)");
    pg.addColorStop(1, "rgba(255,200,100,0)");
    ctx.fillStyle = pg;
    ctx.fillRect(p.x - 12, p.y - 12, 24, 24);
    ctx.fillStyle = p.weapon.color;
    ctx.shadowColor = p.weapon.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

/* ============================================================
   EXPLOSIONS & PARTICLES
   ============================================================ */
function triggerExplosion(x, y, weapon) {
  const isNuke = weapon.nuke;
  explosions.push({
    x, y, maxR: weapon.radius, r: 0, alpha: 1,
    timer: 0, duration: isNuke ? 0.9 : 0.5, phase: 0, nuke: isNuke
  });

  destroyTerrain(x, y, weapon.radius);
  applyDamage(x, y, weapon);

  shakeIntensity = isNuke ? 30 : Math.min(weapon.radius * 0.3, 18);
  shakeTimer = isNuke ? 0.7 : 0.3;
  playSound("explode");

  // fire particles
  const count = 25 + weapon.radius * 0.8;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 30 + Math.random() * 200;
    const colors = ["#ff6b35","#ffd166","#ff4444","#ffaa00","#ffe0a0","#fff"];
    particles.push({
      x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 80,
      life: 0.2 + Math.random() * 0.7, elapsed: 0,
      size: 1.5 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  // dirt chunks
  for (let i = 0; i < weapon.radius * 0.5; i++) {
    const a = -Math.PI * Math.random();
    const spd = 40 + Math.random() * 140;
    const browns = ["#8b6914","#6b4226","#a08050","#5c3a1e","#7a6030"];
    particles.push({
      x: x + (Math.random() - 0.5) * weapon.radius * 0.5, y,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 50,
      life: 0.5 + Math.random() * 0.8, elapsed: 0,
      size: 2 + Math.random() * 5,
      color: browns[Math.floor(Math.random() * browns.length)]
    });
  }

  // lingering smoke
  for (let i = 0; i < 12 + weapon.radius * 0.3; i++) {
    smokeParticles.push({
      x: x + (Math.random() - 0.5) * weapon.radius,
      y: y + (Math.random() - 0.5) * weapon.radius * 0.5,
      vx: (Math.random() - 0.5) * 20,
      vy: -10 - Math.random() * 30,
      size: 6 + Math.random() * 12,
      life: 1.5 + Math.random() * 2,
      elapsed: 0,
    });
  }

  // shockwave ring
  explosions.push({
    x, y, maxR: weapon.radius * 2.5, r: weapon.radius * 0.5, alpha: 0.5,
    timer: 0, duration: 0.4, phase: 1
  });
}

let terrainDirty = false;
function destroyTerrain(cx, cy, radius) {
  for (let x = Math.max(0, Math.floor(cx - radius)); x < Math.min(CW, Math.ceil(cx + radius)); x++) {
    const dx = x - cx;
    const half = Math.sqrt(Math.max(0, radius * radius - dx * dx));
    const bottomCircle = cy + half;
    const surfaceY = CH - terrain[x];
    if (surfaceY < bottomCircle) {
      terrain[x] = Math.max(0, CH - bottomCircle);
    }
  }
  terrainDirty = true;
}
function flushTerrainDetail() {
  if (terrainDirty) { buildTerrainDetailLayer(); terrainDirty = false; }
}

function applyDamage(ex, ey, weapon) {
  for (const t of tanks) {
    const tx = t.x, ty = tankSurfaceY(t) - 8;
    const dist = Math.sqrt((ex - tx) ** 2 + (ey - ty) ** 2);
    let dmg = 0;
    if (dist <= weapon.radius) dmg = weapon.damage;
    else if (dist <= weapon.radius * 2.5)
      dmg = Math.round(weapon.damage * (1 - (dist - weapon.radius) / (weapon.radius * 1.5)));
    if (dmg > 0) {
      t.hp = Math.max(0, t.hp - dmg);
      const shooter = tanks[currentPlayer];
      if (t.id !== shooter.id) {
        shooter.score += dmg;
        floatingTexts.push({
          x: tx, y: ty - 25, text: `+${dmg}`,
          color: shooter.id === 0 ? "255,107,107" : "78,205,196",
          elapsed: 0, life: 1.8
        });
      }
      updateHUD();
    }
  }
}

function updateExplosions(dt) {
  for (const e of explosions) {
    e.timer += dt;
    const t = e.timer / e.duration;
    if (e.phase === 0) {
      e.r = e.maxR * Math.min(1, t * 2.5);
      e.alpha = Math.max(0, 1 - t);
    } else {
      e.r = e.maxR * Math.min(1, t);
      e.alpha = Math.max(0, 0.5 - t * 1.2);
    }
  }
  explosions = explosions.filter(e => e.timer < e.duration);
}

function drawExplosions() {
  for (const e of explosions) {
    if (!isFinite(e.x) || !isFinite(e.y) || !isFinite(e.r) || e.r <= 0) continue;
    if (e.phase === 0) {
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
      g.addColorStop(0, `rgba(255,255,220,${e.alpha})`);
      g.addColorStop(0.3, `rgba(255,180,50,${e.alpha * 0.8})`);
      g.addColorStop(0.6, `rgba(255,80,20,${e.alpha * 0.4})`);
      g.addColorStop(1, `rgba(200,40,10,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = `rgba(255,200,120,${e.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function updateParticles(dt) {
  for (const p of particles) {
    p.elapsed += dt;
    p.vy += 180 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
  particles = particles.filter(p => p.elapsed < p.life);
}

function drawParticles() {
  for (const p of particles) {
    const a = Math.max(0, 1 - p.elapsed / p.life);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (0.3 + a * 0.7), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function updateSmoke(dt) {
  for (const s of smokeParticles) {
    s.elapsed += dt;
    s.vy -= 8 * dt;
    s.vx *= 0.98;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.size += 4 * dt;
  }
  smokeParticles = smokeParticles.filter(s => s.elapsed < s.life);
}

function drawSmoke() {
  for (const s of smokeParticles) {
    const a = Math.max(0, 1 - s.elapsed / s.life) * 0.25;
    ctx.globalAlpha = a;
    ctx.fillStyle = "#888";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function updateFloatingTexts(dt) {
  for (const f of floatingTexts) {
    f.elapsed += dt;
    f.y -= 25 * dt;
  }
  floatingTexts = floatingTexts.filter(f => f.elapsed < f.life);
}

function drawFloatingTexts() {
  for (const f of floatingTexts) {
    const a = Math.max(0, 1 - f.elapsed / f.life);
    const scale = Math.min(1, f.elapsed * 8);
    ctx.save();
    ctx.font = `900 ${Math.round(18 * scale)}px 'Orbitron', sans-serif`;
    ctx.textAlign = "center";
    ctx.strokeStyle = `rgba(0,0,0,${a * 0.6})`;
    ctx.lineWidth = 3;
    ctx.strokeText(f.text, f.x, f.y);
    ctx.fillStyle = `rgba(${f.color},${a})`;
    ctx.fillText(f.text, f.x, f.y);
    ctx.restore();
  }
}

/* ============================================================
   VIGNETTE
   ============================================================ */
function drawVignette() {
  const g = ctx.createRadialGradient(CW / 2, CH / 2, CW * 0.3, CW / 2, CH / 2, CW * 0.75);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CW, CH);
}

/* ============================================================
   SETTLING
   ============================================================ */
function settleTanks(dt) {
  settleTimer += dt;
  if (settleTimer > 0.6) {
    shotsThisRound++;
    if (shotsThisRound >= 2) {
      shotsThisRound = 0;
      roundNumber++;
      if (roundNumber >= gameSettings.rounds) {
        phase = "gameover"; showGameOver(); return;
      }
    }
    switchTurn();
  }
}

/* ============================================================
   TURN MANAGEMENT
   ============================================================ */
function switchTurn() {
  const prev = tanks[currentPlayer];
  prev.savedAngle = angle;
  prev.savedPower = power;
  prev.savedWeapon = selectedWeapon;

  currentPlayer = 1 - currentPlayer;
  const next = tanks[currentPlayer];
  angle = next.savedAngle;
  power = next.savedPower;
  selectedWeapon = next.usedWeapons.has(next.savedWeapon)
    ? (next.inventory.find(i => !next.usedWeapons.has(i)) ?? next.inventory[0] ?? 0)
    : next.savedWeapon;
  moveAnim = null;
  wind = (Math.random() - 0.5) * 70;
  buildWeaponSelect();
  updateHUD();
  showBanner(playerNames[currentPlayer], currentPlayer === 0 ? "#ff6b6b" : "#4ecdc4");
  phase = "aiming";
  fireBtn.disabled = false;
  if (vsCPU && currentPlayer === 1) { fireBtn.disabled = true; aiDelay = 1.2; }
}

function showBanner(text, color) {
  turnBanner.textContent = text;
  turnBanner.style.color = color;
  turnBanner.classList.add("show");
  bannerTimer = 1.3;
}

/* ============================================================
   AI
   ============================================================ */
function scoreWeaponForAI(wi, personality) {
  const w = WEAPONS[wi];
  switch (personality) {
    case "sniper": return w.damage * (w.count === 1 ? 2 : 0.3) * w.speed;
    case "aggressive": return w.radius * w.count + w.damage * 0.3;
    case "heavy": return w.damage * w.radius * 0.05 + (w.nuke ? 50 : 0);
    case "chaotic": return Math.random() * 100;
    case "balanced": return w.damage * 0.5 + w.radius * 0.3 + (w.count > 1 ? 10 : 0);
    case "tactical": return w.damage > 10 ? w.damage + w.radius * 0.2 : 1;
    case "expert": return w.damage * 0.8 + w.radius * 0.4 + (w.homing ? 20 : 0) + (w.nuke ? 30 : 0);
    default: return Math.random() * 100;
  }
}

function aiThink() {
  const ai = tanks[1], target = tanks[0];
  const available = [];
  for (const wi of ai.inventory) { if (!ai.usedWeapons.has(wi)) available.push(wi); }
  if (available.length === 0) { selectedWeapon = ai.inventory[0] || 0; }
  else if (campaignMode) {
    const pers = CAMPAIGN_OPPONENTS[campaignLevel].personality;
    let bestWi = available[0], bestS = -1;
    for (const wi of available) {
      const s = scoreWeaponForAI(wi, pers);
      if (s > bestS) { bestS = s; bestWi = wi; }
    }
    selectedWeapon = bestWi;
  } else {
    selectedWeapon = available[Math.floor(Math.random() * available.length)];
  }
  buildWeaponSelect();
  let bestAngle = 45, bestPower = 50, bestDist = Infinity;
  for (let ta = 20; ta <= 80; ta += 3) {
    for (let tp = 20; tp <= 100; tp += 4) {
      const a = ta * Math.PI / 180;
      const spd = tp * VEL_SCALE * WEAPONS[selectedWeapon].speed;
      let px = ai.x, py = terrainY(ai.x) - 14;
      let pvx = -spd * Math.cos(a), pvy = -spd * Math.sin(a);
      const sdt = 0.04;
      for (let i = 0; i < 200; i++) {
        pvx += wind * sdt; pvy += GRAVITY * gameSettings.gravity * sdt;
        px += pvx * sdt; py += pvy * sdt;
        if (px < 0 || px >= CW || py > CH) break;
        if (py >= terrainY(px)) {
          const d = Math.sqrt((px - target.x) ** 2 + (py - terrainY(target.x)) ** 2);
          if (d < bestDist) { bestDist = d; bestAngle = ta; bestPower = tp; }
          break;
        }
      }
    }
  }
  const scatter = campaignMode ? (1 - CAMPAIGN_OPPONENTS[campaignLevel].accuracy) * 30 : 14;
  angle = ((Math.round(bestAngle + (Math.random() - 0.5) * scatter) % 360) + 360) % 360;
  power = Math.round(Math.max(10, Math.min(100, bestPower + (Math.random() - 0.5) * scatter)));
  updateHUD();
  fireProjectile();
}

/* ============================================================
   HUD
   ============================================================ */
function updateHUD() {
  angVal.textContent = Math.round(angle);
  powVal.textContent = Math.round(power);
  if (tanks.length >= 2) {
    p1Score.textContent = tanks[0].score;
    p2Score.textContent = tanks[1].score;
    roundLabel.textContent = `RD ${Math.min(roundNumber + 1, gameSettings.rounds)}/${gameSettings.rounds}`;
    const t = tanks[currentPlayer];
    moveCounter.textContent = t.movesLeft;
    moveCounter.style.color = t.movesLeft > 0 ? "" : "rgba(255,80,80,0.5)";
    const canMove = t.movesLeft > 0 && !moveAnim;
    moveLeftBtn.disabled = !canMove;
    moveRightBtn.disabled = !canMove;
  }
  windVal.textContent = Math.abs(wind) < 2 ? "Calm"
    : `${wind > 0 ? "→" : "←"} ${Math.abs(wind).toFixed(0)}`;
}

function buildWeaponSelect() {
  const sel = $("weapon-select");
  sel.innerHTML = "";
  const tank = tanks.length ? tanks[currentPlayer] : null;
  const inv = tank ? tank.inventory : [];
  const used = tank ? tank.usedWeapons : new Set();
  inv.forEach(wi => {
    const w = WEAPONS[wi];
    const opt = document.createElement("option");
    opt.value = wi;
    opt.textContent = used.has(wi) ? `✗ ${w.name}` : w.name;
    opt.disabled = used.has(wi);
    if (wi === selectedWeapon) opt.selected = true;
    sel.appendChild(opt);
  });
  if (!inv.includes(selectedWeapon) || used.has(selectedWeapon)) {
    for (const wi of inv) {
      if (!used.has(wi)) { selectedWeapon = wi; sel.value = wi; break; }
    }
  }
}

/* ============================================================
   GAME OVER
   ============================================================ */
function showGameOver() {
  const s0 = tanks[0].score, s1 = tanks[1].score;
  let wLabel, wColor;
  if (s0 === s1) {
    wLabel = "IT'S A TIE!";
    wColor = "var(--accent)";
  } else {
    const winner = s0 > s1 ? 0 : 1;
    wLabel = `${playerNames[winner]} WINS!`;
    wColor = winner === 0 ? "#ff6b6b" : "#4ecdc4";
  }
  $("winner-text").textContent = wLabel;
  $("winner-text").style.color = wColor;
  $("score-line").textContent = "";
  const nextBtn = $("campaign-next-btn");
  if (campaignMode) {
    const won = s0 > s1;
    if (won && campaignLevel < CAMPAIGN_OPPONENTS.length - 1) {
      nextBtn.textContent = "NEXT ▶"; nextBtn.style.display = "";
    } else if (won) {
      $("winner-text").textContent = "CAMPAIGN COMPLETE!";
      $("winner-text").style.color = "var(--accent)";
      nextBtn.textContent = "MENU"; nextBtn.style.display = "";
    } else {
      nextBtn.textContent = "RETRY ↻"; nextBtn.style.display = "";
    }
  } else {
    nextBtn.style.display = "none";
  }
  goOverlay.style.display = "flex";
}

/* ============================================================
   INPUT
   ============================================================ */
const keys = {};
document.addEventListener("keydown", e => {
  if (e.repeat) return;
  keys[e.key] = true;
  if (phase === "aiming" && !(vsCPU && currentPlayer === 1)) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); fireProjectile(); }
    if (e.key === "q" || e.key === "Q") cycleWeapon(-1);
    if (e.key === "e" || e.key === "E") cycleWeapon(1);
    if (e.key === "a" || e.key === "A") triggerMove(-1);
    if (e.key === "d" || e.key === "D") triggerMove(1);
  }
});
document.addEventListener("keyup", e => { keys[e.key] = false; });

function handleInput(dt) {
  if (phase !== "aiming" || (vsCPU && currentPlayer === 1)) return;
  if (keys["ArrowLeft"])  angle -= 60 * dt;
  if (keys["ArrowRight"]) angle += 60 * dt;
  if (keys["ArrowUp"])    power = Math.min(100, power + 70 * dt);
  if (keys["ArrowDown"])  power = Math.max(5, power - 70 * dt);
  angle = ((Math.round(angle) % 360) + 360) % 360;
  power = Math.round(power);
  updateHUD();
}

function triggerMove(dir) {
  if (phase !== "aiming" || moveAnim) return;
  const t = tanks[currentPlayer];
  if (t.movesLeft <= 0) return;
  t.movesLeft--;
  const targetX = Math.max(25, Math.min(CW - 25, t.x + dir * MOVE_DIST));
  moveAnim = { tankIdx: currentPlayer, targetX, dir };
  phase = "moving";
  fireBtn.disabled = true;
  moveLeftBtn.disabled = true;
  moveRightBtn.disabled = true;
  updateHUD();
}

function updateMoveAnim(dt) {
  if (!moveAnim) return;
  const t = tanks[moveAnim.tankIdx];
  const step = MOVE_SPEED * dt * moveAnim.dir;
  t.x += step;
  const reached = moveAnim.dir > 0
    ? t.x >= moveAnim.targetX
    : t.x <= moveAnim.targetX;
  if (reached) {
    t.x = moveAnim.targetX;
    moveAnim = null;
    phase = "aiming";
    fireBtn.disabled = false;
    updateHUD();
  }
}

function setupRepeatBtn(el, action) {
  let iv = null;
  const start = () => { action(); iv = setInterval(action, 70); };
  const stop = () => { clearInterval(iv); iv = null; };
  el.addEventListener("mousedown", start);
  el.addEventListener("mouseup", stop);
  el.addEventListener("mouseleave", stop);
  el.addEventListener("touchstart", e => { e.preventDefault(); start(); });
  el.addEventListener("touchend", stop);
  el.addEventListener("touchcancel", stop);
}
setupRepeatBtn($("ang-dn"), () => { if (phase==="aiming") { angle=((angle-2)%360+360)%360; updateHUD(); }});
setupRepeatBtn($("ang-up"), () => { if (phase==="aiming") { angle=((angle+2)%360+360)%360; updateHUD(); }});
setupRepeatBtn($("pow-dn"), () => { if (phase==="aiming") { power=Math.max(5,power-2); updateHUD(); }});
setupRepeatBtn($("pow-up"), () => { if (phase==="aiming") { power=Math.min(100,power+2); updateHUD(); }});
moveLeftBtn.addEventListener("click", () => triggerMove(-1));
moveRightBtn.addEventListener("click", () => triggerMove(1));
fireBtn.addEventListener("click", () => fireProjectile());

weaponSelect.addEventListener("change", () => {
  selectedWeapon = +weaponSelect.value;
});

function cycleWeapon(dir) {
  const tank = tanks.length ? tanks[currentPlayer] : null;
  if (!tank) return;
  const inv = tank.inventory;
  const used = tank.usedWeapons;
  let idx = inv.indexOf(selectedWeapon);
  if (idx < 0) idx = 0;
  for (let n = 0; n < inv.length; n++) {
    idx = (idx + dir + inv.length) % inv.length;
    if (!used.has(inv[idx])) { selectedWeapon = inv[idx]; buildWeaponSelect(); return; }
  }
}

/* ============================================================
   MODE / START / RESTART
   ============================================================ */
function showNameScreen(cpu) {
  vsCPU = cpu;
  modeOverlay.style.display = "none";
  $("name-screen-title").textContent = cpu ? "YOU  VS  CPU" : "PLAYER  VS  PLAYER";
  $("p2-name-input").style.display = cpu ? "none" : "";
  $("p2-fixed-label").style.display = cpu ? "block" : "none";
  if (!cpu) $("p2-name-input").placeholder = "Player 2";
  nameOverlay.style.display = "flex";
  $("p1-name-input").focus();
}

function showCampaignScreen() {
  modeOverlay.style.display = "none";
  const opp = CAMPAIGN_OPPONENTS[campaignLevel];
  $("campaign-level").textContent = `LEVEL ${campaignLevel + 1}`;
  $("campaign-opp-name").textContent = opp.name;
  $("campaign-opp-name").style.color = opp.color;
  $("campaign-opp-title").textContent = opp.title;
  $("campaign-opp-desc").textContent = opp.desc;
  const filled = Math.round((campaignLevel + 1) / CAMPAIGN_OPPONENTS.length * 5);
  $("campaign-diff").textContent = "●".repeat(filled) + "○".repeat(5 - filled);
  campaignOverlay.style.display = "flex";
}

/* ── DRAFT ── */
function initDraft() {
  const perPlayer = gameSettings.rounds;
  const poolSize = Math.min(perPlayer * 2, WEAPONS.length);
  const indices = Array.from({length: WEAPONS.length}, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  draftPool = indices.slice(0, poolSize);
  draftPicks = [[], []];
  draftTurn = 0;
  $("draft-p1-name").textContent = playerNames[0];
  $("draft-p2-name").textContent = playerNames[1];
  renderDraftGrid();
  updateDraftUI();
  draftOverlay.style.display = "flex";
  if (vsCPU && draftTurn === 1) setTimeout(cpuDraftPick, 600);
}

function renderDraftGrid() {
  const grid = $("draft-grid");
  grid.innerHTML = "";
  draftPool.forEach((wi, poolIdx) => {
    const w = WEAPONS[wi];
    const card = document.createElement("div");
    card.className = "draft-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `<span class="draft-card-dot" style="background:${w.color}"></span><div class="draft-card-name">${w.name}</div><div class="draft-card-stats">DMG ${w.damage} · R ${w.radius}</div>`;
    card.addEventListener("click", () => {
      if (vsCPU && draftTurn === 1) return;
      pickFromPool(poolIdx);
    });
    grid.appendChild(card);
  });
}

function pickFromPool(poolIdx) {
  const card = $("draft-grid").children[poolIdx];
  if (card.classList.contains("picked")) return;
  const wi = draftPool[poolIdx];
  draftPicks[draftTurn].push(wi);
  card.classList.add("picked", draftTurn === 0 ? "picked-p1" : "picked-p2");
  const perPlayer = gameSettings.rounds;
  if (draftPicks[0].length >= perPlayer && draftPicks[1].length >= perPlayer) {
    setTimeout(finishDraft, 350);
    return;
  }
  if (draftPicks[1 - draftTurn].length < perPlayer) draftTurn = 1 - draftTurn;
  updateDraftUI();
  if (vsCPU && draftTurn === 1) setTimeout(cpuDraftPick, 450);
}

function cpuDraftPick() {
  const perPlayer = gameSettings.rounds;
  if (draftPicks[1].length >= perPlayer) return;
  const available = [];
  draftPool.forEach((wi, idx) => {
    if (!$("draft-grid").children[idx].classList.contains("picked")) available.push(idx);
  });
  if (!available.length) return;
  const pers = campaignMode ? CAMPAIGN_OPPONENTS[campaignLevel].personality : "balanced";
  let bestIdx = available[0], bestS = -1;
  for (const pi of available) {
    const s = scoreWeaponForAI(draftPool[pi], pers);
    if (s > bestS) { bestS = s; bestIdx = pi; }
  }
  pickFromPool(bestIdx);
}

function updateDraftUI() {
  const pp = gameSettings.rounds;
  $("draft-p1-count").textContent = `${draftPicks[0].length}/${pp}`;
  $("draft-p2-count").textContent = `${draftPicks[1].length}/${pp}`;
  $("draft-p1").className = `draft-player${draftTurn === 0 ? " active" : ""}`;
  $("draft-p2").className = `draft-player${draftTurn === 1 ? " active" : ""}`;
  $("draft-turn-label").textContent = `${playerNames[draftTurn]}'s pick`;
  $("draft-turn-label").style.color = draftTurn === 0 ? "var(--p1)" : "var(--p2)";
}

function finishDraft() {
  draftOverlay.style.display = "none";
  launchGame();
}

/* ── SETTINGS ── */
document.querySelectorAll(".setting-opts").forEach(group => {
  group.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      group.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const id = group.id;
      const val = btn.dataset.val;
      if (id === "set-rounds") gameSettings.rounds = +val;
      else if (id === "set-sound") gameSettings.sound = val === "1";
      else if (id === "set-gravity") gameSettings.gravity = +val;
      else if (id === "set-draft") gameSettings.autoDraft = val === "1";
    });
  });
});

/* ── EVENT LISTENERS ── */
$("btn-2p").addEventListener("click", () => showNameScreen(false));
$("btn-cpu").addEventListener("click", () => showNameScreen(true));
$("btn-campaign").addEventListener("click", () => { campaignMode = true; showCampaignScreen(); });

$("btn-back").addEventListener("click", () => {
  nameOverlay.style.display = "none";
  if (campaignMode) { campaignMode = false; }
  modeOverlay.style.display = "flex";
});

$("btn-start").addEventListener("click", () => startGame());
$("p1-name-input").addEventListener("keydown", e => { if (e.key === "Enter") $("p2-name-input").focus(); });
$("p2-name-input").addEventListener("keydown", e => { if (e.key === "Enter") startGame(); });

$("btn-campaign-back").addEventListener("click", () => {
  campaignOverlay.style.display = "none";
  campaignMode = false;
  modeOverlay.style.display = "flex";
});

$("btn-campaign-fight").addEventListener("click", () => {
  campaignOverlay.style.display = "none";
  vsCPU = true;
  const opp = CAMPAIGN_OPPONENTS[campaignLevel];
  playerNames[0] = $("p1-name-input").value.trim() || "PLAYER 1";
  playerNames[1] = opp.name;
  $("p1-name").textContent = playerNames[0];
  $("p2-name").textContent = playerNames[1];
  initDraft();
});

$("btn-settings").addEventListener("click", () => {
  modeOverlay.style.display = "none";
  settingsOverlay.style.display = "flex";
});
$("btn-settings-done").addEventListener("click", () => {
  settingsOverlay.style.display = "none";
  modeOverlay.style.display = "flex";
});

$("restart-btn").addEventListener("click", () => {
  goOverlay.style.display = "none";
  $("hud").style.display = "none";
  $("controls").style.display = "none";
  campaignMode = false;
  $("campaign-next-btn").style.display = "none";
  modeOverlay.style.display = "flex";
  phase = "menu";
});

$("campaign-next-btn").addEventListener("click", () => {
  goOverlay.style.display = "none";
  $("hud").style.display = "none";
  $("controls").style.display = "none";
  const s0 = tanks[0].score, s1 = tanks[1].score;
  const won = s0 > s1;
  if (won && campaignLevel < CAMPAIGN_OPPONENTS.length - 1) {
    campaignLevel++;
    showCampaignScreen();
  } else if (won) {
    campaignMode = false; campaignLevel = 0;
    modeOverlay.style.display = "flex"; phase = "menu";
  } else {
    showCampaignScreen();
  }
});

function autoAssignWeapons() {
  const perPlayer = gameSettings.rounds;
  const indices = Array.from({length: WEAPONS.length}, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  draftPicks = [indices.slice(0, perPlayer), indices.slice(perPlayer, perPlayer * 2)];
}

function startGame() {
  const n1 = $("p1-name-input").value.trim();
  const n2 = $("p2-name-input").value.trim();
  playerNames[0] = n1 || "PLAYER 1";
  playerNames[1] = vsCPU ? (n2 || "CPU") : (n2 || "PLAYER 2");
  $("p1-name").textContent = playerNames[0];
  $("p2-name").textContent = playerNames[1];
  nameOverlay.style.display = "none";
  if (gameSettings.autoDraft) {
    autoAssignWeapons();
    launchGame();
  } else {
    initDraft();
  }
}

function launchGame() {
  modeOverlay.style.display = "none";
  goOverlay.style.display = "none";
  $("hud").style.display = "flex";
  $("controls").style.display = "block";
  generateAllBackgrounds();
  generateTerrain();
  buildTerrainDetailLayer();
  initClouds();
  initBats();
  initWeather();
  tanks = [
    createTank(0, 80 + Math.floor(Math.random() * 180), draftPicks[0]),
    createTank(1, CW - 80 - Math.floor(Math.random() * 180), draftPicks[1])
  ];
  projectiles = []; particles = []; smokeParticles = [];
  explosions = []; floatingTexts = [];
  currentPlayer = 0; angle = 45; power = 50;
  selectedWeapon = tanks[0].inventory[0] || 0; moveAnim = null;
  wind = (Math.random() - 0.5) * 70;
  roundNumber = 0; shotsThisRound = 0;
  shakeTimer = 0; settleTimer = 0; aiDelay = 0;
  phase = "aiming";
  fireBtn.disabled = false;
  buildWeaponSelect();
  updateHUD();
  showBanner(playerNames[0], "#ff6b6b");
}

/* ============================================================
   MAIN LOOP
   ============================================================ */
let lastTime = 0;

function loop(timestamp) {
  try { loopInner(timestamp); } catch (e) { console.error("loop error:", e); }
  requestAnimationFrame(loop);
}

function loopInner(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  gameTime += dt;

  updateClouds(dt);
  updateBats(dt);
  updateSmoke(dt);
  updateWeather(dt);

  if (phase !== "menu" && phase !== "gameover") {
    handleInput(dt);
    if (shakeTimer > 0) shakeTimer -= dt;
    if (bannerTimer > 0) { bannerTimer -= dt; if (bannerTimer <= 0) turnBanner.classList.remove("show"); }

    if (phase === "moving") updateMoveAnim(dt);
    if (phase === "firing") updateProjectiles(dt);
    if (phase === "exploding") {
      updateExplosions(dt); updateParticles(dt); updateFloatingTexts(dt);
      if (explosions.length === 0 && particles.length < 5) { phase = "settling"; settleTimer = 0; }
    }
    if (phase === "settling") { updateParticles(dt); updateFloatingTexts(dt); settleTanks(dt); }
    if (phase === "aiming" && vsCPU && currentPlayer === 1) { aiDelay -= dt; if (aiDelay <= 0) aiThink(); }

    updateParticles(dt);
    updateFloatingTexts(dt);
    updateExplosions(dt);
  }

  // render
  ctx.save();
  if (shakeTimer > 0) {
    const i = shakeIntensity * (shakeTimer / 0.3);
    ctx.translate((Math.random() - 0.5) * i, (Math.random() - 0.5) * i);
  }

  drawSky();
  drawClouds();
  drawBats();
  drawWeather();
  drawMountains();
  flushTerrainDetail();
  drawTerrain();
  drawWater();
  drawWindArrow();

  if (phase !== "menu") {
    drawSmoke();
    drawAimGuide();
    for (let i = 0; i < tanks.length; i++) drawTank(tanks[i], i === currentPlayer);
    drawProjectiles();
    drawExplosions();
    drawParticles();
    drawFloatingTexts();
  }

  drawVignette();
  ctx.restore();
}

// kick off
generateAllBackgrounds();
buildWeaponSelect();
updateHUD();
requestAnimationFrame(loop);

})();
