/* HTML for the six sections (shown in the side panel), the highlights page,
   and the small cards (hobbies, coffee, box). All text comes from content.js. */
const S = window.SITE;
export const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const C = (name) => `var(--${name})`;
const DEEP = { sage: "#55704F", sageDeep: "#4C6447", terracotta: "#A4543A", mustard: "#9A7420", pink: "#A9615B", blue: "#4D6D8A" };

export const ICONS = {
  bulb: `<path d="M24 6c-8 0-13 6-13 12.5 0 5 3 8 5.5 10.5 1.5 1.5 2.5 3.5 2.5 6h10c0-2.5 1-4.5 2.5-6C34 26.5 37 23.5 37 18.5 37 12 32 6 24 6z"/><path d="M19.5 39h9M21 43h6"/><path d="M24 35V25l-3-3M24 25l3-3"/>`,
  chart: `<path d="M7 41.5h35"/><path d="M8 41V8"/><path d="M14 35v-8M22 35V20M30 35v-11M38 35V13"/>`,
  magnifier: `<circle cx="20" cy="20" r="12"/><path d="M29 29l11.5 11.5"/><path d="M14 18c1-3 3.5-5 6.5-5"/>`,
  pencil: `<path d="M10 38l2.5-9L33 8.5c1.7-1.7 4.5-1.7 6 0 1.6 1.6 1.6 4.3 0 6L18.5 35z"/><path d="M12.5 29l6 6M30 11.5l6 6"/>`,
  flask: `<path d="M19 6.5h10M21 7v12L10 38.5c-1 2 .4 4 2.6 4h22.8c2.2 0 3.6-2 2.6-4L27 19V7"/><path d="M14 31c4-2 7 2 11 0s6-1 9 0"/>`,
  coffee: `<path d="M9 18h25v11c0 7-5 12-12.5 12S9 36 9 29z"/><path d="M34 21h3.5c2.5 0 4 2 4 4.5S39.5 30 37 30h-3"/><path d="M16 12c0-2 2-2 2-4M22 12c0-2 2-2 2-4M28 12c0-2 2-2 2-4"/>`,
  puzzle: `<path d="M9 9h10c-1-6 11-6 10 0h10v10c6-1 6 11 0 10v10H29c1 6-11 6-10 0H9V29c-6 1-6-11 0-10z"/>`,
  mail: `<rect x="6" y="11" width="36" height="26" rx="3"/><path d="M7 13l17 13 17-13"/>`,
  link: `<path d="M20 28l8-8"/><path d="M17 23l-4 4a6 6 0 008.5 8.5l4-4"/><path d="M31 25l4-4a6 6 0 00-8.5-8.5l-4 4"/>`,
  code: `<path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 9l-6 30"/>`,
  doc: `<path d="M12 6h17l9 9v27H12z"/><path d="M29 6v9h9M18 24h14M18 30h14M18 36h9"/>`,
  calendar: `<rect x="7" y="10" width="34" height="31" rx="3"/><path d="M7 19h34M16 6v8M32 6v8"/>`,
  arrowR: `<path d="M8 24h30M28 14l10 10-10 10"/>`,
};
export const icon = (name, attrs = "") => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${ICONS[name] || ""}</svg>`;

function head(id, title, intro) {
  const p = S.pieces.find((x) => x.id === id);
  return `<header class="sec-head"><span class="sec-num">${p.num}</span><span class="kicker">${esc(p.title)}</span><h2 id="panel-title">${esc(title)}</h2>${intro ? `<p class="sec-intro">${esc(intro)}</p>` : ""}</header>`;
}
function next(id) {
  const i = S.pieces.findIndex((x) => x.id === id), n = S.pieces[i + 1];
  return n
    ? `<a class="next-piece" href="#${n.id}" style="--c:${C(n.color)}"><div><small>next piece · ${n.num}</small><strong>${esc(n.title)}</strong></div><span class="arrow">${icon("arrowR", 'width="22"')}</span></a>`
    : `<a class="next-piece" href="#table" style="--c:${C("sage")}"><div><small>that's the last section</small><strong>Back to the table</strong></div><span class="arrow">${icon("puzzle", 'width="22"')}</span></a>`;
}

