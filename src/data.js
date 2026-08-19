// Static design data ported verbatim from the design handoff (Snapshoot.dc.html).

export const THEMES = [
  {
    name: 'Deja Vu',
    icon: 'assets/theme-icon-dejavu.svg',
    file: 'assets/frame-theme1.svg',
    footerColor: '#ffffff',
    // Eight decorations that overlap the photo slots in the design (camera,
    // tag, speech bubble, two sparkle stars, three shooting-star trails) —
    // each its own small file, positioned individually and composited above
    // the photos so none of them get covered once a slot is filled.
    overlay: [
      { src: 'assets/camera.svg', left: 6, top: 54, w: 96, h: 64 },
      { src: 'assets/tag-till-we-meet.svg', left: 2, top: 251, w: 112, h: 21 },
      { src: 'assets/bubble-nostalgia.svg', left: 274, top: 243, w: 69, h: 47 },
      { src: 'assets/star-blue-sparkle.svg', left: 6, top: 376, w: 64, h: 68, rotate: -20 },
      { src: 'assets/star-yellow-sparkle.svg', left: 14, top: 430, w: 57, h: 57, rotate: -15 },
      { src: 'assets/shooting-blue.svg', left: 213, top: 408, w: 79, h: 98 },
      { src: 'assets/shooting-yellow.svg', left: 282, top: 402, w: 78, h: 98 },
      { src: 'assets/shooting-green.svg', left: 252, top: 434, w: 79, h: 98 },
    ],
  },
  { name: 'Theme 2', icon: 'assets/theme-icon2.svg', file: 'assets/frame-theme2.svg', footerColor: '#ffffff' },
  {
    name: 'Blackpink',
    icon: 'assets/theme-icon-blackpink.svg',
    file: 'assets/frame-blackpink.svg',
    // Card background is near-black, so the caption/date text needs to
    // stay white instead of the light-frame default (see captionColor()).
    footerColor: '#0F0F0F',
    // Three squiggle doodles that overlap the slot dividers in the design —
    // kept out of the frame art itself and composited above photos instead,
    // so they don't get covered once a slot is filled.
    overlay: 'assets/frame-blackpink-overlay.svg',
  },
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
