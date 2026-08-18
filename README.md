# Snapshoot 📸

A portable, K-pop mall-style photobooth — pick a frame, snap four photos in a
row with a live countdown, apply a filter, add a caption, then download or
share the finished photo strip. Runs in any modern browser, mobile or
desktop — no app store, no build step, no dependencies.

## Run it

You need a local web server because camera access (`getUserMedia`) requires
a secure context — opening `index.html` directly with `file://` won't work,
but `http://localhost` counts as secure so any of these are fine:

```bash
npm start
```

Or, without Node:

```bash
python3 -m http.server 8080
```

Then open the printed URL (e.g. `http://localhost:8080`) — on a phone, use
your computer's LAN IP over **https** (or a tunnel like `ngrok`/Cloudflare
Tunnel), since mobile browsers only treat `localhost` itself as secure.

Allow camera access when prompted. If it doesn't auto-start, tap "Tap to
enable camera" (browsers require a real tap/click to trigger the permission
prompt).

## How it works

Flow: `welcome → how → frame → capture → filter → caption → done`

1. **Welcome** — landing screen.
2. **How it Works** — explains the 4 steps.
3. **Frame Theme** — pick a frame color (7) or themed frame (2).
4. **Snapshoot** — tap the shutter; a 5-second countdown runs for each of
   4 photos, mirrored live preview, auto-advances to Filter once all 4 are
   captured.
5. **Filter** — apply one of 7 filters to all four photos at once.
6. **Add Caption** — type a caption (40 chars max).
7. **Your Snapshoot** — preview the finished strip with date + caption
   burned in, then Download & Share (downloads a PNG) or Take Another
   (returns to Frame Theme so you can pick a new frame).

Nothing is uploaded or stored anywhere — photos live only in memory for the
current session and are discarded on refresh.

## Project structure

```
index.html            entry HTML — loads fonts, styles, src/main.js
src/
  main.js              boots the app, fits the 390×844 "stage" to the viewport
  app.js               App class: state, camera, capture sequence, export/share
  data.js              frame colors/themes + filter presets (from the design spec)
  geometry.js          shared photo-slot geometry for every frame
  components.js        small reusable DOM builders (buttons, titles, frame preview)
  dom.js               tiny h() DOM-builder helper (no framework)
  style.css
  screens/             one module per screen (welcome, how, frame, capture,
                        filter, caption, done)
assets/                frame art, stickers, title wordmarks, buttons (SVG/PNG)
server.js              zero-dependency static file server (`npm start`)
```

## Adding a new frame

Add an entry to `COLORS` or `THEMES` in [src/data.js](src/data.js) pointing
at an image in `assets/` — that's it for a simple frame. Two things to know:

- **Slot geometry is shared by every frame.** All frame art must place its 4
  photo-slot cutouts at the exact same position/size (see
  [src/geometry.js](src/geometry.js) — `XS`/`YS`/`SLOT_W`/`SLOT_H` on a
  343×563 canvas). If a new frame needs different slot placement, that
  formula needs to become per-frame instead of shared.
- **Decorations that overlap a photo slot need a separate overlay layer.**
  The frame image itself always renders *behind* photos (so captured photos
  cover it) — that's correct for the empty-slot placeholder look, but it
  means any decoration drawn to intentionally stick out over a slot (e.g. a
  star poking over a corner) gets covered once that slot is filled. Fix:
  export that decoration separately as a transparent-background image at the
  same canvas size and position, and add it as `overlay` on the `data.js`
  entry. It gets composited above the photos/video everywhere — capture,
  filter, caption, done, and the final export — automatically; no other
  code changes needed. Frames
  without overlapping decorations can just omit `overlay`.

## Notes on the implementation

- Pure vanilla JS/HTML/CSS, no build step and no npm dependencies — genuinely
  portable, copy the folder anywhere and serve it.
- The whole UI is laid out on a fixed 390×844 design canvas (the "stage")
  that's uniformly scaled with a CSS transform to fit any viewport: on phones
  it fills close to edge-to-edge, on desktop it renders as a centered
  phone-shaped card, matching the original design mockups.
- The capture screen keeps its `<video>` element alive across re-renders
  (countdown ticks every second) instead of tearing it down each time, to
  avoid camera flicker/reconnect.
- Recreated from a high-fidelity HTML/CSS design handoff (colors, type,
  spacing, filter values, slot geometry, and export logic all ported
  1:1) — not a copy of the original prototype's runtime, just its exact
  visual spec.