const R = {
  story() {
    const d = S.story, cols = ["sage", "mustard", "terracotta"];
    return head("story", d.title, d.intro) + `
      <div class="pillars">${d.pillars.map((p, i) => `
        <article class="pillar" style="--c:${C(cols[i % 3])};--c-deep:${DEEP[cols[i % 3]]}">
          <div class="ico">${icon(p.icon)}</div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><span class="note">${esc(p.note)}</span>
        </article>`).join("")}</div>
      <h3 class="sub-h">Where I learned</h3>
      <div class="timeline">${d.education.map((e, i) => `
        <div class="tl-item" style="--c:${C(i ? "mustard" : "blue")}"><span class="yrs">${esc(e.years)}</span><h4>${esc(e.school)}</h4><p>${esc(e.degree)}</p><span class="note">${esc(e.note)}</span></div>`).join("")}</div>
      <h3 class="sub-h">Off the clock</h3>
      <div class="pinboard">${d.personal.map((x, i) => `
        <div class="sticky" style="--c:${C(x.color)};--r:${[-2.5, 1.8, 1.2, -1.6][i % 4]}deg"><div class="lbl">${esc(x.label)}</div><div class="val">${esc(x.value)}</div></div>`).join("")}</div>`;
  },
  experience() {
    const d = S.experience;
    return head("experience", d.title, d.intro) + `<div class="journey">${d.chapters.map((ch, i) => `
      <section class="chapter" style="--c:${C(ch.color)}">
        <div class="chapter-dot">${String(i + 1).padStart(2, "0")}</div>
        <div class="chapter-head"><h3>${esc(ch.company)}</h3><span class="role">${esc(ch.role)}</span></div>
        <div class="meta"><span class="tag">${esc(ch.period)}</span><span class="tag">${esc(ch.context)}</span></div>
        <p class="summary">${esc(ch.summary)}</p>
        <div class="metrics">${ch.metrics.map((m) => `<div class="metric"><div class="v">${esc(m.value)}</div><div class="l">${esc(m.label)}</div></div>`).join("")}</div>
        <div class="projects">${ch.projects.map((p) => `<details class="proj"><summary>${esc(p.title)}<span class="plus">+</span></summary><p>${esc(p.text)}</p></details>`).join("")}</div>
      </section>`).join("")}</div>`;
  },
  cases() {
    const d = S.cases;
    return head("cases", d.title, d.intro) + `<div class="case-area">${caseGrid()}</div>`;
  },
  toolkit() {
    const d = S.toolkit;
    return head("toolkit", d.title, d.intro) + `
      <div class="filters"><button class="filter on" data-filter="all">All</button>${d.groups.map((g, i) => `<button class="filter" data-filter="${i}">${esc(g.name)}</button>`).join("")}</div>
      <aside class="tk-note" aria-live="polite"><div class="k">How I use it</div><h4>Pick a piece</h4><p>hover or tap any tool to see where it fits</p></aside>
      ${d.groups.map((g, i) => `<div class="tk-group" data-group="${i}" style="--c:${C(g.color)}"><h3>${esc(g.name)}</h3><div class="tk-items">${g.items.map((t, j) => `<button class="tk" data-g="${i}" data-t="${j}">${esc(t.name)}</button>`).join("")}</div></div>`).join("")}`;
  },
  experiments() {
    const d = S.experiments, sc = { Building: "terracotta", Prototype: "mustard", Exploring: "blue", Shipped: "sage", Idea: "pink" };
    return head("experiments", d.title, d.intro) + `<div class="lab">${d.items.map((x, i) => {
      const tag = x.link ? "a" : "article";
      return `<${tag} class="exp" ${x.link ? `href="${esc(x.link)}" target="_blank" rel="noopener"` : ""} style="--c:${C(sc[x.status] || "sage")};--r:${[-1, 0.8, -0.5, 1.1, -0.9, 0.6][i % 6]}deg">
        <span class="status"><i></i>${esc(x.status)}</span><h3>${esc(x.title)}</h3><span class="kind">${esc(x.kind)}</span><p>${esc(x.text)}</p></${tag}>`;
    }).join("")}</div>`;
  },
  connect() {
    const d = S.connect;
    return head("connect", d.title, d.text) + linkCards() + `<p class="final-note hand">thanks for putting the pieces together with me ✦</p>`;
  },
};

