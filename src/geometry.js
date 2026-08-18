// Slot geometry shared by every frame artwork, ported from the design handoff.
// Native SVG coordinate space: SVG_W = 343, SVG height = 562.5.
const SVG_W = 343;
const SVG_H = 562.5;
const XS = [29, 178.096];
const YS = [78, 264.854];
const SLOT_W = 141.391;
const SLOT_H = 179.146;

export function slotRect(i, dispW = 300) {
  const sc = dispW / SVG_W;
  const col = i % 2;
  const row = Math.floor(i / 2);
  const b = 1; // bleed so photos fully cover the SVG slot (no gray hairline)
  return {
    left: XS[col] * sc - b,
    top: YS[row] * sc - b,
    w: SLOT_W * sc + b * 2,
    h: SLOT_H * sc + b * 2,
  };
}

export const NATIVE_W = SVG_W;
export const NATIVE_H = SVG_H;
