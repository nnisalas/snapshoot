import { h, px } from '../dom.js';
import { titleWithClovers, overlayNodes } from '../components.js';

function videoStyleFor(app) {
  const s = app.state;
  const firstEmpty = s.photos.findIndex((p) => !p);
  const idx = s.capturing ? s.activeIndex : firstEmpty === -1 ? null : firstEmpty;
  if (idx == null || s.camError) return { display: 'none' };
  const r = app.slotRect(idx, 300);
  return {
    display: 'block',
    left: px(r.left), top: px(r.top), width: px(r.w), height: px(r.h),
  };
}

export const captureScreen = {
  mount(app) {
    const s = app.state;

    const frameArt = h('img', {
      class: 'frame-art',
      src: app.frameFile(),
      alt: 'Frame',
      style: { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' },
    });
    const photosLayer = h('div', { class: 'photos-layer' });

    const video = h('video', {
      class: 'live-video',
      autoplay: true,
      playsInline: true,
      muted: true,
      style: videoStyleFor(app),
    });
    video.setAttribute('playsinline', '');

    // Decorations that overlap the photo slots — kept above the photos and
    // live video, same as the static frame previews on later screens.
    const frameOverlayNodes = overlayNodes(app.frameOverlay(), 300);

    const countdownOverlay = h('div', { class: 'countdown-overlay', style: { display: 'none' } });

    const camFallback = h(
      'button',
      { class: 'cam-fallback', style: { display: 'none' }, onClick: () => app.startCamera() },
      h('img', { src: 'assets/camera-btn.svg', alt: '' }),
      'Tap to enable camera'
    );

    const frameBox = h(
      'div',
      {
        style: {
          position: 'absolute', top: px(150), left: px(45), width: px(300), height: px(492),
          borderRadius: px(8), overflow: 'hidden',
        },
      },
      frameArt, photosLayer, video, frameOverlayNodes, countdownOverlay, camFallback
    );

    const shutter = h(
      'button',
      { class: 'shutter-btn', 'aria-label': 'Take photos', onClick: () => app.runSequence() },
      h('img', { src: 'assets/camera-btn.svg', alt: '' })
    );

    app.videoEl = video;
    if (app.stream) {
      video.srcObject = app.stream;
      video.play && video.play();
    }

    app._captureRefs = { photosLayer, video, countdownOverlay, camFallback };

    const el = h(
      'div',
      { class: 'screen' },
      titleWithClovers({
        top: 70,
        titleSrc: 'assets/title-snapshoot.png',
        titleAlt: 'Snapshoot!',
        titleW: 230,
        cloverTL: { top: -22, right: -14, w: 30 },
        cloverBR: { bottom: -16, left: -30, w: 30 },
      }),
      frameBox,
      shutter
    );

    captureScreen.update(app);
    return el;
  },

  update(app) {
    const s = app.state;
    const refs = app._captureRefs;
    if (!refs) return;

    Object.assign(refs.video.style, videoStyleFor(app));

    refs.photosLayer.innerHTML = '';
    s.photos.forEach((p, i) => {
      if (!p) return;
      const r = app.slotRect(i, 300);
      refs.photosLayer.appendChild(
        h('img', {
          class: 'photo-overlay',
          src: p,
          alt: '',
          style: { left: px(r.left), top: px(r.top), width: px(r.w), height: px(r.h) },
        })
      );
    });

    const showCountdown = s.capturing && s.countdown >= 1;
    if (showCountdown) {
      const r = app.slotRect(s.activeIndex == null ? 0 : s.activeIndex, 300);
      Object.assign(refs.countdownOverlay.style, {
        display: 'flex', left: px(r.left), top: px(r.top), width: px(r.w), height: px(r.h),
      });
      refs.countdownOverlay.textContent = String(s.countdown);
    } else {
      refs.countdownOverlay.style.display = 'none';
    }

    refs.camFallback.style.display = s.camError ? 'flex' : 'none';
  },
};