function linkCards() {
  const colors = ["terracotta", "blue", "sage", "mustard"];
  return `<div class="links">${S.connect.links.map((l, i) => `
    <a class="link-card" href="${esc(l.href)}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} style="--c:${C(colors[i % 4])}">
      <span class="ico">${icon(l.icon)}</span><div><small>${esc(l.label)}</small><span>${esc(l.value)}</span></div>${icon("arrowR", 'width="20"')}
    </a>`).join("")}</div>`;
}

function caseGrid() {
  return `<div class="case-grid">${S.cases.items.map((c, i) => `
    <button class="case" data-case="${i}" style="--c:${C(c.color)}">
      <div class="case-visual">${c.image ? `<img src="${esc(c.image)}" alt="">` : dotsArt(i)}</div>
      <div class="case-body"><span class="tag">${esc(c.tag)}</span><h3>${esc(c.title)}</h3><p>${esc(c.problem)}</p><div class="open">see how the pieces fit →</div></div>
    </button>`).join("")}</div>`;
}
function caseDetail(i) {
  const c = S.cases.items[i];
  return `<button class="back-link" data-back>← all case studies</button>
    <div class="case-detail" style="--c:${C(c.color)};--c-deep:${DEEP[c.color]}">
      <span class="tag">${esc(c.tag)}</span><h3>${esc(c.title)}</h3>
      <div class="shot">${c.image ? `<img src="${esc(c.image)}" alt="">` : `<span class="hand">screenshot / visual goes here<br><small>set <code>image</code> in content.js</small></span>`}</div>
      <div class="chain">
        <div class="chain-step"><span class="k">The problem</span><p>${esc(c.problem)}</p></div>
        <div class="chain-step"><span class="k">The pieces</span><div class="chips">${c.pieces.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div></div>
        <div class="chain-step"><span class="k">The pattern</span><p>${esc(c.pattern)}</p></div>
        <div class="chain-step"><span class="k">The decision</span><p>${esc(c.decision)}</p></div>
        <div class="chain-step"><span class="k">The outcome</span><p>${esc(c.outcome)}</p></div>
      </div>
    </div>`;
}
function dotsArt(seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const pts = Array.from({ length: 9 }, () => [20 + rnd() * 360, 20 + rnd() * 150]);
  const path = pts.slice(0, 6).sort((a, b) => a[0] - b[0]).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(0)},${p[1].toFixed(0)}`).join(" ");
  return `<svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="${path}" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 6" stroke-linecap="round"/>${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i < 6 ? 7 : 4}" fill="${i < 6 ? "var(--paper)" : "var(--ink)"}" stroke="var(--ink)" stroke-width="1.5" opacity="${i < 6 ? 1 : 0.35}"/>`).join("")}</svg>`;
}

export function renderSection(id) { return R[id] ? R[id]() + next(id) : ""; }

export function wireSection(id, root) {
  if (id === "cases") {
    const area = root.querySelector(".case-area");
    const bind = () => {
      area.querySelectorAll(".case").forEach((b) => b.addEventListener("click", () => { area.innerHTML = caseDetail(+b.dataset.case); root.scrollTop = 0; bind(); }));
      const back = area.querySelector("[data-back]");
      back && back.addEventListener("click", () => { area.innerHTML = caseGrid(); bind(); });
    };
    bind();
  }
  if (id === "toolkit") {
    const note = root.querySelector(".tk-note");
    const show = (b) => {
      const g = S.toolkit.groups[+b.dataset.g], t = g.items[+b.dataset.t];
      root.querySelectorAll(".tk.on").forEach((x) => x.classList.remove("on")); b.classList.add("on");
      note.innerHTML = `<div class="k">${esc(g.name)}</div><h4>${esc(t.name)}</h4><p>${esc(t.use)}</p>`;
    };
    root.querySelectorAll(".tk").forEach((b) => ["mouseenter", "click", "focus"].forEach((e) => b.addEventListener(e, () => show(b))));
    root.querySelectorAll(".filter").forEach((f) => f.addEventListener("click", () => {
      root.querySelectorAll(".filter").forEach((x) => x.classList.toggle("on", x === f));
      root.querySelectorAll(".tk-group").forEach((g) => g.classList.toggle("dim", f.dataset.filter !== "all" && g.dataset.group !== f.dataset.filter));
    }));
  }
}

