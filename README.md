# Prerana Munipalli — The Puzzle Table

An interactive 3D portfolio: a cozy desk with a half-finished jigsaw puzzle.
Six loose pieces = six sections. Place a piece → the camera zooms in, that part of the
picture fills in, and the section opens. Finish all six to reveal the full picture and unlock the resume.

Built with plain HTML/CSS/JS + Three.js (loaded from a CDN). No build step.

## Edit content
Most text lives in **`js/content.js`**. Search for `[EDIT]` to find the placeholders.
- **Sections**: `story`, `experience`, `cases`, `toolkit`, `experiments`, `connect`
- **Table objects / hobbies** (sticky-note clues): `hobbies`, `objectTeasers`
- **Coffee mug card**: `coffee` (add a booking link in `calendar` if you like)
- **Just the highlights** (one-page recruiter view): `highlights`
- **Puzzle picture**: set `puzzleImage: "assets/images/your-image.jpg"` (landscape, ~3:2).
  Leave it `""` to use the illustrated placeholder drawn in `js/textures.js`.
- **Resume**: save a public PDF as `assets/resume.pdf`.

## Files
- `js/scene.js` — the 3D table, puzzle, props, camera, animations
- `js/textures.js` — canvas-drawn textures (picture, wood, sudoku, notebook…)
- `js/main.js` — UI: panel, sticky notes, cards, lamp/night, sound, routing
- `js/sections.js` — HTML for each section, highlights page and cards
- `js/sound.js` — tiny synthesized sounds (off by default)

## Run locally
```bash
python3 -m http.server 5173
# open http://localhost:5173
```
Tip: "↺ scramble" in the bottom menu resets the puzzle.

## Privacy
`.gitignore` blocks `.env*`, keys, `private/`, `drafts/`, and `.docx`/`.pages` files.
Put anything you don't want online in a `private/` folder.
