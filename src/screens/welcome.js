import { h, px } from '../dom.js';
import { primaryButton } from '../components.js';

function img(src, alt, style, extra) {
  return h('img', { src, alt, style, ...(extra || {}) });
}

export const welcomeScreen = {
  mount(app) {
    return h(
      'div',
      { class: 'screen' },
      img('assets/logo.png', 'snapshoot — snap every moment', {
        position: 'absolute', top: px(86), left: px(20), width: px(314), height: 'auto', zIndex: 6,
      }),
      img('assets/polaroid-food.png', '', {
        position: 'absolute', top: px(214), right: px(24), width: px(263), height: px(295),
        transform: 'rotate(7deg)', zIndex: 4, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.18))',
      }),
      img('assets/daisy.svg', '', {
        position: 'absolute', top: px(200), left: px(165), width: px(54), height: 'auto', zIndex: 7,
      }),
      img('assets/star-green.svg', '', {
        position: 'absolute', top: px(256), left: px(80), width: px(34), height: 'auto', zIndex: 5,
      }),
      img('assets/polaroid-birthday.png', '', {
        position: 'absolute', top: px(366), left: px(18), width: px(272), height: px(320),
        transform: 'rotate(-6deg)', zIndex: 8, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
      }),
      img('assets/washi-flower.png', '', {
        position: 'absolute', top: px(399), left: px(3), width: px(92), height: 'auto', transform: 'rotate(-30deg)', zIndex: 9,
      }),
      img('assets/star-blue.svg', '', {
        position: 'absolute', top: px(472), left: px(264), width: px(51), height: px(49), zIndex: 5,
      }),
      img('assets/star-green.svg', '', {
        position: 'absolute', top: px(637), left: px(55), width: px(42), height: 'auto', zIndex: 9,
      }),
      img('assets/clover.svg', '', {
        position: 'absolute', top: px(570), left: px(255), width: px(58), height: 'auto', zIndex: 9,
      }),
      primaryButton('Snapshoot a pic!', () => app.setState({ screen: 'how' }))
    );
  },
};
