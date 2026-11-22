/* UI glue: loader, routing, side panel, sticky notes, cards, lamp & sound toggles. */
import { Sound } from "./sound.js";
import * as V from "./sections.js";

const S = window.SITE;
const $ = (s, el = document) => el.querySelector(s);
const body = document.body;
const STORE = "pm-table-v1";
const done = new Set(JSON.parse(localStorage.getItem(STORE) || "[]"));
const save = () => localStorage.setItem(STORE, JSON.stringify([...done]));
const idx = (id) => S.pieces.findIndex((p) => p.id === id);

let scene = null, busy = false, openId = null, celebratePending = false;

/* ---------- loader ---------- */
const loaderLines = ["Sorting the edge pieces first…", "Finding the four corners…", "Hunting for that one sky piece…", "Making coffee…"];
let li = 0;
const loaderTimer = setInterval(() => { $("#loaderText").textContent = loaderLines[++li % loaderLines.length]; }, 1300);
function hideLoader() { clearInterval(loaderTimer); $("#loader").classList.add("gone"); setTimeout(() => $("#loader").remove(), 800); }

/* ---------- chrome: progress + nav ---------- */
function renderProgress() {
  const n = done.size;
  $("#progress").innerHTML = `<span class="progress-text">${n} / 6 pieces placed</span><span class="progress-dots">${S.pieces.map((p, i) => `<i class="${done.has(i) ? "on" : ""}" style="--c:${V.C(p.color)}"></i>`).join("")}</span>`;
  $("#nav").innerHTML = S.pieces.map((p, i) => `<a href="#${p.id}" class="nav-chip ${done.has(i) ? "found" : ""}" style="--c:${V.C(p.color)}"><b>${p.num}</b>${V.esc(p.title)}</a>`).join("");
  $("#hint").hidden = n > 0;
}

/* ---------- side panel (sections) ---------- */
const panel = $("#panel"), panelBody = $("#panelBody");
function showPanel(id) {
  openId = id;
  panelBody.innerHTML = V.renderSection(id);
  V.wireSection(id, panelBody);
  panelBody.scrollTop = 0;
  panel.style.setProperty("--c", V.C(S.pieces[idx(id)].color));
  panel.classList.add("open"); panel.setAttribute("aria-hidden", "false");
  body.classList.add("panel-open");
  Sound.page();
  setTimeout(() => $("#panelClose").focus({ preventScroll: true }), 350);
}
function hidePanel() {
  openId = null;
  panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true");
  body.classList.remove("panel-open");
}
const panelFrac = () => (innerWidth > 900 ? panel.offsetWidth / innerWidth : 0);

async function openSection(id) {
  const i = idx(id);
  if (!scene) { showPanel(id); return; }
  if (busy) return;
  busy = true; scene.interactive = false;
  closeCard();
  if (openId) hidePanel();
  body.classList.add("zoomed");
  if (!scene.isDone(i)) {
    await scene.placeKey(i);
    await Promise.all([scene.zoomTo(i, panelFrac()), scene.fillRegion(i)]);
    done.add(i); save(); renderProgress();
    if (done.size === S.pieces.length && !localStorage.getItem("pm-celebrated")) celebratePending = true;
  } else {
    done.add(i); save(); renderProgress();
    await scene.zoomTo(i, panelFrac());
  }
  showPanel(id);
  busy = false; scene.interactive = true;
}
async function backToTable() {
  if (openId) hidePanel();
  body.classList.remove("zoomed");
  if (!scene) return;
  if (busy) return;
  busy = true;
  await scene.overview();
  if (celebratePending) {
    celebratePending = false;
    localStorage.setItem("pm-celebrated", "1");
    await scene.celebrate();
    openCard(V.renderComplete(), "complete");
  }
  busy = false;
}

/* ---------- highlights ---------- */
const hl = $("#highlights");
function openHighlights() {
  closeCard();
  hl.hidden = false; requestAnimationFrame(() => hl.classList.add("open"));
  hl.scrollTop = 0; body.classList.add("hl-open"); Sound.page();
  $("#hlClose").focus({ preventScroll: true });
}
function closeHighlights() {
  if (hl.hidden) return;
  hl.classList.remove("open"); body.classList.remove("hl-open");
  setTimeout(() => (hl.hidden = true), 350);
}

/* ---------- cards (hobbies, coffee, box, complete) ---------- */
const card = $("#card");
let lastFocus = null;
function openCard(html, kind = "") {
  lastFocus = document.activeElement;
  $("#cardBody").innerHTML = html;
  card.dataset.kind = kind;
  card.hidden = false; requestAnimationFrame(() => card.classList.add("open"));
  Sound.page();
  $("#cardClose").focus({ preventScroll: true });
}
function closeCard() {
  if (card.hidden) return;
  card.classList.remove("open");
  setTimeout(() => (card.hidden = true), 250);
  lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}
card.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeCard();
  if (e.target.closest("[data-coffee]")) openCard(V.renderCoffee(), "coffee");
  if (e.target.closest('a[href^="#"]')) closeCard();
});

