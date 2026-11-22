/* =========================================================
   App: router, puzzle board, section renderers.
   Content lives in js/content.js — you shouldn't need to edit this file
   to change text.
   ========================================================= */
(() => {
  const S = window.SITE;
  const view = document.getElementById("view");
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const C = (name) => `var(--${name})`;
  const DEEP = { sage: "#55704F", sageDeep: "#4C6447", terracotta: "#A4543A", mustard: "#9A7420", pink: "#A9615B", blue: "#4D6D8A" };

  /* ---------------- Hand-drawn icons (48×48, stroke = currentColor) ---------------- */
  const ICONS = {
    bulb: `<path d="M24 6c-8 0-13 6-13 12.5 0 5 3 8 5.5 10.5 1.5 1.5 2.5 3.5 2.5 6h10c0-2.5 1-4.5 2.5-6C34 26.5 37 23.5 37 18.5 37 12 32 6 24 6z"/><path d="M19.5 39h9M21 43h6"/><path d="M24 35V25l-3-3M24 25l3-3"/><path d="M8 9l3 2.5M40 9l-3 2.5M5 20h3.5M43 20h-3.5"/>`,
    chart: `<path d="M7 41.5h35"/><path d="M8 41V8"/><path d="M14 35v-8M22 35V20M30 35v-11M38 35V13"/><path d="M13 22l8-7 8 5 10-10" stroke-dasharray="2 3"/><path d="M35 9.5l4.5.5-.5 4.5"/>`,
    magnifier: `<circle cx="20" cy="20" r="12"/><path d="M29 29l11.5 11.5"/><path d="M14 18c1-3 3.5-5 6.5-5"/>`,
    pencil: `<path d="M10 38l2.5-9L33 8.5c1.7-1.7 4.5-1.7 6 0 1.6 1.6 1.6 4.3 0 6L18.5 35z"/><path d="M12.5 29l6 6M30 11.5l6 6"/><path d="M8 42.5c6-1 14-.5 22 0"/>`,
    flask: `<path d="M19 6.5h10M21 7v12L10 38.5c-1 2 .4 4 2.6 4h22.8c2.2 0 3.6-2 2.6-4L27 19V7"/><path d="M14 31c4-2 7 2 11 0s6-1 9 0"/><circle cx="22" cy="36" r="1.4"/><circle cx="29" cy="34" r="1"/>`,
    coffee: `<path d="M9 18h25v11c0 7-5 12-12.5 12S9 36 9 29z"/><path d="M34 21h3.5c2.5 0 4 2 4 4.5S39.5 30 37 30h-3"/><path d="M16 12c0-2 2-2 2-4M22 12c0-2 2-2 2-4M28 12c0-2 2-2 2-4"/>`,
    puzzle: `<path d="M9 9h10c-1-6 11-6 10 0h10v10c6-1 6 11 0 10v10H29c1 6-11 6-10 0H9V29c-6 1-6-11 0-10z"/>`,
    book: `<path d="M24 12c-5-4-12-4-17-2v28c5-2 12-2 17 2 5-4 12-4 17-2V10c-5-2-12-2-17 2z"/><path d="M24 12v28"/>`,
    mail: `<rect x="6" y="11" width="36" height="26" rx="3"/><path d="M7 13l17 13 17-13"/>`,
    link: `<path d="M20 28l8-8"/><path d="M17 23l-4 4a6 6 0 008.5 8.5l4-4"/><path d="M31 25l4-4a6 6 0 00-8.5-8.5l-4 4"/>`,
    code: `<path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 9l-6 30"/>`,
    doc: `<path d="M12 6h17l9 9v27H12z"/><path d="M29 6v9h9M18 24h14M18 30h14M18 36h9"/>`,
    arrowR: `<path d="M8 24h30M28 14l10 10-10 10"/>`,
    arrowL: `<path d="M40 24H10M20 14L10 24l10 10"/>`,
  };
  const icon = (name, attrs = "") =>
    `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${ICONS[name] || ""}</svg>`;

  /* ---------------- Progress (explored sections) ---------------- */
  const KEY = "pm-explored";
  const explored = new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  const markExplored = (id) => { explored.add(id); localStorage.setItem(KEY, JSON.stringify([...explored])); };
  function renderProgress() {
    const n = S.pieces.filter((p) => explored.has(p.id)).length;
    $("#progress").innerHTML =
      `<span>${n} / ${S.pieces.length} pieces found</span>
       <span class="progress-dots">${S.pieces
         .map((p) => `<a href="#${p.id}" class="${explored.has(p.id) ? "on" : ""}" style="--c:${C(p.color)}" aria-label="${esc(p.title)}${explored.has(p.id) ? " (explored)" : ""}"></a>`)
         .join("")}</span>`;
  }

  /* =========================================================
     PUZZLE BOARD
     ========================================================= */
  const W = 320, H = 220;
  // Two board layouts: 3×2 on desktop, 2×3 on phones.
  // hEdges[row][col]: +1 = tab bulges down into the piece below. vEdges[row][col]: +1 = tab bulges right.
  const LAYOUTS = {
    desktop: {
      cols: 3, rows: 2, viewBox: "-105 -95 1170 630",
      hEdges: [[1, -1, 1]], vEdges: [[-1, 1], [1, -1]],
      dots: [
        { x: -55, y: 70,  label: "questions", lx: -100, ly: 40,  to: [0, 0] },
        { x: -50, y: 330, label: "people",    lx: -95,  ly: 375, to: [0, 1] },
        { x: 480, y: -55, label: "data",      lx: 455,  ly: -72, to: [1, 0] },
        { x: 1015, y: 120, label: "technology", lx: 960, ly: 85, to: [2, 0] },
        { x: 1012, y: 360, label: "patterns", lx: 975,  ly: 410, to: [2, 1] },
        { x: 440, y: 500, label: "decisions", lx: 460,  ly: 522, to: [1, 1] },
      ],
      loose: [[990, -70, 18, "mustard"], [-100, 440, -24, "pink"]],
    },
    mobile: {
      cols: 2, rows: 3, viewBox: "-40 -75 720 820",
      hEdges: [[1, -1], [-1, 1]], vEdges: [[-1], [1], [-1]],
      dots: [
        { x: 160, y: -48, label: "questions", lx: 185, ly: -50, to: [0, 0] },
        { x: 480, y: -48, label: "data",      lx: 505, ly: -50, to: [1, 0] },
        { x: 160, y: 712, label: "people",    lx: 185, ly: 732, to: [0, 2] },
        { x: 480, y: 712, label: "decisions", lx: 505, ly: 732, to: [1, 2] },
      ],
      loose: [],
    },
  };
  const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
  let L = LAYOUTS.desktop, COLS = 3, ROWS = 2, hEdges = L.hEdges, vEdges = L.vEdges;
  function useLayout(name) { L = LAYOUTS[name]; COLS = L.cols; ROWS = L.rows; hEdges = L.hEdges; vEdges = L.vEdges; }

  // One jigsaw edge from A to B. s: +1 bump outward, -1 inward, 0 straight.
  function edge(A, B, s) {
    if (!s) return `L${B[0]},${B[1]}`;
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const k = Math.min(1, 200 / Math.hypot(dx, dy)); // keep tabs the same size on long edges
    const P = (x0, y0) => {
      const x = 0.5 + (x0 - 0.5) * k, y = y0 * k;
      const px = A[0] + x * dx + y * s * dy;
      const py = A[1] + x * dy - y * s * dx;
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    };
    return [
      `L${P(0.36, 0)}`,
      `C${P(0.42, 0)} ${P(0.44, 0.05)} ${P(0.41, 0.1)}`,
      `C${P(0.36, 0.19)} ${P(0.42, 0.26)} ${P(0.5, 0.26)}`,
      `C${P(0.58, 0.26)} ${P(0.64, 0.19)} ${P(0.59, 0.1)}`,
      `C${P(0.56, 0.05)} ${P(0.58, 0)} ${P(0.64, 0)}`,
      `L${B[0]},${B[1]}`,
    ].join(" ");
  }
  function piecePath(c, r, ox = 0, oy = 0, w = W, h = H, sides) {
    const x0 = ox + c * w, y0 = oy + r * h, x1 = x0 + w, y1 = y0 + h;
    const [t, rt, b, l] = sides || [
      r === 0 ? 0 : -hEdges[r - 1][c],
      c === COLS - 1 ? 0 : vEdges[r][c],
      r === ROWS - 1 ? 0 : hEdges[r][c],
      c === 0 ? 0 : -vEdges[r][c - 1],
    ];
    return `M${x0},${y0} ${edge([x0, y0], [x1, y0], t)} ${edge([x1, y0], [x1, y1], rt)} ${edge([x1, y1], [x0, y1], b)} ${edge([x0, y1], [x0, y0], l)} Z`;
  }

  function boardSVG() {
    useLayout(isMobile() ? "mobile" : "desktop");
    const rand = (a, b) => a + Math.random() * (b - a);
    const pieces = S.pieces.map((p, i) => {
      const c = i % COLS, r = Math.floor(i / COLS);
      const d = piecePath(c, r);
      const x0 = c * W, y0 = r * H, cx = x0 + W / 2, cy = y0 + H / 2;
      const done = explored.has(p.id);
      const lines = p.title.includes(" & ") ? p.title.replace(" & ", "\n& ").split("\n") : [p.title];
      const tY = cy + (lines.length > 1 ? -8 : 6);
      return `
      <g class="piece" tabindex="0" role="link" data-id="${p.id}" aria-label="${esc(p.title)}: ${esc(p.hint)}">
        <g class="piece-inner" style="--sx:${rand(-320, 320).toFixed(0)}px;--sy:${rand(-220, 220).toFixed(0)}px;--sr:${rand(-50, 50).toFixed(0)}deg;--d:${(0.1 + i * 0.09).toFixed(2)}s">
          <clipPath id="clip-${i}"><path d="${d}"/></clipPath>
          <path class="shape" d="${d}" style="fill:${C(p.color)}"/>
          <path class="shine" d="${d}" clip-path="url(#clip-${i})"/>
          <text class="num" x="${x0 + 26}" y="${y0 + 46}">${p.num}</text>
          <svg class="icon" x="${x1(x0) - 66}" y="${y0 + 20}" width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[p.icon]}</svg>
          ${lines.map((ln, k) => `<text class="ttl" x="${cx}" y="${tY + k * 30}" text-anchor="middle">${esc(ln)}</text>`).join("")}
          <text class="hint" x="${cx}" y="${tY + (lines.length - 1) * 30 + 26}" text-anchor="middle">${esc(p.hint)}</text>
          <text class="go" x="${x0 + W - 22}" y="${y0 + H - 22}" text-anchor="end">open →</text>
          ${done ? `<text class="stamp" x="${x0 + 26}" y="${y0 + H - 24}">✓ explored</text>` : ""}
        </g>
      </g>`;
    });
    function x1(x0) { return x0 + W; }

    const threads = L.dots.map((dt) => {
      const [c, r] = dt.to;
      const tx = c * W + W / 2 + (dt.x < 0 ? -W / 2 + 18 : dt.x > COLS * W ? W / 2 - 18 : 0);
      const ty = r * H + H / 2 + (dt.y < 0 ? -H / 2 + 18 : dt.y > ROWS * H ? H / 2 - 18 : 0);
      const mx = (dt.x + tx) / 2 + (dt.y - ty) * 0.25, my = (dt.y + ty) / 2 - (dt.x - tx) * 0.25;
      return `<path class="thread" d="M${dt.x},${dt.y} Q${mx.toFixed(0)},${my.toFixed(0)} ${tx},${ty}"/>
        <circle class="dot" cx="${dt.x}" cy="${dt.y}" r="9"/><circle class="dot-core" cx="${dt.x}" cy="${dt.y}" r="3.5"/>
        <text class="dot-label" x="${dt.lx}" y="${dt.ly}">${dt.label}</text>`;
    });

    // two loose pieces drifting off the board
    const loose = (x, y, rot, color, sides) =>
      `<g transform="translate(${x},${y}) rotate(${rot})"><g class="doodle-svg"><path d="${piecePath(0, 0, 0, 0, 56, 50, sides)}" fill="${C(color)}" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/></g></g>`;

    return `
    <svg class="board" viewBox="${L.viewBox}" role="group" aria-label="Interactive puzzle board with six sections">
      <g class="dots-group">${threads.join("")}
        ${L.loose.map(([x, y, r, col], i) => loose(x, y, r, col, i ? [0, 1, 1, -1] : [1, -1, 0, 1])).join("")}
      </g>
      ${pieces.join("")}
    </svg>`;
  }

  function renderHome() {
    const n = S.pieces.filter((p) => explored.has(p.id)).length;
    const h = esc(S.home.headline)
      .replace("business", '<span class="u">business</span>')
      .replace("data", "<em>data</em>")
      .replace("AI", '<span class="u">AI</span>');
    view.innerHTML = `
    <div class="wrap wrap-wide page">
      <section class="home">
        <div class="home-copy">
          <span class="eyebrow">${esc(S.tagline)}</span>
          <h1>${h}</h1>
          <p class="support">${esc(S.home.support)}</p>
          <p class="annotation">${esc(S.home.annotation)}
            <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 40c18 10 46 8 64-10 6-6 10-12 12-18"/><path d="M70 14l10-3 3 10"/></svg>
          </p>
          <div class="instruction">
            <span class="pill"><i></i>${esc(S.home.instruction)}</span>
          </div>
          <p class="explored-count">${n === 0 ? "0 of 6 pieces found — pick one to start" : n === 6 ? "All 6 pieces found. The picture's complete!" : `${n} of 6 pieces found — keep going`}</p>
        </div>
        <div class="board-wrap" id="boardWrap">
          ${boardSVG()}
          <span class="doodle" style="left:-2%;top:-6%;width:46px;--r:-14deg">${icon("bulb")}</span>
          <span class="doodle" style="right:3%;bottom:-4%;width:50px;--r:8deg;animation-delay:-2s">${icon("coffee")}</span>
          <span class="doodle" style="right:-3%;top:40%;width:40px;--r:20deg;animation-delay:-4s">${icon("pencil")}</span>
          <span class="doodle" style="left:30%;bottom:-6%;width:42px;--r:-6deg;animation-delay:-1s">${icon("book")}</span>
        </div>
      </section>
    </div>`;

    const svg = $(".board", view);
    // assemble animation
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add("assembled")));
    setTimeout(() => svg.classList.add("settled"), 1900);

    svg.querySelectorAll(".piece").forEach((g) => {
      const go = () => (location.hash = g.dataset.id);
      g.addEventListener("click", go);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  /* =========================================================
     SECTION PAGES
     ========================================================= */
  function shell(id, title, intro, body) {
    const p = S.pieces.find((x) => x.id === id);
    const idx = S.pieces.indexOf(p);
    const next = S.pieces[idx + 1];
    const nextHTML = next
      ? `<a class="next-piece" href="#${next.id}" style="--c:${C(next.color)}"><div><small>next piece · ${next.num}</small><strong>${esc(next.title)}</strong></div><span class="arrow">${icon("arrowR", 'width="26"')}</span></a>`
      : `<a class="next-piece" href="#board" style="--c:${C("sage")}"><div><small>that's the last piece</small><strong>Back to the full picture</strong></div><span class="arrow">${icon("puzzle", 'width="26"')}</span></a>`;
    return `
    <div class="wrap page section" style="--c:${C(p.color)};--c-deep:${DEEP[p.color]}">
      <a class="back" href="#board">${icon("arrowL")} Back to the board</a>
      <header class="section-head">
        <span class="section-num">${p.num}</span>
        <span class="kicker">${esc(p.title)}</span>
        <h1>${esc(title)}</h1>
        ${intro ? `<p class="section-intro">${esc(intro)}</p>` : ""}
      </header>
      ${body}
      ${nextHTML}
    </div>`;
  }

  const renderers = {
    story() {
      const d = S.story;
      const pillarColors = ["sage", "mustard", "terracotta"];
      return shell("story", d.title, d.intro, `
        <div class="pillars">
          ${d.pillars.map((p, i) => `
            <article class="pillar" style="--c:${C(pillarColors[i % 3])};--c-deep:${DEEP[pillarColors[i % 3]]}">
              <div class="ico">${icon(p.icon)}</div>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.text)}</p>
              <span class="note">${esc(p.note)}</span>
            </article>`).join("")}
        </div>
        <div class="two-col">
          <div>
            <h2 class="sub-h">Where I learned</h2>
            <div class="timeline">
              ${d.education.map((e, i) => `
                <div class="tl-item" style="--c:${C(i ? "mustard" : "blue")}">
                  <span class="yrs">${esc(e.years)}</span>
                  <h3>${esc(e.school)}</h3>
                  <p>${esc(e.degree)}</p>
                  <span class="note">${esc(e.note)}</span>
                </div>`).join("")}
            </div>
          </div>
          <div>
            <h2 class="sub-h">Off the clock</h2>
            <div class="pinboard">
              ${d.personal.map((x, i) => `
                <div class="sticky" style="--c:${C(x.color)};--r:${[-2.5, 1.8, 1.2, -1.6][i % 4]}deg">
                  <div class="lbl">${esc(x.label)}</div>
                  <div class="val">${esc(x.value)}</div>
                </div>`).join("")}
            </div>
          </div>
        </div>`);
    },

    experience() {
      const d = S.experience;
      return shell("experience", d.title, d.intro, `
        <div class="journey">
          <div class="journey-path" style="border-left:2px dashed var(--line)"></div>
          ${d.chapters.map((ch, i) => `
            <section class="chapter" style="--c:${C(ch.color)}">
              <div class="chapter-dot">${String(i + 1).padStart(2, "0")}</div>
              <div class="chapter-head"><h2>${esc(ch.company)}</h2><span class="role">${esc(ch.role)}</span></div>
              <div class="meta"><span class="tag">${esc(ch.period)}</span><span class="tag">${esc(ch.context)}</span></div>
              <p class="summary">${esc(ch.summary)}</p>
              <div class="metrics">
                ${ch.metrics.map((m) => `<div class="metric"><div class="v">${esc(m.value)}</div><div class="l">${esc(m.label)}</div></div>`).join("")}
              </div>
              <div class="projects">
                ${ch.projects.map((p) => `<details class="proj"><summary>${esc(p.title)}<span class="plus">+</span></summary><p>${esc(p.text)}</p></details>`).join("")}
              </div>
            </section>`).join("")}
        </div>`);
    },

    cases() {
      const d = S.cases;
      return shell("cases", d.title, d.intro, `
        <div class="case-grid">
          ${d.items.map((c, i) => `
            <button class="case" data-case="${i}" style="--c:${C(c.color)}">
              <div class="case-visual">${c.image ? `<img src="${esc(c.image)}" alt="">` : dotsArt(i)}</div>
              <div class="case-body">
                <span class="tag">${esc(c.tag)}</span>
                <h3>${esc(c.title)}</h3>
                <p>${esc(c.problem)}</p>
                <div class="open">see how the pieces fit →</div>
              </div>
            </button>`).join("")}
        </div>`);
    },

    toolkit() {
      const d = S.toolkit;
      return shell("toolkit", d.title, d.intro, `
        <div class="filters">
          <button class="filter on" data-filter="all">All pieces</button>
          ${d.groups.map((g, i) => `<button class="filter" data-filter="${i}">${esc(g.name)}</button>`).join("")}
        </div>
        <div class="toolkit-layout">
          <div>
            ${d.groups.map((g, i) => `
              <div class="tk-group" data-group="${i}" style="--c:${C(g.color)}">
                <h3>${esc(g.name)}</h3>
                <div class="tk-items">
                  ${g.items.map((t, j) => `<button class="tk" data-g="${i}" data-t="${j}">${esc(t.name)}</button>`).join("")}
                </div>
              </div>`).join("")}
          </div>
          <aside class="tk-note" id="tkNote" aria-live="polite">
            <div class="k">How I use it</div>
            <h4>Pick a piece</h4>
            <p>hover or tap any tool to see where it fits in how I work</p>
          </aside>
        </div>`);
    },

    experiments() {
      const d = S.experiments;
      const statusColor = { Building: "terracotta", Prototype: "mustard", Exploring: "blue", Shipped: "sage", Idea: "pink" };
      return shell("experiments", d.title, d.intro, `
        <div class="lab">
          ${d.items.map((x, i) => {
            const tag = x.link ? "a" : "article";
            return `<${tag} class="exp" ${x.link ? `href="${esc(x.link)}" target="_blank" rel="noopener"` : ""} style="--c:${C(statusColor[x.status] || "sage")};--r:${[-1, .8, -.5, 1.1, -.9, .6][i % 6]}deg;text-decoration:none">
              <span class="status"><i></i>${esc(x.status)}</span>
              <h3>${esc(x.title)}</h3>
              <span class="kind">${esc(x.kind)}</span>
              <p>${esc(x.text)}</p>
            </${tag}>`;
          }).join("")}
        </div>`);
    },

    connect() {
      const d = S.connect;
      const colors = ["terracotta", "blue", "sage", "mustard"];
      const p = S.pieces.find((x) => x.id === "connect");
      const html = shell("connect", "", "", `
        <div class="connect">
          <div>
            <h1>Let's connect <em>the dots.</em></h1>
            <p class="lead">${esc(d.text)}</p>
          </div>
          <div class="links">
            ${d.links.map((l, i) => `
              <a class="link-card" href="${esc(l.href)}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} style="--c:${C(colors[i % 4])}">
                <span class="ico">${icon(l.icon)}</span>
                <div><small>${esc(l.label)}</small><span>${esc(l.value)}</span></div>
                ${icon("arrowR", 'width="22"')}
              </a>`).join("")}
          </div>
        </div>
        <div class="final-note"><span class="hand">thanks for putting the pieces together with me ✦</span></div>`);
      // the connect page uses its own big headline instead of the shared one
      return html.replace(/<header class="section-head">[\s\S]*?<\/header>/, `<header class="section-head" style="margin-bottom:10px"><span class="section-num">${p.num}</span><span class="kicker">${esc(p.title)}</span></header>`);
    },
  };

  // abstract "connecting the dots" art for case cards without screenshots
  function dotsArt(seed) {
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const pts = Array.from({ length: 9 }, () => [20 + rnd() * 360, 20 + rnd() * 150]);
    const path = pts.slice(0, 6).sort((a, b) => a[0] - b[0]).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(0)},${p[1].toFixed(0)}`).join(" ");
    return `<svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="${path}" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 6" stroke-linecap="round"/>
      ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i < 6 ? 7 : 4}" fill="${i < 6 ? "var(--paper)" : "var(--ink)"}" stroke="var(--ink)" stroke-width="1.5" opacity="${i < 6 ? 1 : .35}"/>`).join("")}
    </svg>`;
  }

  /* ---------------- Section-specific interactions ---------------- */
  function wireCases() {
    view.querySelectorAll(".case").forEach((b) =>
      b.addEventListener("click", () => {
        const c = S.cases.items[+b.dataset.case];
        openModal(`
          <div style="--c-deep:${DEEP[c.color]}">
            <span class="tag">${esc(c.tag)}</span>
            <h2 id="modal-title">${esc(c.title)}</h2>
            <div class="shot">${c.image ? `<img src="${esc(c.image)}" alt="">` : `<span class="hand" style="font-size:24px">screenshot / visual goes here<br><small style="font-family:var(--sans);font-size:13px">set <code>image</code> in content.js</small></span>`}</div>
            <div class="chain">
              <div class="chain-step"><span class="k">The problem</span><p>${esc(c.problem)}</p></div>
              <div class="chain-step"><span class="k">The pieces</span><div class="chips">${c.pieces.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div></div>
              <div class="chain-step"><span class="k">The pattern</span><p>${esc(c.pattern)}</p></div>
              <div class="chain-step"><span class="k">The decision</span><p>${esc(c.decision)}</p></div>
              <div class="chain-step"><span class="k">The outcome</span><p>${esc(c.outcome)}</p></div>
            </div>
          </div>`);
      })
    );
  }
  function wireToolkit() {
    const note = $("#tkNote");
    const show = (b) => {
      const g = S.toolkit.groups[+b.dataset.g], t = g.items[+b.dataset.t];
      view.querySelectorAll(".tk.on").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      note.style.borderColor = "var(--ink)";
      note.innerHTML = `<div class="k">${esc(g.name)}</div><h4>${esc(t.name)}</h4><p>${esc(t.use)}</p>`;
    };
    view.querySelectorAll(".tk").forEach((b) => { b.addEventListener("mouseenter", () => show(b)); b.addEventListener("click", () => show(b)); b.addEventListener("focus", () => show(b)); });
    view.querySelectorAll(".filter").forEach((f) =>
      f.addEventListener("click", () => {
        view.querySelectorAll(".filter").forEach((x) => x.classList.toggle("on", x === f));
        view.querySelectorAll(".tk-group").forEach((g) => g.classList.toggle("dim", f.dataset.filter !== "all" && g.dataset.group !== f.dataset.filter));
      })
    );
  }

  /* ---------------- Modal ---------------- */
  const modal = $("#modal");
  let lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    $("#modal-body").innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal-close", modal).focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------------- Router ---------------- */
  function route() {
    const id = location.hash.replace("#", "") || "board";
    if (!modal.hidden) closeModal();
    if (renderers[id]) {
      markExplored(id);
      view.innerHTML = renderers[id]();
      if (id === "cases") wireCases();
      if (id === "toolkit") wireToolkit();
    } else {
      renderHome();
    }
    renderProgress();
    window.scrollTo({ top: 0, behavior: "instant" });
    view.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  window.matchMedia("(max-width: 640px)").addEventListener("change", () => { if (!renderers[location.hash.slice(1)]) renderHome(); });
  route();
})();
