/* Canvas-drawn textures: the puzzle picture, wood, paper props.
   The puzzle picture is a placeholder — swap drawPicture() for an image later
   (see README: "Changing the puzzle picture"). */

export const P = {
  cream: "#F4EDE0", paper: "#FBF7EF", ink: "#2E2621", inkSoft: "#5E534B",
  sage: "#9CAF88", sageDeep: "#6F8A6A", terracotta: "#C9785B", mustard: "#D9A93E",
  pink: "#D9A5A0", blue: "#7E9BB5", kraft: "#B48A5F",
};

export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function dot(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }

/* ---------- The puzzle picture: "From data to decisions" landscape ---------- */
export function drawPicture(imageEl) {
  const W = 2048, H = 1366, c = canvas(W, H), g = c.getContext("2d"), r = rng(11);
  if (imageEl) { // a real image supplied via content.js → cover-fit it
    const s = Math.max(W / imageEl.width, H / imageEl.height);
    g.drawImage(imageEl, (W - imageEl.width * s) / 2, (H - imageEl.height * s) / 2, imageEl.width * s, imageEl.height * s);
    return c;
  }
  // sky
  let gr = g.createLinearGradient(0, 0, 0, H * 0.62);
  gr.addColorStop(0, "#EBD9BD"); gr.addColorStop(1, "#F8EFDF");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);

  // sun + halo rings
  g.fillStyle = "rgba(217,169,62,.22)"; dot(g, W * 0.8, H * 0.22, 210);
  g.fillStyle = "rgba(217,169,62,.35)"; dot(g, W * 0.8, H * 0.22, 150);
  g.fillStyle = P.terracotta; dot(g, W * 0.8, H * 0.22, 96);

  // clouds
  const cloud = (x, y, s) => { g.fillStyle = "rgba(251,247,239,.95)"; [[0, 0, 50], [45, -22, 42], [90, 0, 46], [45, 10, 50]].forEach(([dx, dy, rr]) => dot(g, x + dx * s, y + dy * s, rr * s)); };
  cloud(W * 0.6, H * 0.12, 1.1); cloud(W * 0.3, H * 0.3, 0.9); cloud(W * 0.9, H * 0.38, 0.7);

  // constellation: the dots, connected
  const stars = [[0.06, 0.1], [0.14, 0.24], [0.25, 0.13], [0.34, 0.25], [0.45, 0.1], [0.53, 0.22]].map(([x, y]) => [x * W, y * H]);
  g.setLineDash([14, 16]); g.lineWidth = 5; g.strokeStyle = "rgba(46,38,33,.5)"; g.lineCap = "round";
  g.beginPath(); stars.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.setLineDash([]);
  stars.forEach(([x, y], i) => {
    g.fillStyle = [P.mustard, P.pink, P.blue, P.sage, P.terracotta, P.mustard][i]; dot(g, x, y, 20);
    g.lineWidth = 5; g.strokeStyle = P.ink; g.beginPath(); g.arc(x, y, 20, 0, Math.PI * 2); g.stroke();
  });
  // a few loose stars
  g.fillStyle = "rgba(46,38,33,.35)";
  for (let i = 0; i < 26; i++) dot(g, r() * W * 0.62, r() * H * 0.34, 3 + r() * 3);

  // birds
  g.strokeStyle = P.ink; g.lineWidth = 5;
  [[0.66, 0.33], [0.7, 0.3], [0.68, 0.38]].forEach(([x, y]) => { x *= W; y *= H; g.beginPath(); g.moveTo(x - 22, y - 8); g.quadraticCurveTo(x - 10, y - 14, x, y); g.quadraticCurveTo(x + 10, y - 14, x + 22, y - 8); g.stroke(); });

  // hills (back → front)
  const hill = (base, amp, color, phase, freq = 2.2) => {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, H);
    for (let x = 0; x <= W; x += 16) g.lineTo(x, base + Math.sin(x / W * Math.PI * freq + phase) * amp + Math.sin(x / W * 9 + phase * 2) * amp * 0.18);
    g.lineTo(W, H); g.closePath(); g.fill();
    g.strokeStyle = "rgba(46,38,33,.55)"; g.lineWidth = 4; g.stroke();
  };
  hill(H * 0.47, 40, "#A9BBCB", 0.6, 1.6);
  hill(H * 0.55, 55, P.blue, 2.1, 2.0);
  hill(H * 0.63, 50, P.sage, 0.2, 2.4);

  // mustard fields with furrows
  g.save();
  g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W; x += 16) g.lineTo(x, H * 0.72 + Math.sin(x / W * Math.PI * 1.4 + 1) * 45);
  g.lineTo(W, H); g.closePath(); g.fillStyle = P.mustard; g.fill(); g.strokeStyle = "rgba(46,38,33,.55)"; g.lineWidth = 4; g.stroke();
  g.clip(); g.strokeStyle = "rgba(46,38,33,.16)"; g.lineWidth = 6;
  for (let i = -20; i < 40; i++) { g.beginPath(); g.moveTo(i * 90, H); g.lineTo(i * 90 + 500, H * 0.65); g.stroke(); }
  g.restore();

  // foreground
  hill(H * 0.86, 35, P.sageDeep, 3.0, 1.2);

  // trees
  const tree = (x, y, s, col) => { g.strokeStyle = P.ink; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 60 * s); g.stroke(); g.fillStyle = col; dot(g, x, y - 80 * s, 34 * s); g.lineWidth = 4; g.beginPath(); g.arc(x, y - 80 * s, 34 * s, 0, Math.PI * 2); g.stroke(); };
  [[0.2, 0.63, 1, P.sageDeep], [0.24, 0.645, 0.8, P.pink], [0.43, 0.6, 1.1, P.sageDeep], [0.58, 0.66, 0.9, P.terracotta], [0.62, 0.655, 1.2, P.sageDeep], [0.92, 0.63, 1, P.pink]]
    .forEach(([x, y, s, col]) => tree(x * W, y * H, s, col));

  // the winding path from "data" to "decisions"
  const path = [[0.06, 1.02], [0.18, 0.86], [0.34, 0.9], [0.46, 0.76], [0.6, 0.78], [0.72, 0.62], [0.8, 0.53]].map(([x, y]) => [x * W, y * H]);
  const trace = () => { g.beginPath(); g.moveTo(...path[0]); for (let i = 1; i < path.length - 1; i++) { const [x, y] = path[i], [nx, ny] = path[i + 1]; g.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2); } g.lineTo(...path[path.length - 1]); };
  g.lineCap = "round"; g.strokeStyle = "rgba(46,38,33,.65)"; g.lineWidth = 42; trace(); g.stroke();
  g.strokeStyle = P.paper; g.lineWidth = 34; trace(); g.stroke();
  g.setLineDash([18, 22]); g.strokeStyle = P.terracotta; g.lineWidth = 6; trace(); g.stroke(); g.setLineDash([]);

  // data points along the path
  [[0.16, 0.87, P.blue], [0.33, 0.895, P.pink], [0.47, 0.765, P.terracotta], [0.6, 0.775, P.blue]].forEach(([x, y, col]) => {
    g.fillStyle = col; dot(g, x * W, y * H - 34, 20); g.strokeStyle = P.ink; g.lineWidth = 5; g.beginPath(); g.arc(x * W, y * H - 34, 20, 0, Math.PI * 2); g.stroke();
  });

  // the "decision": a little house with a flag on the hill
  const hx = W * 0.8, hy = H * 0.53;
  g.lineWidth = 6; g.strokeStyle = P.ink;
  g.fillStyle = P.paper; g.fillRect(hx - 70, hy - 110, 140, 110); g.strokeRect(hx - 70, hy - 110, 140, 110);
  g.fillStyle = P.terracotta; g.beginPath(); g.moveTo(hx - 92, hy - 104); g.lineTo(hx, hy - 186); g.lineTo(hx + 92, hy - 104); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = P.mustard; g.fillRect(hx - 20, hy - 60, 40, 60); g.strokeRect(hx - 20, hy - 60, 40, 60);
  g.beginPath(); g.moveTo(hx + 40, hy - 150); g.lineTo(hx + 40, hy - 250); g.stroke();
  g.fillStyle = P.pink; g.beginPath(); g.moveTo(hx + 40, hy - 250); g.lineTo(hx + 110, hy - 228); g.lineTo(hx + 40, hy - 206); g.closePath(); g.fill(); g.stroke();

  // handwritten labels
  g.fillStyle = P.ink; g.font = "500 92px Caveat, cursive";
  g.fillText("data", W * 0.05, H * 0.95);
  g.fillText("decisions", W * 0.83, H * 0.6);
  g.font = "500 64px Caveat, cursive"; g.fillStyle = "rgba(46,38,33,.7)";
  g.fillText("connect the dots →", W * 0.38, H * 0.33);
  return c;
}

