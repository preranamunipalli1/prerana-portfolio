/* Tiny synthesized sounds (no audio files). Off by default. */
let ctx = null;
let enabled = false;

function ac() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); return ctx; }
function noise(c, dur) {
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b; return s;
}

export const Sound = {
  get on() { return enabled; },
  toggle() { enabled = !enabled; if (enabled) { ac(); Sound.click(); } return enabled; },

  // soft wooden "snap" when a piece lands
  click(vol = 0.5) {
    if (!enabled) return;
    const c = ac(), t = c.currentTime;
    const n = noise(c, 0.05), bp = c.createBiquadFilter(), g = c.createGain();
    bp.type = "bandpass"; bp.frequency.value = 2200; bp.Q.value = 1.4;
    g.gain.setValueAtTime(vol * 0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(bp).connect(g).connect(c.destination); n.start(t);
    const o = c.createOscillator(), og = c.createGain();
    o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.08);
    og.gain.setValueAtTime(vol * 0.6, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(og).connect(c.destination); o.start(t); o.stop(t + 0.1);
  },

  // papery swish when a panel opens
  page() {
    if (!enabled) return;
    const c = ac(), t = c.currentTime;
    const n = noise(c, 0.45), bp = c.createBiquadFilter(), g = c.createGain();
    bp.type = "bandpass"; bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(700, t); bp.frequency.exponentialRampToValueAtTime(3200, t + 0.32);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.08); g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    n.connect(bp).connect(g).connect(c.destination); n.start(t);
  },

  // lamp switch
  switch() { Sound.click(0.35); },
};