function handleObject(id) {
  if (id === "coffee") return openCard(V.renderCoffee(), "coffee");
  if (id === "laptop") return (location.hash = "highlights");
  if (id === "lamp") return toggleNight();
  if (id === "box") return openCard(V.renderBox(done.size, S.pieces.length, scene.picture.toDataURL("image/jpeg", 0.85)), "box");
  openCard(V.renderHobby(id), "hobby");
}

/* ---------- lamp (night) & sound ---------- */
function toggleNight() {
  const on = !body.classList.contains("night");
  body.classList.toggle("night", on);
  $("#nightBtn").setAttribute("aria-pressed", on);
  $("#nightBtn").title = on ? "Turn the lights on" : "Switch on the desk lamp";
  Sound.switch();
  scene && scene.setNight(on);
}
$("#nightBtn").addEventListener("click", toggleNight);
$("#soundBtn").addEventListener("click", () => {
  const on = Sound.toggle();
  $("#soundBtn").setAttribute("aria-pressed", on);
  $("#soundBtn").title = on ? "Sound on" : "Sound off";
});
$("#panelClose").addEventListener("click", () => (location.hash = "table"));
$("#hlClose").addEventListener("click", () => (location.hash = openId ? openId : "table"));
$("#reset").addEventListener("click", () => { localStorage.removeItem(STORE); localStorage.removeItem("pm-celebrated"); location.hash = "table"; location.reload(); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!card.hidden) return closeCard();
  if (!hl.hidden) return (location.hash = "table");
  if (openId) location.hash = "table";
});

/* ---------- sticky notes over the 3D scene ---------- */
const notes = [];
function buildNotes() {
  const layer = $("#notes");
  const teaser = (id) => (S.hobbies.find((h) => h.id === id) || {}).teaser || S.objectTeasers[id] || id;
  scene.anchors.forEach((a, k) => {
    const el = document.createElement("button");
    if (a.kind === "key") {
      const p = S.pieces[a.region];
      el.className = "tnote note-key";
      el.style.setProperty("--c", V.C(p.color));
      el.innerHTML = `<span class="nk-num">${p.num}</span><span class="nk-title">${V.esc(p.title)}</span><span class="nk-hint">place this piece</span>`;
      el.setAttribute("aria-label", `${p.title}: place this piece`);
      el.addEventListener("click", () => (location.hash = p.id));
    } else {
      el.className = `tnote note-obj note-${a.id}`;
      el.style.setProperty("--r", `${[-3, 2, -1.5, 2.5, -2, 1.5][k % 6]}deg`);
      el.textContent = teaser(a.id);
      el.addEventListener("click", () => handleObject(a.id));
    }
    layer.appendChild(el);
    notes.push({ el, a });
  });
}
function positionNotes() {
  for (const { el, a } of notes) {
    if (a.kind === "key" && scene.isDone(a.region)) { el.classList.add("gone"); continue; }
    const p = scene.project(a.pos);
    el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
    el.classList.toggle("off", !p.visible);
  }
}
function onHover(h) {
  notes.forEach(({ el, a }) => el.classList.toggle("hover", !!h && ((a.kind === "key" && h.kind === "key" && a.region === h.region) || (a.kind === "object" && h.kind === "object" && a.id === h.id))));
}

/* ---------- routing ---------- */
function route() {
  const id = location.hash.slice(1);
  if (id === "highlights") return openHighlights();
  closeHighlights();
  if (idx(id) >= 0) { if (id !== openId) openSection(id); return; }
  closeCard();
  if (openId || body.classList.contains("zoomed")) backToTable();
}
window.addEventListener("hashchange", route);

/* ---------- boot ---------- */
function hasWebGL() { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } }
function loadImage(src) { return new Promise((res) => { if (!src) return res(null); const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }); }

async function boot() {
  $("#hlBody").innerHTML = V.renderHighlights();
  renderProgress();
  if (!hasWebGL()) return fallback("Your browser couldn't open the 3D puzzle table, so here's the one-page version.");
  try {
    await Promise.race([
      Promise.all([document.fonts.load('500 60px "Caveat"'), document.fonts.load('400 60px "Fraunces"'), document.fonts.load('500 30px "DM Sans"')]),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
    const [{ createScene }, img] = await Promise.all([import("./scene.js"), loadImage(S.puzzleImage)]);
    scene = await createScene($("#scene"), {
      pieces: S.pieces, done: new Set(done), pictureImage: img,
      hooks: {
        onPick: (h) => (h.kind === "object" ? handleObject(h.id) : (location.hash = S.pieces[h.region].id)),
        onSnap: () => Sound.click(),
        onTick: () => Sound.click(0.12),
        onHover, onFrame: positionNotes,
      },
    });
  } catch (err) {
    console.error(err);
    return fallback("The 3D puzzle table couldn't load, so here's the one-page version.");
  }
  buildNotes();
  setTimeout(hideLoader, 400);
  await scene.intro();
  body.classList.add("ready");
  route();
}
function fallback(msg) {
  hideLoader();
  body.classList.add("no-3d");
  $("#hlNotice").textContent = msg;
  $("#hlNotice").hidden = false;
  if (location.hash.slice(1) && idx(location.hash.slice(1)) >= 0) route(); else location.hash = "highlights";
  route();
}
boot();