/* ---------- "Just the highlights": the 30-second, one-page version ---------- */
export function renderHighlights() {
  const H = S.highlights, ex = S.experience.chapters;
  return `
  <div class="hl-page">
    <header class="hl-head">
      <div>
        <p class="eyebrow">${esc(S.tagline)}</p>
        <h1>${esc(S.name)}</h1>
        <p class="hl-summary">${esc(H.summary)}</p>
        <div class="hl-tags">${H.lookingFor.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      </div>
      <div class="hl-actions">
        ${S.connect.links.map((l) => `<a class="btn ${l.label === "Resume" ? "btn-dark" : ""}" href="${esc(l.href)}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${icon(l.icon, 'width="18"')} ${esc(l.label === "Resume" ? "Download resume" : l.label)}</a>`).join("")}
      </div>
    </header>
    <div class="hl-grid">
      <section>
        <h2>Experience</h2>
        ${ex.map((c) => `
          <div class="hl-job">
            <div class="hl-job-top"><h3>${esc(c.company)}</h3><span>${esc(c.period)}</span></div>
            <p class="hl-role">${esc(c.role)} · ${esc(c.context)}</p>
            <ul>${c.projects.slice(0, 4).map((p) => `<li>${esc(p.title)}</li>`).join("")}</ul>
            <div class="hl-metrics">${c.metrics.map((m) => `<span><b>${esc(m.value)}</b> ${esc(m.label)}</span>`).join("")}</div>
          </div>`).join("")}
        <h2>Selected work</h2>
        <ul class="hl-cases">${S.cases.items.map((c) => `<li><b>${esc(c.title)}</b> — ${esc(c.outcome)}</li>`).join("")}</ul>
      </section>
      <aside>
        <h2>Education</h2>
        ${S.story.education.map((e) => `<div class="hl-edu"><h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p><span>${esc(e.years)}</span></div>`).join("")}
        <h2>Toolkit</h2>
        ${S.toolkit.groups.map((g) => `<div class="hl-skill"><h4>${esc(g.name)}</h4><p>${g.items.map((t) => esc(t.name)).join(" · ")}</p></div>`).join("")}
        <h2>Interested in</h2>
        <p class="hl-interests">${H.interests.map(esc).join(" · ")}</p>
      </aside>
    </div>
    <p class="hl-foot hand">Have more time? <a href="#table">Go back to the puzzle table →</a></p>
  </div>`;
}

/* ---------- small cards ---------- */
export function renderHobby(id) {
  const h = S.hobbies.find((x) => x.id === id);
  if (!h) return "";
  return `<p class="card-kicker">off the clock</p><h2 id="card-title">${esc(h.title)}</h2>${h.body.map((p) => `<p>${esc(p)}</p>`).join("")}`;
}
export function renderCoffee() {
  const c = S.coffee;
  return `<div class="coffee-icon">${icon("coffee", 'width="44"')}</div>
    <p class="card-kicker">${esc(c.kicker)}</p><h2 id="card-title">${esc(c.title)}</h2><p>${esc(c.text)}</p>
    ${linkCards()}
    ${c.calendar ? `<a class="btn btn-dark btn-block" href="${esc(c.calendar)}" target="_blank" rel="noopener">${icon("calendar", 'width="18"')} Book a 20-minute chat</a>` : ""}`;
}
export function renderBox(found, total, picUrl) {
  return `<p class="card-kicker">the picture on the box</p><h2 id="card-title">${found === total ? "The full picture." : "This is what we're building."}</h2>
    <img class="box-pic" src="${picUrl}" alt="The finished puzzle picture: a landscape where a dotted path connects data points to a house labelled decisions.">
    <p>${found === total ? "Every piece is on the table. Thanks for exploring!" : `${found} of ${total} sections found. Click the loose pieces on the table to fill in the rest.`}</p>`;
}
export function renderComplete() {
  const resume = S.connect.links.find((l) => l.label === "Resume");
  return `<p class="card-kicker">puzzle complete ✦</p><h2 id="card-title">You put it together.<br>Here's the full picture.</h2>
    <p>Thanks for exploring every piece. If you'd like the whole story on one page:</p>
    <div class="card-actions">
      <a class="btn btn-dark" href="${esc(resume ? resume.href : "#")}" download>${icon("doc", 'width="18"')} Download my resume</a>
      <a class="btn" href="#highlights">Just the highlights</a>
      <button class="btn" data-coffee>${icon("coffee", 'width="18"')} Let's grab coffee</button>
    </div>`;
}
