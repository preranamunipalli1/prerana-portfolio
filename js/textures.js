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

/* ---------- The puzzle picture: a girl at her desk, thinking — six thoughts in her cloud ----------
   Layout matches the puzzle: 3 columns × 3 bands. The bottom band is the girl (already assembled);
   the top two bands hold the six thought bubbles, one per section, in this order:
   top row: Story · Experience · Projects   middle row: Thoughts & Perspectives · Toolkit · Connect */
export const THOUGHTS = [
  { label: "my story", color: "#C9D6BC", icon: "book" },
  { label: "experience", color: "#E8B9A4", icon: "chart" },
  { label: "projects", color: "#EFD594", icon: "flask" },
  { label: "perspectives", color: "#BCCDDD", icon: "article" },
  { label: "toolkit", color: "#ECCBC7", icon: "tools" },
  { label: "let's connect", color: "#B5C7AE", icon: "chat" },
]

export function drawPicture(imageEl) {
  const W = 2048, H = 1536, c = canvas(W, H), g = c.getContext("2d"), r = rng(5);
  if (imageEl) {
    const s = Math.max(W / imageEl.width, H / imageEl.height);
    g.drawImage(imageEl, (W - imageEl.width * s) / 2, (H - imageEl.height * s) / 2, imageEl.width * s, imageEl.height * s);
    return c;
  }
  const bw = W / 3, bh = H / 3;
  const ink = (lw = 8) => { g.strokeStyle = P.ink; g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round"; };
  const circ = (x, y, rr) => { g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); };

  // background: warm sky with a few loose dots
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, "#EAD9BD"); gr.addColorStop(0.65, "#F4E9D6"); gr.addColorStop(1, "#EFE2CC");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(46,38,33,.25)";
  for (let i = 0; i < 60; i++) { circ(r() * W, r() * H * 0.68, 2 + r() * 4); g.fill(); }

  // the thought cloud (outline first, then fill on top so only the outer edge shows)
  const cx = W / 2, cy = 520, rx = 955, ry = 470, bumps = [];
  for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2; bumps.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 105 + r() * 50]); }
  ink(14); bumps.forEach(([x, y, rr]) => { circ(x, y, rr); g.stroke(); });
  g.fillStyle = "#FFFBF2";
  bumps.forEach(([x, y, rr]) => { circ(x, y, rr); g.fill(); });
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.fill();

  // trail of little thought bubbles from her head up into the cloud
  [[1100, 1085, 22], [1140, 1035, 32], [1185, 975, 44]].forEach(([x, y, rr]) => { g.fillStyle = "#FFFBF2"; circ(x, y, rr); g.fill(); ink(7); g.stroke(); });

  // centres of the six thoughts
  const centers = THOUGHTS.map((_, i) => [bw * (i % 3 + 0.5), bh * (Math.floor(i / 3) + 0.5) + (i < 3 ? 25 : -20)]);

  // connect the dots between thoughts
  g.setLineDash([16, 18]); ink(6); g.strokeStyle = "rgba(46,38,33,.45)";
  g.beginPath(); [0, 1, 2, 5, 4, 3, 0].forEach((k, i) => (i ? g.lineTo(...centers[k]) : g.moveTo(...centers[k]))); g.stroke();
  g.beginPath(); g.moveTo(...centers[1]); g.lineTo(...centers[4]); g.stroke();
  g.setLineDash([]);

  // each thought bubble
  THOUGHTS.forEach((t, i) => {
    const [x, y] = centers[i], R = 200;
    g.fillStyle = t.color; circ(x, y, R); g.fill(); ink(9); g.stroke();
    g.fillStyle = "rgba(255,255,255,.35)"; circ(x - 70, y - 80, 46); g.fill(); // highlight
    drawIcon(g, t.icon, x, y - 30, 1.15);
    g.fillStyle = P.ink; g.font = "600 70px Caveat, cursive"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.fillText(t.label, x, y + 135);
  });

  // ---- bottom band: the girl at her desk ----
  const deskY = 1405;
  // desk
  g.fillStyle = "#C79B6E"; g.fillRect(0, deskY, W, H - deskY); ink(8); g.beginPath(); g.moveTo(0, deskY); g.lineTo(W, deskY); g.stroke();
  g.strokeStyle = "rgba(90,58,30,.25)"; g.lineWidth = 4;
  for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(0, deskY + 30 + k * 30); g.bezierCurveTo(600, deskY + 20 + k * 30, 1400, deskY + 45 + k * 30, W, deskY + 30 + k * 30); g.stroke(); }

  const gx = 1024; // girl centre
  const skin = "#B97F5B", hair = "#33241C";
  // hair (back)
  g.fillStyle = hair; g.beginPath();
  g.moveTo(gx - 150, 1430); g.bezierCurveTo(gx - 210, 1300, gx - 170, 1090, gx, 1075); g.bezierCurveTo(gx + 170, 1090, gx + 210, 1300, gx + 150, 1430); g.closePath(); g.fill(); ink(8); g.stroke();
  // body / sweater
  g.fillStyle = P.sage; g.beginPath();
  g.moveTo(gx - 260, H + 10); g.bezierCurveTo(gx - 250, 1430, gx - 160, 1365, gx - 40, 1350); g.lineTo(gx + 40, 1350);
  g.bezierCurveTo(gx + 160, 1365, gx + 250, 1430, gx + 260, H + 10); g.closePath(); g.fill(); ink(8); g.stroke();
  // neck
  g.fillStyle = skin; g.beginPath(); g.moveTo(gx - 32, 1290); g.lineTo(gx - 34, 1362); g.quadraticCurveTo(gx, 1385, gx + 34, 1362); g.lineTo(gx + 32, 1290); g.closePath(); g.fill(); ink(7); g.stroke();
  // collar
  g.strokeStyle = P.sageDeep; g.lineWidth = 10; g.beginPath(); g.moveTo(gx - 50, 1352); g.quadraticCurveTo(gx, 1395, gx + 50, 1352); g.stroke();
  // head (tilted up a little)
  g.save(); g.translate(gx, 1205); g.rotate(-0.08);
  g.fillStyle = skin; g.beginPath(); g.ellipse(0, 0, 92, 108, 0, 0, Math.PI * 2); g.fill(); ink(8); g.stroke();
  // ears + earrings
  g.fillStyle = skin; [-92, 92].forEach((ex) => { g.beginPath(); g.ellipse(ex, 10, 14, 22, 0, 0, Math.PI * 2); g.fill(); ink(6); g.stroke(); });
  g.fillStyle = P.mustard; [-94, 94].forEach((ex) => { circ(ex, 40, 8); g.fill(); });
  // fringe
  g.fillStyle = hair; g.beginPath(); g.moveTo(-98, -10); g.bezierCurveTo(-110, -120, 60, -150, 100, -40); g.bezierCurveTo(60, -80, 0, -70, -30, -50); g.bezierCurveTo(-60, -40, -80, -20, -98, -10); g.closePath(); g.fill(); ink(7); g.stroke();
  // face: eyes looking up, brows, smile, blush
  g.fillStyle = P.ink; [[-36, 10], [36, 10]].forEach(([ex, ey]) => { g.beginPath(); g.ellipse(ex, ey, 9, 11, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = "#fff"; circ(ex + 2, ey - 5, 3); g.fill(); g.fillStyle = P.ink; });
  ink(5); [[-36, -18], [36, -18]].forEach(([ex, ey]) => { g.beginPath(); g.moveTo(ex - 16, ey + 2); g.quadraticCurveTo(ex, ey - 8, ex + 16, ey); g.stroke(); });
  g.beginPath(); g.moveTo(-4, 22); g.quadraticCurveTo(-10, 40, 2, 44); g.stroke(); // nose
  ink(6); g.beginPath(); g.moveTo(-22, 64); g.quadraticCurveTo(0, 82, 24, 62); g.stroke(); // smile
  g.fillStyle = "rgba(217,120,110,.45)"; circ(-56, 46, 15); g.fill(); circ(56, 46, 15); g.fill();
  g.restore();
  // arm resting on the desk, hand under the chin
  g.fillStyle = P.sage; g.beginPath(); g.moveTo(gx + 240, deskY + 20); g.bezierCurveTo(gx + 200, 1380, gx + 120, 1330, gx + 60, 1325);
  g.lineTo(gx + 40, 1372); g.bezierCurveTo(gx + 100, 1385, gx + 150, 1410, gx + 170, deskY + 30); g.closePath(); g.fill(); ink(8); g.stroke();
  g.fillStyle = skin; g.beginPath(); g.ellipse(gx + 40, 1318, 42, 30, -0.4, 0, Math.PI * 2); g.fill(); ink(7); g.stroke();

  // desk props: mug with steam, books, laptop, plant, pencil
  const mug = (x, y) => { g.fillStyle = P.terracotta; g.beginPath(); g.roundRect(x - 55, y - 120, 110, 120, 14); g.fill(); ink(7); g.stroke(); g.beginPath(); g.arc(x + 62, y - 62, 26, -1.3, 1.3); ink(9); g.stroke(); ink(5); [-25, 0, 25].forEach((d) => { g.beginPath(); g.moveTo(x + d, y - 140); g.bezierCurveTo(x + d - 15, y - 165, x + d + 15, y - 185, x + d, y - 210); g.stroke(); }); };
  mug(690, deskY + 15);
  [[380, P.blue, 300, 54], [395, P.pink, 270, 48], [370, P.mustard, 290, 50]].reduce((y, [x, col, w, h]) => { g.fillStyle = col; g.fillRect(x - w / 2, y - h, w, h); ink(7); g.strokeRect(x - w / 2, y - h, w, h); g.fillStyle = P.paper; g.fillRect(x + w / 2 - 30, y - h + 8, 22, h - 16); return y - h; }, deskY + 20);
  // laptop
  g.fillStyle = "#8E9AA5"; g.beginPath(); g.moveTo(1380, deskY + 20); g.lineTo(1430, 1215); g.lineTo(1700, 1215); g.lineTo(1680, deskY + 20); g.closePath(); g.fill(); ink(8); g.stroke();
  g.fillStyle = P.paper; g.beginPath(); g.moveTo(1415, deskY - 10); g.lineTo(1455, 1240); g.lineTo(1675, 1240); g.lineTo(1655, deskY - 10); g.closePath(); g.fill();
  ink(6); g.beginPath(); g.moveTo(1480, 1350); g.lineTo(1530, 1310); g.lineTo(1570, 1330); g.lineTo(1625, 1270); g.stroke();
  g.fillStyle = "#6F7B86"; g.fillRect(1340, deskY + 12, 380, 22); ink(6); g.strokeRect(1340, deskY + 12, 380, 22);
  // plant
  g.fillStyle = P.terracotta; g.beginPath(); g.moveTo(1830, deskY + 15); g.lineTo(1810, 1310); g.lineTo(1940, 1310); g.lineTo(1920, deskY + 15); g.closePath(); g.fill(); ink(7); g.stroke();
  g.fillStyle = P.sageDeep; [[-50, -60, -0.6], [0, -80, 0], [50, -60, 0.6], [-25, -110, -0.3], [28, -112, 0.3]].forEach(([dx, dy, a]) => { g.save(); g.translate(1875 + dx, 1300 + dy); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 22, 50, 0, 0, Math.PI * 2); g.fill(); ink(5); g.stroke(); g.restore(); });
  // pencil
  g.save(); g.translate(560, deskY + 80); g.rotate(-0.15); g.fillStyle = P.mustard; g.fillRect(-90, -10, 170, 20); ink(5); g.strokeRect(-90, -10, 170, 20); g.fillStyle = "#E8CFA8"; g.beginPath(); g.moveTo(80, -10); g.lineTo(115, 0); g.lineTo(80, 10); g.closePath(); g.fill(); g.stroke(); g.restore();
  return c;
}

