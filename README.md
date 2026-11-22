# Prerana Munipalli — Portfolio

"Connecting the Dots: From Data to Decisions." A static site with no build step.

## Edit content
Most text, metrics and links live in **`js/content.js`**. Search for `[EDIT]` to find the placeholders.
- Case study images: put them in `assets/images/` and set `image: "assets/images/file.png"`.
- Resume: save a public PDF as `assets/resume.pdf`.

## Run locally
```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Privacy
`.gitignore` blocks `.env*`, keys, `private/`, `drafts/`, and `.docx`/`.pages` files.
Put anything you don't want online in a `private/` folder.
