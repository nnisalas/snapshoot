import { h, px } from './dom.js';
import { slotRect, NATIVE_W } from './geometry.js';

/**
 * Decorations that overlap the photo slots, composited above the photos.
 * `overlay` is either:
 *   - a single full-canvas transparent image (string src), or
 *   - an array of individually-positioned pieces: { src, left, top, w, h, rotate? }
 *     in native 343x563 units, each its own small image (avoids having to
 *     merge multiple source SVGs into one file).
 * Returns DOM nodes scaled to whatever `dispW` a given screen displays at.
 */
export function overlayNodes(overlay, dispW) {
  if (!overlay) return [];
  if (typeof overlay === 'string') {
    return [h('img', { class: 'frame-overlay', src: overlay, alt: '' })];
  }
  const sc = dispW / NATIVE_W;
  return overlay.map((p) => {
    const style = {
      left: px(p.left * sc),
      top: px(p.top * sc),
      width: px(p.w * sc),
      height: px(p.h * sc),
    };
    if (p.rotate) style.transform = `rotate(${p.rotate}deg)`;
    return h('img', { class: 'frame-overlay-piece', src: p.src, alt: '', style });
  });
}

/** The recurring bottom-pinned teal pill button (welcome / how / frame). */
export function primaryButton(label, onClick) {
  return h('button', { class: 'btn-primary', onClick }, label);
}

/** A PNG-wordmark button (Confirm / Finish / Download & Share / Take Another). */
export function imageButton({ src, alt, top, bottom, height, onClick }) {
  const style = { height: px(height) };
  if (top != null) style.top = px(top);
  if (bottom != null) style.bottom = px(bottom);
  return h(
    'button',
    { class: 'btn-image', style, onClick, 'aria-label': alt },
    h('img', { src, alt })
  );
}

/** Title wordmark with two clover accents positioned relative to the title itself. */
export function titleWithClovers({ top, titleSrc, titleAlt, titleW, cloverTL, cloverBR }) {
  const rel = h(
    'div',
    { class: 'rel' },
    h('img', {
      class: 'clover',
      src: 'assets/clover.svg',
      alt: '',
      style: { top: px(cloverTL.top), right: px(cloverTL.right), width: px(cloverTL.w) },
    }),
    h('img', {
      class: 'clover',
      src: 'assets/clover.svg',
      alt: '',
      style: { bottom: px(cloverBR.bottom), left: px(cloverBR.left), width: px(cloverBR.w) },
    }),
    h('img', { class: 'title-img', src: titleSrc, alt: titleAlt, style: { width: px(titleW) } })
  );
  return h('div', { class: 'title-wrap', style: { top: px(top) } }, rel);
}

/** A static (non-live) frame preview showing the frame art + captured photos. */
export function framePreview({ left, top, w, h: hgt, frameSrc, photos, dispW, filterCss, overlay }) {
  const container = h('div', {
    class: 'frame-preview',
    style: { left: px(left), top: px(top), width: px(w), height: px(hgt) },
  });
  container.appendChild(h('img', { class: 'frame-art', src: frameSrc, alt: 'Frame' }));
  photos.forEach((p, i) => {
    if (!p) return;
    const r = slotRect(i, dispW);
    container.appendChild(
      h('img', {
        class: 'photo-overlay',
        src: p,
        alt: '',
        style: {
          left: px(r.left),
          top: px(r.top),
          width: px(r.w),
          height: px(r.h),
          filter: filterCss || 'none',
        },
      })
    );
  });
  // Decorations that overlap the photo slots (e.g. stars poking over a
  // corner) live in a separate transparent layer so they stay visible on
  // top of captured photos instead of getting covered.
  overlayNodes(overlay, dispW).forEach((node) => container.appendChild(node));
  return container;
}
