// Static design data ported verbatim from the design handoff (Snapshoot.dc.html).

export const THEMES = [
  { name: 'Theme 1', icon: 'assets/theme-icon1.svg', file: 'assets/frame-theme1.svg' },
  { name: 'Theme 2', icon: 'assets/theme-icon2.svg', file: 'assets/frame-theme2.svg' },
];

export const COLORS = [
  { name: 'Black', hex: '#191919', border: '#191919', file: 'assets/frame-black.svg' },
  { name: 'White', hex: '#ffffff', border: '#dcdad5', file: 'assets/frame-white.svg' },
  { name: 'Blue', hex: '#82D9FB', border: '#82D9FB', file: 'assets/frame-blue.svg' },
  { name: 'Green', hex: '#CCFFC4', border: '#b7ecad', file: 'assets/frame-green.svg' },
  { name: 'Pink', hex: '#FFCBC4', border: '#f5b8b0', file: 'assets/frame-pink.svg' },
  { name: 'Lavender', hex: '#C4C9FF', border: '#b0b6f0', file: 'assets/frame-lavender.svg' },
  { name: 'Red', hex: '#D92E14', border: '#D92E14', file: 'assets/frame-red.svg' },
];

export const FILTERS = [
  { name: 'no filter', css: 'none' },
  { name: 'cool light', css: 'brightness(1.08) saturate(1.05) contrast(1.02) hue-rotate(-12deg)' },
  { name: 'soft', css: 'brightness(1.07) contrast(0.9) saturate(1.02) blur(0.4px)' },
  { name: 'classic', css: 'contrast(1.12) saturate(1.18) sepia(0.14)' },
  { name: 'hard light', css: 'contrast(1.34) brightness(1.04) saturate(1.12)' },
  { name: 'mono', css: 'grayscale(1) contrast(1.06)' },
  { name: 'bright', css: 'brightness(1.22) contrast(1.04) saturate(1.08)' },
];
