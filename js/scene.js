/* The 3D puzzle table (Three.js). */
import * as THREE from "three";
import * as TX from "./textures.js";

const COLS = 12, ROWS = 9;           // puzzle pieces (each 1×1 world unit)
const RW = 4, RH = 3;                // one "thought" region = 4×3 pieces → 3×2 regions
const GIRL_ROWS = 3;                 // bottom band (rows 0–2) = the girl at her desk, already assembled
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;

// Which section each piece belongs to (-1 = the girl). Reading order: top row of thoughts L→R, then middle row.
const regionOf = (c, r) => (r < GIRL_ROWS ? -1 : (r >= GIRL_ROWS + RH ? 0 : 1) * 3 + Math.floor(c / RW));

export async function createScene(canvas, opts) {
  const { pieces: sections, done: doneSet, hooks, pictureImage } = opts;

  /* ---------- renderer / scene / camera ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const BG = { day: new THREE.Color("#E9DDC8"), night: new THREE.Color("#17120E") };
  scene.background = BG.day.clone();
  scene.fog = new THREE.Fog(scene.background, 90, 200);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const cam = { pos: new THREE.Vector3(0, 24, 18), target: new THREE.Vector3(), mouse: new THREE.Vector2(), mode: "overview", region: -1 };

  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight("#FFF7EA", "#9C7A58", 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#FFF0DA", 1.9);
  sun.position.set(-10, 22, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 16, bottom: -16, near: 1, far: 60 });
  sun.shadow.bias = -0.0006;
  sun.shadow.radius = 5;
  scene.add(sun);

  /* ---------- materials & helpers ---------- */
  const matCache = {};
  const mat = (color, extra) => (extra ? new THREE.MeshLambertMaterial({ color, ...extra }) : (matCache[color] ||= new THREE.MeshLambertMaterial({ color })));
  const inkLine = new THREE.LineBasicMaterial({ color: "#2E2621", transparent: true, opacity: 0.6 });
  const canvasTex = (cv, { repeat } = {}) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
    return t;
  };
  function part(geo, material, parent, pos = [0, 0, 0], rot = [0, 0, 0], ink = true) {
    const m = new THREE.Mesh(geo, material);
    m.position.set(...pos); m.rotation.set(...rot);
    m.castShadow = true; m.receiveShadow = true;
    if (ink) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 35), inkLine));
    parent.add(m);
    return m;
  }
  function rod(a, b, r, material, parent) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
    const m = part(new THREE.CylinderGeometry(r, r, len, 14), material, parent);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    return m;
  }
  const flat = (w, h, tex, parent, pos, rotY = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tex }));
    m.rotation.set(-Math.PI / 2, 0, rotY); m.position.set(...pos); m.receiveShadow = true; parent.add(m);
    return m;
  };

  /* ---------- table ---------- */
  const woodTex = canvasTex(TX.drawWood(), { repeat: [3, 2] });
  const table = new THREE.Mesh(new THREE.BoxGeometry(60, 0.6, 50), new THREE.MeshLambertMaterial({ map: woodTex }));
  table.position.set(0, -0.3, -8); table.receiveShadow = true; scene.add(table);

  /* ---------- puzzle geometry ---------- */
  const tr = TX.rng(42);
  const hS = Array.from({ length: ROWS - 1 }, () => Array.from({ length: COLS }, () => (tr() > 0.5 ? 1 : -1)));
  const vS = Array.from({ length: ROWS }, () => Array.from({ length: COLS - 1 }, () => (tr() > 0.5 ? 1 : -1)));

  function edge(shape, A, B, s) {
    if (!s) return shape.lineTo(B[0], B[1]);
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const P = (x, y) => [A[0] + x * dx + y * s * dy, A[1] + x * dy - y * s * dx];
    shape.lineTo(...P(0.36, 0));
    shape.bezierCurveTo(...P(0.42, 0), ...P(0.44, 0.05), ...P(0.41, 0.1));
    shape.bezierCurveTo(...P(0.36, 0.19), ...P(0.42, 0.26), ...P(0.5, 0.26));
    shape.bezierCurveTo(...P(0.58, 0.26), ...P(0.64, 0.19), ...P(0.59, 0.1));
    shape.bezierCurveTo(...P(0.56, 0.05), ...P(0.58, 0), ...P(0.64, 0));
    shape.lineTo(B[0], B[1]);
  }
  function pieceShape(c, r, size = 1, ox = c, oy = r, sides) {
    const x0 = ox * size, y0 = oy * size, x1 = x0 + size, y1 = y0 + size;
    const [b, rt, t, l] = sides || [
      r === 0 ? 0 : -hS[r - 1][c],
      c === COLS - 1 ? 0 : vS[r][c],
      r === ROWS - 1 ? 0 : hS[r][c],
      c === 0 ? 0 : -vS[r][c - 1],
    ];
    const sh = new THREE.Shape();
    sh.moveTo(x0, y0);
    edge(sh, [x0, y0], [x1, y0], b);
    edge(sh, [x1, y0], [x1, y1], rt);
    edge(sh, [x1, y1], [x0, y1], t);
    edge(sh, [x0, y1], [x0, y0], l);
    return sh;
  }

  // picture + tray
  const picCanvas = TX.drawPicture(pictureImage);
  const picTex = canvasTex(picCanvas);
  picTex.repeat.set(1 / COLS, 1 / ROWS);
  const outlines = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) outlines.push(pieceShape(c, r).getPoints(8));
  const MARGIN = 0.35;
  const trayTex = canvasTex(TX.drawTray(picCanvas, outlines, COLS, ROWS, MARGIN));
  const kraftSide = mat("#9C744C");
  const tray = new THREE.Mesh(
    new THREE.BoxGeometry(COLS + 2 * MARGIN, 0.14, ROWS + 2 * MARGIN),
    [kraftSide, kraftSide, new THREE.MeshLambertMaterial({ map: trayTex }), kraftSide, kraftSide, kraftSide]
  );
  tray.position.y = 0.07; tray.receiveShadow = true; tray.castShadow = true;
  tray.add(new THREE.LineSegments(new THREE.EdgesGeometry(tray.geometry), inkLine));
  scene.add(tray);

  // board group: local XY = table plane, local +Z = up
  const board = new THREE.Group();
  board.rotation.x = -Math.PI / 2;
  board.position.y = 0.145;
  scene.add(board);
  board.updateMatrixWorld();
  const toLocal = (v) => board.worldToLocal(v.clone());

  const MUTED = new THREE.Color("#BDB3A6");
  const regionMats = sections.map((_, i) => new THREE.MeshLambertMaterial({ map: picTex, color: doneSet.has(i) ? 0xffffff : MUTED.getHex() }));
  const sideMat = mat("#D8BE98");
  const keyMat = new THREE.MeshLambertMaterial({ map: picTex });
  const girlMat = new THREE.MeshLambertMaterial({ map: picTex });
  const pieceInk = new THREE.LineBasicMaterial({ color: "#2E2621", transparent: true, opacity: 0.35 });

  const rnd = TX.rng(7);
  const pieces = [];
  const regionPieces = sections.map(() => []);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const region = regionOf(c, r);
    const geo = new THREE.ExtrudeGeometry(pieceShape(c, r), { depth: 0.09, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelOffset: -0.02, bevelSegments: 1, curveSegments: 6 });
    geo.translate(-(c + 0.5), -(r + 0.5), 0);
    const mesh = new THREE.Mesh(geo, [region < 0 ? girlMat : regionMats[region], sideMat]);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 40), pieceInk));
    const slot = new THREE.Vector3(c + 0.5 - COLS / 2, r + 0.5 - ROWS / 2, 0);
    mesh.position.copy(slot);
    mesh.userData = region < 0 ? { kind: "girl" } : { kind: "region", region };
    board.add(mesh);
    const p = { c, r, region, mesh, slot, state: "placed" };
    pieces.push(p); if (region >= 0) regionPieces[region].push(p);
  }

  // per region: one key piece (loose on the table) + some missing pieces (in the box)
  const BOX_POS = new THREE.Vector3(10.6, 0.9, -3.6);
  const keys = [];
  const KEY_SPOTS = [[-4.6, -6.1], [0.2, -6.3], [4.6, -6.1], [-4.4, 6.1], [0.1, 6.3], [4.5, 6.1]];
  regionPieces.forEach((list, i) => {
    const interior = list.filter((p) => p.c % RW >= 1 && p.c % RW <= 2 && (p.r - GIRL_ROWS) % RH === 1);
    const key = interior[Math.floor(rnd() * interior.length)];
    key.state = "key";
    // 5 more pieces of this thought start in the box and fly in with the key piece
    const others = list.filter((p) => p !== key).sort(() => rnd() - 0.5);
    others.slice(0, 5).forEach((p) => (p.state = "missing"));
    if (doneSet.has(i)) { list.forEach((p) => (p.state = "placed")); return; }
    list.forEach((p) => { if (p.state === "missing") p.mesh.visible = false; });
    // move the key piece out onto the table
    const [wx, wz] = KEY_SPOTS[i];
    const local = toLocal(new THREE.Vector3(wx, 0.01, wz));
    key.mesh.position.copy(local);
    key.mesh.rotation.z = (rnd() - 0.5) * 1.6;
    key.mesh.userData = { kind: "key", region: i };
    key.mesh.material = [keyMat, sideMat]; // loose pieces are shown in full colour
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.95, 40), new THREE.MeshBasicMaterial({ map: canvasTex(TX.drawGlow(TX.P[sections[i].color] || TX.P.mustard)), transparent: true, depthWrite: false, opacity: 0.7 }));
    glow.position.set(local.x, local.y, local.z + 0.005);
    board.add(glow);
    keys[i] = { piece: key, glow, base: local.clone(), lift: 0, hover: 0, flying: false };
  });

  /* ---------- props ---------- */
  const props = {};
  const prop = (id, x, z, rotY = 0) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY;
    g.userData = { kind: "object", id, baseY: 0, hover: 0 };
    scene.add(g); props[id] = g; return g;
  };

  // coffee mug (+ steam)
  const mug = prop("coffee", 8.9, 3.0);
  part(new THREE.CylinderGeometry(0.78, 0.7, 1.55, 36), mat(TX.P.terracotta), mug, [0, 0.775, 0]);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.66, 36), mat("#5A3A24"));
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = 1.56; mug.add(coffee);
  part(new THREE.TorusGeometry(0.42, 0.11, 12, 28, Math.PI), mat(TX.P.terracotta), mug, [0.74, 0.8, 0], [0, 0, -Math.PI / 2]);
  part(new THREE.CylinderGeometry(0.8, 0.8, 0.12, 36), mat(TX.P.paper), mug, [0, 0.95, 0], [0, 0, 0], false); // stripe
  const steamTex = canvasTex(TX.drawGlow("#ffffff"));
  const steam = [0, 1, 2].map((k) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false })); s.userData.k = k; mug.add(s); return s; });

  // napkin with a coffee ring
  const napkin = prop("napkin", 8.2, 6.9, -0.22);
  flat(2.4, 2.4, canvasTex(TX.drawNapkin()), napkin, [0, 0.012, 0]);

  // laptop
  const laptop = prop("laptop", -10.4, -3.0, 0.42);
  part(new THREE.BoxGeometry(3.8, 0.16, 2.5), mat("#8E9AA5"), laptop, [0, 0.08, 0]);
  const lid = new THREE.Group(); lid.position.set(0, 0.16, -1.22); lid.rotation.x = -0.28; laptop.add(lid);
  const lidGeo = new THREE.BoxGeometry(3.8, 2.5, 0.1); lidGeo.translate(0, 1.25, 0);
  part(lidGeo, mat("#8E9AA5"), lid);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.2), new THREE.MeshBasicMaterial({ map: canvasTex(TX.drawLaptopScreen()) }));
  screen.position.set(0, 1.28, 0.056); lid.add(screen);

  // desk lamp (+ spotlight)
  const lamp = prop("lamp", 7.4, -8.0);
  const lampMat = mat(TX.P.sageDeep);
  part(new THREE.CylinderGeometry(0.9, 1.0, 0.25, 30), lampMat, lamp, [0, 0.125, 0]);
  const j1 = [0, 0.25, 0], j2 = [-0.4, 4.0, 1.0], j3 = [-1.4, 4.6, 2.9];
  rod(j1, j2, 0.09, lampMat, lamp); rod(j2, j3, 0.09, lampMat, lamp);
  part(new THREE.SphereGeometry(0.17, 12, 10), mat(TX.P.mustard), lamp, j2, [0, 0, 0], false);
  const head = new THREE.Group(); head.position.set(...j3); lamp.add(head);
  const shade = part(new THREE.ConeGeometry(0.85, 1.2, 28, 1, true), new THREE.MeshLambertMaterial({ color: TX.P.sageDeep, side: THREE.DoubleSide }), head);
  const bulbMat = new THREE.MeshBasicMaterial({ color: "#FFF4D6" });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), bulbMat); bulb.position.y = -0.5; head.add(bulb);
  // aim the head at the board
  lamp.updateMatrixWorld();
  const headWorld = head.getWorldPosition(new THREE.Vector3());
  const aim = new THREE.Vector3(1.2, 0, -0.8);
  head.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), aim.clone().sub(headWorld).normalize());
  const spot = new THREE.SpotLight("#FFC27A", 0, 0, 0.7, 0.65, 0.6);
  spot.position.copy(headWorld); spot.target.position.copy(aim);
  spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0008;
  scene.add(spot, spot.target);
  const lampGlow = new THREE.PointLight("#FFB866", 0, 9, 1.5); lampGlow.position.copy(headWorld).add(new THREE.Vector3(0, -0.8, 0)); scene.add(lampGlow);

  // puzzle box lid (with the finished picture)
  const box = prop("box", 10.6, -3.6, -0.22);
  const lidTex = canvasTex(TX.drawBoxLid(picCanvas));
  const boxSide = mat(TX.P.ink);
  part(new THREE.BoxGeometry(4.2, 0.5, 2.95), [boxSide, boxSide, new THREE.MeshLambertMaterial({ map: lidTex }), boxSide, boxSide, boxSide], box, [0, 0.25, 0]);

  // sorting tray of edge pieces
  const sorter = prop("sorter", 10.9, 7.4, 0.18);
  part(new THREE.BoxGeometry(3.3, 0.1, 2.3), mat(TX.P.sage), sorter, [0, 0.05, 0]);
  [[0, 1.1, 3.3, 0.1], [0, -1.1, 3.3, 0.1], [1.6, 0, 0.1, 2.3], [-1.6, 0, 0.1, 2.3]].forEach(([x, z, w, d]) => part(new THREE.BoxGeometry(w, 0.32, d), mat(TX.P.sage), sorter, [x, 0.16, z]));
  const miniCols = [TX.P.blue, TX.P.mustard, TX.P.pink, TX.P.terracotta, TX.P.paper, TX.P.sageDeep];
  for (let k = 0; k < 10; k++) {
    const sh = pieceShape(0, 0, 0.5, -0.5, -0.5, [0, rnd() > 0.5 ? 1 : -1, rnd() > 0.5 ? 1 : -1, rnd() > 0.5 ? 1 : -1]);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false, curveSegments: 5 });
    const m = part(g, mat(miniCols[k % 6]), sorter, [-1.1 + (k % 5) * 0.55 + (rnd() - 0.5) * 0.15, 0.11 + (k > 4 ? 0.04 : 0), -0.45 + Math.floor(k / 5) * 0.85], [-Math.PI / 2, 0, rnd() * 6]);
    m.castShadow = false;
  }

  // stack of books
  const books = prop("books", -10.3, 3.5, 0.1);
  [[2.7, 0.45, 1.95, TX.P.sage, 0], [2.45, 0.4, 1.8, TX.P.pink, 0.14], [2.25, 0.38, 1.7, TX.P.blue, -0.1]].reduce((y, [w, h, d, col, ry]) => {
    part(new THREE.BoxGeometry(w, h, d), mat(col), books, [0, y + h / 2, 0], [0, ry, 0]);
    part(new THREE.BoxGeometry(w - 0.12, h - 0.1, d + 0.02), mat(TX.P.paper), books, [0.08, y + h / 2, 0], [0, ry, 0], false);
    return y + h;
  }, 0);

  // notebook + pencil
  const notebook = prop("notebook", -9.6, 0.5, 0.12);
  notebook.userData.kind = "decor"; // just says "ideas" for now — not clickable
  const nbTop = new THREE.MeshLambertMaterial({ map: canvasTex(TX.drawNotebook()) });
  const nbSide = mat(TX.P.paper);
  part(new THREE.BoxGeometry(2.4, 0.16, 3.0), [nbSide, nbSide, nbTop, nbSide, nbSide, nbSide], notebook, [0, 0.08, 0]);
  for (let k = 0; k < 9; k++) part(new THREE.TorusGeometry(0.11, 0.025, 6, 14), mat("#6B625A"), notebook, [-1.2, 0.16, -1.2 + k * 0.3], [0, Math.PI / 2, 0], false);
  const pencil = new THREE.Group(); pencil.position.set(1.85, 0.08, 0.2); pencil.rotation.y = 0.5; notebook.add(pencil);
  part(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 6), mat(TX.P.mustard), pencil, [0, 0, 0], [0, 0, Math.PI / 2]);
  part(new THREE.ConeGeometry(0.08, 0.3, 6), mat("#E8CFA8"), pencil, [-1.25, 0, 0], [0, 0, Math.PI / 2]);
  part(new THREE.CylinderGeometry(0.085, 0.085, 0.2, 6), mat(TX.P.pink), pencil, [1.2, 0, 0], [0, 0, Math.PI / 2]);

  // sudoku + pen
  const sudoku = prop("sudoku", -7.3, 7.4, 0.14);
  flat(2.5, 2.5, canvasTex(TX.drawSudoku()), sudoku, [0, 0.012, 0]);
  const pen = new THREE.Group(); pen.position.set(1.45, 0.08, 0.3); pen.rotation.y = -0.9; sudoku.add(pen);
  part(new THREE.CylinderGeometry(0.07, 0.07, 1.8, 10), mat("#3D5F8C"), pen, [0, 0, 0], [0, 0, Math.PI / 2]);

  // headphones
  const phones = prop("music", -10.6, 7.6, -0.4);
  part(new THREE.TorusGeometry(0.95, 0.09, 10, 32, Math.PI), mat(TX.P.ink), phones, [0, 0.1, 0], [-Math.PI / 2, 0, 0]);
  [-0.95, 0.95].forEach((x) => part(new THREE.CylinderGeometry(0.46, 0.46, 0.32, 24), mat(TX.P.terracotta), phones, [x, 0.16, 0]));

  // resume: a sheet of paper at the top of the table (click to download)
  const resume = prop("resume", -1.6, -8.7, 0.08);
  const paperTop = new THREE.MeshLambertMaterial({ map: canvasTex(TX.drawResume()) });
  const paperSide = mat("#FFFFFF");
  part(new THREE.BoxGeometry(2.3, 0.03, 3.0), [paperSide, paperSide, paperTop, paperSide, paperSide, paperSide], resume, [0.12, 0.015, 0.1], [0, 0.06, 0], false);
  part(new THREE.BoxGeometry(2.3, 0.03, 3.0), [paperSide, paperSide, paperTop, paperSide, paperSide, paperSide], resume, [0, 0.05, 0]);
  part(new THREE.TorusGeometry(0.16, 0.025, 6, 16, Math.PI * 1.5), mat("#9AA3AB"), resume, [-0.8, 0.08, -1.45], [-Math.PI / 2, 0, 0], false);

  /* ---------- anchors for the HTML sticky notes ---------- */
  const anchors = [];
  const objAnchor = { resume: [-1.6, 0.2, -9.9], coffee: [8.9, 1.9, 3.0], napkin: [8.2, 0.2, 6.9], sorter: [10.9, 0.5, 7.4], books: [-10.3, 1.4, 3.5], sudoku: [-7.3, 0.2, 7.4], music: [-10.6, 0.5, 7.6] };
  Object.entries(objAnchor).forEach(([id, p]) => anchors.push({ kind: "object", id, pos: new THREE.Vector3(...p) }));

  /* ---------- tweens ---------- */
  const tweens = new Set();
  const tween = (dur, fn, { delay = 0, e = ease } = {}) => new Promise((res) => tweens.add({ t: -delay, dur, fn, e, res }));

  function fly(mesh, to, { dur = 0.75, height = 1.6, delay = 0, onLand } = {}) {
    const from = mesh.position.clone();
    let rz = mesh.rotation.z % (Math.PI * 2); if (rz > Math.PI) rz -= Math.PI * 2; if (rz < -Math.PI) rz += Math.PI * 2;
    return tween(dur, (p) => {
      mesh.position.lerpVectors(from, to, p);
      mesh.position.z += Math.sin(Math.PI * p) * height;
      mesh.rotation.z = rz * (1 - p);
      mesh.rotation.x = Math.sin(Math.PI * p) * 0.5;
    }, { delay }).then(() => { mesh.position.copy(to); mesh.rotation.set(0, 0, 0); onLand && onLand(); });
  }

  /* ---------- camera ---------- */
  const tmpCam = new THREE.PerspectiveCamera();
  const DIR = new THREE.Vector3(0, 1, 0.72).normalize();
  // margin: number, or {x, top, bottom} in NDC (lets us keep space for the headline / bottom menu)
  function fit(rect, center, margin = 0.86) {
    const m = typeof margin === "number" ? { x: margin, top: margin, bottom: margin } : margin;
    tmpCam.fov = camera.fov; tmpCam.aspect = camera.aspect; tmpCam.updateProjectionMatrix();
    const [x0, x1, z0, z1, h = 0] = rect;
    const pts = [];
    [x0, x1].forEach((x) => [z0, z1].forEach((z) => [0, h].forEach((y) => pts.push(new THREE.Vector3(x, y, z)))));
    let lo = 4, hi = 160;
    for (let k = 0; k < 30; k++) {
      const d = (lo + hi) / 2;
      tmpCam.position.copy(center).addScaledVector(DIR, d); tmpCam.lookAt(center); tmpCam.updateMatrixWorld();
      const ok = pts.every((p) => { const v = p.clone().project(tmpCam); return Math.abs(v.x) < m.x && v.y < m.top && v.y > -m.bottom; });
      ok ? (hi = d) : (lo = d);
    }
    return hi;
  }
  function overviewView() {
    const portrait = camera.aspect < 0.9;
    const center = new THREE.Vector3(0, 0, portrait ? -1.6 : -1.9); // look a little "behind" the board so the table sits lower on screen
    const d = portrait
      ? fit([-6.8, 6.8, -7.0, 7.0], center, { x: 0.94, top: 0.55, bottom: 0.72 })
      : fit([-12.2, 12.2, -9.6, 8.3], center, { x: 0.92, top: 0.62, bottom: 0.76 });
    return { pos: center.clone().addScaledVector(DIR, d), target: center };
  }
  function regionView(i, panelFrac = 0) {
    const rc = i % 3, rr = Math.floor(i / 3);
    const rowStart = rr === 0 ? GIRL_ROWS + RH : GIRL_ROWS;
    const center = new THREE.Vector3(rc * RW + RW / 2 - COLS / 2, 0, -(rowStart + RH / 2 - ROWS / 2));
    const visibleFrac = 1 - panelFrac;
    tmpCam.fov = camera.fov; tmpCam.aspect = camera.aspect * visibleFrac; // fit into the area left of the panel
    const saveAspect = camera.aspect; camera.aspect = tmpCam.aspect;
    const d = fit([center.x - 3.0, center.x + 3.0, center.z - 2.6, center.z + 2.6], center, 0.82);
    camera.aspect = saveAspect;
    const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    const visW = 2 * d * Math.tan(hfov / 2);
    const shift = (panelFrac * visW) / 2;
    const target = center.clone().add(new THREE.Vector3(shift, 0, 0));
    return { pos: target.clone().addScaledVector(DIR, d), target };
  }
  function moveCamera(view, dur = 1.1) {
    const p0 = cam.pos.clone(), t0 = cam.target.clone();
    cam.moving = true;
    return tween(dur, (p) => { cam.pos.lerpVectors(p0, view.pos, p); cam.target.lerpVectors(t0, view.target, p); }).then(() => (cam.moving = false));
  }

  /* ---------- picking ---------- */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let hovered = null;
  const pickTargets = () => [...pieces.filter((p) => p.mesh.visible).map((p) => p.mesh), ...Object.values(props)];
  function pick(ev) {
    const r = canvas.getBoundingClientRect();
    ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(pickTargets(), true).find((h) => h.object.type === "Mesh");
    if (!hit) return null;
    let o = hit.object;
    while (o && !o.userData.kind) o = o.parent;
    return o ? { obj: o, ...o.userData } : null;
  }
  canvas.addEventListener("pointermove", (ev) => {
    cam.mouse.set((ev.clientX / innerWidth) * 2 - 1, (ev.clientY / innerHeight) * 2 - 1);
    if (ev.pointerType === "touch") return;
    const h = pick(ev);
    const id = h ? (h.kind === "object" ? h.id : `${h.kind}:${h.region}`) : null;
    if (id !== (hovered && hovered.key)) { hovered = h ? { ...h, key: id } : null; hooks.onHover && hooks.onHover(hovered); }
    canvas.style.cursor = h && api.interactive && ["key", "region", "object"].includes(h.kind) ? "pointer" : "default";
  });
  let down = null;
  canvas.addEventListener("pointerdown", (ev) => (down = [ev.clientX, ev.clientY]));
  canvas.addEventListener("pointerup", (ev) => {
    if (!down || Math.hypot(ev.clientX - down[0], ev.clientY - down[1]) > 8) return;
    const h = pick(ev);
    if (h && api.interactive && ["key", "region", "object"].includes(h.kind)) hooks.onPick(h);
  });

  /* ---------- night mode ---------- */
  const light = { night: 0 };
  function applyLight() {
    const n = light.night;
    hemi.intensity = lerp(2.1, 0.22, n);
    sun.intensity = lerp(1.9, 0.08, n);
    spot.intensity = lerp(0, 90, n);
    lampGlow.intensity = lerp(0, 14, n);
    bulbMat.color.set(n > 0.5 ? "#FFE3A8" : "#FFF4D6");
    scene.background.lerpColors(BG.day, BG.night, n);
    scene.fog.color.copy(scene.background);
  }
  applyLight();

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.1), t = clock.elapsedTime;
    for (const tw of tweens) {
      tw.t += dt;
      if (tw.t < 0) continue;
      const p = Math.min(1, tw.t / tw.dur);
      tw.fn(tw.e(p), p);
      if (p >= 1) { tweens.delete(tw); tw.res(); }
    }
    // loose key pieces bob, lift on hover, glow pulses
    keys.forEach((k, i) => {
      if (!k || k.flying || k.placed) return;
      const isHover = hovered && hovered.kind === "key" && hovered.region === i;
      k.hover = lerp(k.hover, isHover ? 1 : 0, 0.15);
      k.piece.mesh.position.z = k.base.z + 0.06 + Math.sin(t * 2.2 + i) * 0.05 + k.hover * 0.35;
      k.glow.material.opacity = 0.45 + Math.sin(t * 2.2 + i) * 0.2 + k.hover * 0.3;
    });
    // props lift on hover
    Object.values(props).forEach((g) => {
      const isHover = hovered && hovered.kind === "object" && hovered.id === g.userData.id;
      g.userData.hover = lerp(g.userData.hover, isHover ? 1 : 0, 0.15);
      g.position.y = g.userData.hover * 0.18;
    });
    // steam
    steam.forEach((s) => {
      const p = ((t * 0.35 + s.userData.k / 3) % 1);
      s.position.set(Math.sin(t + s.userData.k * 2) * 0.18, 1.7 + p * 2.0, 0);
      s.scale.setScalar(0.5 + p * 0.9);
      s.material.opacity = Math.sin(p * Math.PI) * 0.55;
    });
    // camera (+ gentle parallax on the overview)
    const par = cam.mode === "overview" && !cam.moving ? 1 : 0;
    camera.position.set(cam.pos.x + cam.mouse.x * 0.6 * par, cam.pos.y, cam.pos.z + cam.mouse.y * 0.4 * par);
    camera.lookAt(cam.target);
    renderer.render(scene, camera);
    hooks.onFrame && hooks.onFrame();
    requestAnimationFrame(frame);
  }

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (cam.mode === "overview" && !cam.moving) { const v = overviewView(); cam.pos.copy(v.pos); cam.target.copy(v.target); }
  }
  window.addEventListener("resize", resize);
  resize();
  // start a little high & far, then settle in
  const ov = overviewView();
  cam.pos.copy(ov.pos).add(new THREE.Vector3(0, 10, 6)); cam.target.copy(ov.target);
  requestAnimationFrame(frame);

  /* ---------- public API ---------- */
  const api = {
    interactive: true,
    anchors,
    picture: picCanvas,
    project(v) {
      const p = v.clone().project(camera);
      return { x: (p.x * 0.5 + 0.5) * innerWidth, y: (-p.y * 0.5 + 0.5) * innerHeight, visible: p.z < 1 && Math.abs(p.x) < 1.1 && Math.abs(p.y) < 1.1 };
    },
    intro() { return moveCamera(overviewView(), 1.8); },
    isDone: (i) => !keys[i] || keys[i].placed,
    keyPos(i) { const k = keys[i]; return k && !k.placed ? board.localToWorld(k.piece.mesh.position.clone()) : null; },
    async placeKey(i) {
      const k = keys[i];
      if (!k || k.placed) return;
      k.flying = true;
      tween(0.4, (p) => (k.glow.material.opacity = (1 - p) * 0.6));
      await fly(k.piece.mesh, k.piece.slot, { dur: 0.8, height: 1.8, onLand: () => hooks.onSnap && hooks.onSnap() });
      k.piece.mesh.userData = { kind: "region", region: i };
      k.glow.visible = false; k.placed = true; k.flying = false;
    },
    async fillRegion(i) {
      const missing = regionPieces[i].filter((p) => p.state === "missing");
      const start = toLocal(BOX_POS);
      missing.forEach((p) => { p.mesh.position.copy(start); p.mesh.rotation.z = (Math.random() - 0.5) * 4; p.mesh.visible = true; });
      const color = regionMats[i].color, c0 = color.clone(), white = new THREE.Color(0xffffff);
      tween(1.2, (p) => color.lerpColors(c0, white, p), { delay: 0.3 });
      await Promise.all(missing.map((p, k) => fly(p.mesh, p.slot, { dur: 0.65, height: 2.2, delay: k * 0.06, onLand: () => { p.state = "placed"; if (k % 3 === 0) hooks.onTick && hooks.onTick(); } })));
    },
    zoomTo(i, panelFrac) { cam.mode = "region"; cam.region = i; return moveCamera(regionView(i, panelFrac), 1.0); },
    overview() { cam.mode = "overview"; cam.region = -1; return moveCamera(overviewView(), 1.0); },
    setNight(on) { const n0 = light.night; return tween(0.6, (p) => { light.night = lerp(n0, on ? 1 : 0, p); applyLight(); }); },
    async celebrate() {
      await api.overview();
      await Promise.all(pieces.map((p) => {
        const d = Math.hypot(p.slot.x, p.slot.y);
        return tween(0.7, (q) => (p.mesh.position.z = Math.sin(q * Math.PI) * 0.45), { delay: d * 0.05, e: (x) => x });
      }));
    },
  };
  return api;
}
