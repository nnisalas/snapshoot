import { COLORS, THEMES, FILTERS } from './data.js';
import { slotRect, NATIVE_W, NATIVE_H } from './geometry.js';

import { welcomeScreen } from './screens/welcome.js';
import { howScreen } from './screens/how.js';
import { frameScreen } from './screens/frame.js';
import { captureScreen } from './screens/capture.js';
import { filterScreen } from './screens/filter.js';
import { captionScreen } from './screens/caption.js';
import { doneScreen } from './screens/done.js';

const SCREENS = {
  welcome: welcomeScreen,
  how: howScreen,
  frame: frameScreen,
  capture: captureScreen,
  filter: filterScreen,
  caption: captionScreen,
  done: doneScreen,
};

function initialState() {
  return {
    screen: 'welcome',
    tab: 'color',
    color: 0,
    theme: 0,
    filter: 0,
    photos: [null, null, null, null],
    capturing: false,
    countdown: null,
    activeIndex: null,
    camError: false,
    caption: '',
    date: '',
  };
}

export class App {
  constructor(stageEl) {
    this.stage = stageEl;
    this.state = initialState();
    this.stream = null;
    this.videoEl = null;
    this.mounted = null; // currently mounted screen module (for its `update`, if any)
    this.toastTimer = null;
    this._mountScreen();
  }

  // ---- state / rendering ----------------------------------------------

  setState(patch) {
    const prevScreen = this.state.screen;
    this.state = { ...this.state, ...(typeof patch === 'function' ? patch(this.state) : patch) };
    if (this.state.screen !== prevScreen) {
      this._mountScreen();
    } else if (this.mounted && typeof this.mounted.update === 'function') {
      this.mounted.update(this);
    } else {
      this._mountScreen();
    }
  }

  _mountScreen() {
    this.videoEl = null;
    this.stage.innerHTML = '';
    const mod = SCREENS[this.state.screen];
    this.mounted = mod;
    const el = mod.mount(this);
    this.stage.appendChild(el);
  }

  // ---- derived data ------------------------------------------------------

  frameFile() {
    const s = this.state;
    return s.tab === 'theme' ? THEMES[s.theme].file : COLORS[s.color].file;
  }

  // Optional transparent-background layer for frames whose decorations
  // overlap the photo slots — composited above the photos. Most frames
  // don't have one, so this is often undefined.
  frameOverlay() {
    const s = this.state;
    return s.tab === 'theme' ? THEMES[s.theme].overlay : COLORS[s.color].overlay;
  }

  filterCss() {
    return FILTERS[this.state.filter].css;
  }

  filterName() {
    return FILTERS[this.state.filter].name;
  }

  today() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}-${dd}-${d.getFullYear()}`;
  }

  slotRect(i, dispW) {
    return slotRect(i, dispW);
  }

  // ---- camera --------------------------------------------------------

  async startCamera() {
    if (this.stream) return;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('unsupported');
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
        this.videoEl.play && this.videoEl.play();
      }
      this.setState({ camError: false });
    } catch (e) {
      this.setState({ camError: true });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }

  wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  snap() {
    const v = this.videoEl;
    if (!v || !v.videoWidth) return null;
    const W = 283, H = 358, tr = W / H;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    const vr = v.videoWidth / v.videoHeight;
    let sw, sh, sx, sy;
    if (vr > tr) {
      sh = v.videoHeight; sw = sh * tr; sx = (v.videoWidth - sw) / 2; sy = 0;
    } else {
      sw = v.videoWidth; sh = sw / tr; sx = 0; sy = (v.videoHeight - sh) / 2;
    }
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, W, H);
    return c.toDataURL('image/jpeg', 0.9);
  }

  async runSequence() {
    if (this.state.capturing) return;
    if (!this.stream || this.state.camError) {
      await this.startCamera();
      if (this.state.camError) return;
    }
    let photos = this.state.photos.slice();
    if (photos.every((p) => p)) {
      photos = [null, null, null, null];
      this.setState({ photos });
      await this.wait(60);
    }
    this.setState({ capturing: true });
    for (let i = 0; i < 4; i++) {
      if (photos[i]) continue;
      this.setState({ activeIndex: i });
      for (let n = 5; n >= 1; n--) {
        this.setState({ countdown: n });
        await this.wait(1000);
      }
      const img = this.snap();
      photos[i] = img || photos[i];
      this.setState({ photos: photos.slice(), countdown: null });
      await this.wait(450);
    }
    this.setState({ capturing: false, countdown: null, activeIndex: null });
    if (photos.every((p) => p)) {
      await this.wait(450);
      this.stopCamera();
      this.setState({ screen: 'filter' });
    }
  }

  // ---- export ----------------------------------------------------------

  loadImg(src) {
    return new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = src;
    });
  }

  // Relative luminance (WCAG), used to pick a caption/date color that stays
  // readable against light frame footers (white, blue, green, pink, lavender)
  // instead of always defaulting to white.
  _lum(hex) {
    const n = hex.replace('#', '');
    const rgb = [0, 2, 4]
      .map((i) => parseInt(n.substr(i, 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  captionColor() {
    const s = this.state;
    const bg = s.tab === 'theme' ? THEMES[s.theme].footerColor || '#ffffff' : COLORS[s.color].hex;
    return this._lum(bg) > 0.4 ? '#1a1a1a' : '#ffffff';
  }

  async exportImage() {
    const SO = 2;
    const OW = Math.round(NATIVE_W * SO);
    const OH = Math.round(NATIVE_H * SO);
    const c = document.createElement('canvas');
    c.width = OW;
    c.height = OH;
    const ctx = c.getContext('2d');
    try {
      const frameImg = await this.loadImg(this.frameFile());
      const css = this.filterCss();
      ctx.drawImage(frameImg, 0, 0, OW, OH);
      for (let i = 0; i < 4; i++) {
        const p = this.state.photos[i];
        if (!p) continue;
        const r = this.slotRect(i, NATIVE_W);
        const pim = await this.loadImg(p);
        ctx.save();
        ctx.filter = css;
        ctx.drawImage(pim, r.left * SO, r.top * SO, r.w * SO, r.h * SO);
        ctx.restore();
      }
      ctx.filter = 'none';
      const overlaySrc = this.frameOverlay();
      if (overlaySrc) {
        const overlayImg = await this.loadImg(overlaySrc);
        ctx.drawImage(overlayImg, 0, 0, OW, OH);
      }
      try { await document.fonts.load(`${19 * SO}px Pangolin`); } catch {}
      ctx.fillStyle = this.captionColor();
      ctx.font = `${19 * SO}px Pangolin, cursive`;
      const tx = 30 * SO;
      ctx.fillText(this.state.date, tx, 470 * SO);
      if (this.state.caption) ctx.fillText(this.state.caption, tx, 497 * SO);
      const url = c.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = url;
      a.download = 'snapshoot.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.showToast('Saved to your device!');
    } catch (e) {
      console.warn('export failed', e);
      this.showToast("Couldn't export — try again");
    }
  }

  showToast(msg) {
    let el = this.stage.querySelector('.toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove('visible'), 2200);
  }
}
