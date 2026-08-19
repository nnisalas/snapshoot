// Reliable "pressed" visual feedback for buttons, independent of the
// browser's native :active handling.
//
// Why: CSS :active alone is unreliable on touch. iOS Safari in particular
// won't apply :active on a tap at all unless *some* touch listener exists
// on the page — with none, taps just never show a pressed state. Other
// mobile browsers can be flaky too, especially on a quick tap. And plain
// :hover has no real "unhover" moment on touch, so it can visually stick
// after a tap and look like a state that never reset.
//
// Fix: track presses ourselves via Pointer Events (one API that unifies
// mouse/touch/pen) and toggle a `.pressed` class, which style.css pairs
// with the same rules as each button's :active state.

const PRESSABLE = '.btn-primary, .btn-image, .shutter-btn, .cam-fallback';

let current = null;

function release() {
  if (!current) return;
  current.classList.remove('pressed');
  current = null;
}

function press(el) {
  if (current === el) return;
  release();
  current = el;
  el.classList.add('pressed');
}

export function initPressStates(root = document) {
  root.addEventListener('pointerdown', (e) => {
    const el = e.target.closest(PRESSABLE);
    if (el) press(el);
  });
  // pointerup/cancel fire on whatever element captured the pointer, which
  // for touch is the original pointerdown target regardless of where the
  // finger ends up — matches native :active's start/end behavior.
  root.addEventListener('pointerup', release);
  root.addEventListener('pointercancel', release);
}