/* ---------- Puzzle tray: kraft card with a ghost of the picture + cut lines ---------- */
export function drawTray(picture, outlines, boardW, boardH, margin) {
  const W = 2048, H = Math.round(2048 * (boardH + 2 * margin) / (boardW + 2 * margin)), c = canvas(W, H), g = c.getContext("2d");
  g.fillStyle = "#A88058"; g.fillRect(0, 0, W, H);
  const sx = W / (boardW + 2 * margin), sy = H / (boardH + 2 * margin);
  g.globalAlpha = 0.2; g.drawImage(picture, margin * sx, margin * sy, boardW * sx, boardH * sy); g.globalAlpha = 1;
  g.strokeStyle = "rgba(46,38,33,.28)"; g.lineWidth = 2;
  outlines.forEach((pts) => { g.beginPath(); pts.forEach((p, i) => { const x = (p.x + margin) * sx, y = (boardH - p.y + margin) * sy; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.stroke(); });
  g.strokeStyle = "rgba(46,38,33,.5)"; g.lineWidth = 4; g.strokeRect(margin * sx, margin * sy, boardW * sx, boardH * sy);
  return c;
}

export function drawWood() {
  const W = 1024, H = 1024, c = canvas(W, H), g = c.getContext("2d"), r = rng(3);
  const planks = 6, ph = H / planks;
  for (let i = 0; i < planks; i++) {
    const base = [196, 152, 108].map((v) => v + (r() - 0.5) * 18);
    g.fillStyle = `rgb(${base.join(",")})`; g.fillRect(0, i * ph, W, ph);
    g.strokeStyle = "rgba(90,58,30,.14)"; g.lineWidth = 2;
    for (let k = 0; k < 14; k++) {
      const y0 = i * ph + r() * ph, amp = 2 + r() * 6, f = 0.004 + r() * 0.01;
      g.beginPath(); for (let x = 0; x <= W; x += 8) g.lineTo(x, y0 + Math.sin(x * f + k) * amp); g.stroke();
    }
    if (r() > 0.4) { g.strokeStyle = "rgba(90,58,30,.25)"; g.lineWidth = 3; const kx = r() * W, ky = i * ph + ph / 2; g.beginPath(); g.ellipse(kx, ky, 26, 9, 0, 0, Math.PI * 2); g.stroke(); }
    g.fillStyle = "rgba(70,44,22,.35)"; g.fillRect(0, i * ph, W, 3);
  }
  return c;
}

export function drawLaptopScreen() {
  const W = 1024, H = 680, c = canvas(W, H), g = c.getContext("2d");
  g.fillStyle = P.paper; g.fillRect(0, 0, W, H);
  g.fillStyle = P.sage; g.fillRect(0, 0, W, 54);
  [P.terracotta, P.mustard, P.paper].forEach((col, i) => { g.fillStyle = col; dot(g, 34 + i * 30, 27, 9); });
  g.fillStyle = P.ink; g.font = "400 76px Fraunces, serif"; g.fillText("Prerana Munipalli", 70, 200);
  g.font = "400 38px 'DM Sans', sans-serif"; g.fillStyle = P.inkSoft; g.fillText("Strategy · Analytics · AI", 72, 262);
  g.fillStyle = P.ink; g.beginPath(); g.roundRect(70, 340, 560, 96, 48); g.fill();
  g.fillStyle = P.paper; g.font = "500 40px 'DM Sans', sans-serif"; g.fillText("The 30-second version  →", 112, 402);
  g.strokeStyle = "rgba(46,38,33,.25)"; g.lineWidth = 10; g.lineCap = "round";
  [520, 565, 610].forEach((y, i) => { g.beginPath(); g.moveTo(72, y); g.lineTo([820, 700, 760][i], y); g.stroke(); });
  return c;
}

export function drawNotebook() {
  const W = 512, H = 640, c = canvas(W, H), g = c.getContext("2d");
  g.fillStyle = P.terracotta; g.fillRect(0, 0, W, H);
  g.fillStyle = P.paper; g.fillRect(120, 210, 300, 150);
  g.strokeStyle = P.ink; g.lineWidth = 5; g.strokeRect(120, 210, 300, 150);
  g.fillStyle = P.ink; g.font = "600 92px Caveat, cursive"; g.fillText("ideas", 178, 310);
  g.fillStyle = "rgba(46,38,33,.25)"; g.fillRect(0, 0, 56, H);
  return c;
}

export function drawSudoku() {
  const W = 640, c = canvas(W, W), g = c.getContext("2d"), r = rng(9);
  g.fillStyle = P.paper; g.fillRect(0, 0, W, W);
  const m = 50, s = (W - 2 * m) / 9;
  g.strokeStyle = P.ink;
  for (let i = 0; i <= 9; i++) { g.lineWidth = i % 3 ? 1.5 : 4; g.beginPath(); g.moveTo(m + i * s, m); g.lineTo(m + i * s, W - m); g.stroke(); g.beginPath(); g.moveTo(m, m + i * s); g.lineTo(W - m, m + i * s); g.stroke(); }
  g.textAlign = "center"; g.textBaseline = "middle";
  for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
    const v = r();
    if (v < 0.32) { g.fillStyle = P.ink; g.font = "500 40px 'DM Sans', sans-serif"; g.fillText(1 + Math.floor(r() * 9), m + x * s + s / 2, m + y * s + s / 2 + 2); }
    else if (v < 0.5) { g.fillStyle = "#3D5F8C"; g.font = "600 48px Caveat, cursive"; g.fillText(1 + Math.floor(r() * 9), m + x * s + s / 2, m + y * s + s / 2 + 2); }
  }
  return c;
}

export function drawNapkin() {
  const W = 512, c = canvas(W, W), g = c.getContext("2d");
  g.fillStyle = "#FFFDF8"; g.fillRect(0, 0, W, W);
  g.strokeStyle = "rgba(46,38,33,.12)"; g.lineWidth = 2; g.strokeRect(24, 24, W - 48, W - 48);
  g.strokeStyle = "rgba(120,72,36,.5)"; g.lineWidth = 16;
  g.beginPath(); g.arc(270, 250, 120, 0.3, Math.PI * 1.85); g.stroke();
  g.strokeStyle = "rgba(120,72,36,.22)"; g.lineWidth = 8; g.beginPath(); g.arc(266, 255, 132, -0.4, Math.PI * 1.3); g.stroke();
  g.fillStyle = "rgba(120,72,36,.35)"; dot(g, 410, 330, 9); dot(g, 395, 360, 5);
  return c;
}

export function drawBoxLid(picture) {
  const W = 1024, H = 720, c = canvas(W, H), g = c.getContext("2d");
  g.fillStyle = P.ink; g.fillRect(0, 0, W, H);
  g.drawImage(picture, 40, 40, W - 80, H - 200);
  g.fillStyle = P.paper; g.fillRect(40, H - 150, W - 80, 110);
  g.fillStyle = P.ink; g.font = "400 50px Fraunces, serif"; g.fillText("Data → Decisions", 70, H - 82);
  g.font = "600 34px 'DM Sans', sans-serif"; g.fillStyle = P.terracotta; g.textAlign = "right"; g.fillText("1000 PIECES*", W - 70, H - 82);
  g.font = "500 30px Caveat, cursive"; g.fillStyle = P.inkSoft; g.fillText("*96, but who's counting", W - 70, H - 50);
  return c;
}

export function drawGlow(color) {
  const W = 256, c = canvas(W, W), g = c.getContext("2d");
  const gr = g.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
  gr.addColorStop(0, color); gr.addColorStop(0.55, color + "88"); gr.addColorStop(1, color + "00");
  g.fillStyle = gr; g.fillRect(0, 0, W, W);
  return c;
}