// big doodle icons for the thought bubbles (drawn around x, y)
function drawIcon(g, kind, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.strokeStyle = P.ink; g.lineWidth = 8; g.lineCap = "round"; g.lineJoin = "round";
  const fill = (col) => { g.fillStyle = col; g.fill(); g.stroke(); };
  if (kind === "book") {
    g.beginPath(); g.moveTo(0, -40); g.quadraticCurveTo(-40, -62, -90, -50); g.lineTo(-90, 50); g.quadraticCurveTo(-40, 38, 0, 60); g.closePath(); fill(P.paper);
    g.beginPath(); g.moveTo(0, -40); g.quadraticCurveTo(40, -62, 90, -50); g.lineTo(90, 50); g.quadraticCurveTo(40, 38, 0, 60); g.closePath(); fill(P.paper);
    g.lineWidth = 5; [-20, 0, 20].forEach((d) => { g.beginPath(); g.moveTo(-72, d - 6); g.lineTo(-18, d); g.stroke(); });
    g.fillStyle = P.terracotta; g.beginPath(); g.moveTo(45, 10); g.bezierCurveTo(10, -15, 25, -40, 45, -22); g.bezierCurveTo(65, -40, 80, -15, 45, 10); g.fill(); g.lineWidth = 4; g.stroke();
  } else if (kind === "chart") {
    g.beginPath(); g.moveTo(-90, -70); g.lineTo(-90, 60); g.lineTo(95, 60); g.stroke();
    [[-65, 20, P.blue], [-25, -5, P.mustard], [15, -30, P.terracotta], [55, -60, P.sageDeep]].forEach(([bx, top, col]) => { g.beginPath(); g.rect(bx, top, 28, 60 - top); fill(col); });
    g.setLineDash([8, 10]); g.beginPath(); g.moveTo(-70, 0); g.lineTo(-20, -25); g.lineTo(20, -48); g.lineTo(75, -85); g.stroke(); g.setLineDash([]);
    g.beginPath(); g.moveTo(55, -88); g.lineTo(78, -88); g.lineTo(78, -66); g.stroke();
  } else if (kind === "magnifier") {
    // a puzzle piece under a magnifying glass
    g.beginPath(); g.moveTo(-70, -30); g.lineTo(-30, -30); g.arc(-15, -38, 15, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(10, -30); g.lineTo(10, 10); g.arc(18, 25, 15, -Math.PI * 0.7, Math.PI * 0.7); g.lineTo(10, 50); g.lineTo(-70, 50); g.closePath(); fill(P.pink);
    g.beginPath(); g.arc(30, -5, 55, 0, Math.PI * 2); g.fillStyle = "rgba(255,255,255,.45)"; g.fill(); g.stroke();
    g.lineWidth = 16; g.beginPath(); g.moveTo(70, 35); g.lineTo(105, 72); g.stroke();
  } else if (kind === "tools") {
    g.save(); g.rotate(-0.7); g.beginPath(); g.rect(-100, -16, 170, 32); fill(P.mustard); g.beginPath(); g.moveTo(70, -16); g.lineTo(110, 0); g.lineTo(70, 16); g.closePath(); fill("#E8CFA8"); g.beginPath(); g.rect(-115, -16, 18, 32); fill(P.pink); g.restore();
    g.save(); g.rotate(0.7); g.beginPath(); g.rect(-105, -20, 210, 40); fill(P.paper); g.lineWidth = 5; for (let k = -90; k <= 90; k += 22) { g.beginPath(); g.moveTo(k, -20); g.lineTo(k, k % 44 === 0 ? 0 : -8); g.stroke(); } g.restore();
  } else if (kind === "flask") {
    g.beginPath(); g.moveTo(-25, -75); g.lineTo(-25, -20); g.lineTo(-75, 55); g.quadraticCurveTo(-80, 70, -62, 70); g.lineTo(42, 70); g.quadraticCurveTo(60, 70, 55, 55); g.lineTo(5, -20); g.lineTo(5, -75); g.closePath(); fill(P.paper);
    g.beginPath(); g.moveTo(-55, 30); g.quadraticCurveTo(-30, 18, -10, 30); g.quadraticCurveTo(10, 42, 37, 30); g.lineTo(55, 55); g.quadraticCurveTo(60, 70, 42, 70); g.lineTo(-62, 70); g.quadraticCurveTo(-80, 70, -75, 55); g.closePath(); g.fillStyle = P.blue; g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-38, -75); g.lineTo(18, -75); g.stroke();
    // light bulb beside it
    g.beginPath(); g.arc(70, -40, 32, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(84, 5); g.lineTo(56, 5); g.closePath(); fill(P.mustard); g.beginPath(); g.moveTo(58, 16); g.lineTo(82, 16); g.stroke();
  } else if (kind === "article") {
    // a written page with a fountain pen
    g.beginPath(); g.moveTo(-80, -75); g.lineTo(30, -75); g.lineTo(60, -45); g.lineTo(60, 75); g.lineTo(-80, 75); g.closePath(); fill(P.paper);
    g.beginPath(); g.moveTo(30, -75); g.lineTo(30, -45); g.lineTo(60, -45); g.stroke();
    g.fillStyle = P.terracotta; g.font = "700 64px Fraunces, serif"; g.textAlign = "left"; g.fillText("\u201C", -66, -14);
    g.lineWidth = 6; [[-30, -40, 40], [-60, -12, 100], [-60, 14, 100], [-60, 40, 70]].forEach(([x, y, w]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.stroke(); });
    g.save(); g.translate(68, 10); g.rotate(0.55); g.lineWidth = 7;
    g.beginPath(); g.rect(-14, -70, 28, 80); fill(P.blue); g.beginPath(); g.moveTo(-14, 10); g.lineTo(0, 48); g.lineTo(14, 10); g.closePath(); fill(P.mustard); g.restore();
  } else if (kind === "chat") {
    g.beginPath(); g.roundRect(-95, -70, 120, 80, 22); fill(P.paper); g.beginPath(); g.moveTo(-70, 8); g.lineTo(-82, 35); g.lineTo(-50, 10); g.stroke();
    g.beginPath(); g.roundRect(-15, -20, 115, 78, 22); fill(P.pink); g.beginPath(); g.moveTo(75, 56); g.lineTo(88, 80); g.lineTo(55, 58); g.stroke();
    g.fillStyle = P.ink; [-60, -35, -10].forEach((d) => { g.beginPath(); g.arc(d, -30, 6, 0, Math.PI * 2); g.fill(); });
    g.fillStyle = P.terracotta; g.beginPath(); g.moveTo(42, 32); g.bezierCurveTo(15, 12, 28, -8, 42, 6); g.bezierCurveTo(56, -8, 69, 12, 42, 32); g.fill(); g.lineWidth = 4; g.stroke();
  }
  g.restore();
}

export function drawResume() {
  const W = 600, H = 780, c = canvas(W, H), g = c.getContext("2d");
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H);
  g.fillStyle = P.sage; g.fillRect(0, 0, W, 16);
  g.fillStyle = P.ink; g.font = "400 46px Fraunces, serif"; g.fillText("Prerana Munipalli", 50, 92);
  g.font = "500 20px 'DM Sans', sans-serif"; g.fillStyle = P.inkSoft; g.fillText("STRATEGY · ANALYTICS · AI", 52, 128);
  g.fillStyle = P.terracotta; g.fillRect(50, 150, 500, 4);
  const sec = (y, title, lines) => {
    g.fillStyle = P.terracotta; g.font = "700 18px 'DM Sans', sans-serif"; g.fillText(title, 50, y);
    g.fillStyle = "rgba(46,38,33,.22)"; lines.forEach((w, i) => g.fillRect(50, y + 22 + i * 26, w, 10));
  };
  sec(200, "EXPERIENCE", [470, 420, 450, 380, 300, 460, 410]);
  sec(430, "EDUCATION", [430, 360, 400]);
  sec(560, "SKILLS", [480, 440, 360]);
  g.fillStyle = P.ink; g.font = "600 34px Caveat, cursive"; g.fillText("resume.pdf", 50, 735);
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
  g.fillStyle = P.ink; g.font = "400 50px Fraunces, serif"; g.fillText("Connecting the Dots", 70, H - 82);
  g.font = "600 34px 'DM Sans', sans-serif"; g.fillStyle = P.terracotta; g.textAlign = "right"; g.fillText("1000 PIECES*", W - 70, H - 82);
  g.font = "500 30px Caveat, cursive"; g.fillStyle = P.inkSoft; g.fillText("*96, but who's counting", W - 70, H - 50);
  return c;
}

// latte art on the coffee: a cream heart with "hi" in it, so people know to hover the mug
export function drawLatte() {
  const W = 512, c = canvas(W, W), g = c.getContext("2d");
  const gr = g.createRadialGradient(W / 2, W / 2, 40, W / 2, W / 2, W / 2);
  gr.addColorStop(0, "#9A6A43"); gr.addColorStop(0.7, "#7A4F2F"); gr.addColorStop(1, "#4E321F");
  g.fillStyle = gr; g.fillRect(0, 0, W, W);
  // crema heart
  g.fillStyle = "#F3E3C9"; g.strokeStyle = "rgba(122,79,47,.5)"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(256, 420);
  g.bezierCurveTo(90, 320, 70, 170, 170, 130); g.bezierCurveTo(220, 112, 250, 140, 256, 170);
  g.bezierCurveTo(262, 140, 292, 112, 342, 130); g.bezierCurveTo(442, 170, 422, 320, 256, 420); g.closePath(); g.fill(); g.stroke();
  // little swirl lines in the foam
  g.strokeStyle = "rgba(154,106,67,.35)"; g.lineWidth = 5;
  [[256, 300, 120], [256, 300, 80]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y - 20, r, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); });
  g.fillStyle = "#4E2E1A"; g.font = "700 200px Caveat, cursive"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("hi", 256, 262);
  return c;
}

export function drawGlow(color) {
  const W = 256, c = canvas(W, W), g = c.getContext("2d");
  const gr = g.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
  gr.addColorStop(0, color); gr.addColorStop(0.55, color + "88"); gr.addColorStop(1, color + "00");
  g.fillStyle = gr; g.fillRect(0, 0, W, W);
  return c;
}
