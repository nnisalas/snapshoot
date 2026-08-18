import { h, px } from '../dom.js';
import { primaryButton, titleWithClovers } from '../components.js';

export const howScreen = {
  mount(app) {
    return h(
      'div',
      { class: 'screen' },
      titleWithClovers({
        top: 64,
        titleSrc: 'assets/title-howitworks.png',
        titleAlt: 'How it Works',
        titleW: 270,
        cloverTL: { top: -24, right: -16, w: 34 },
        cloverBR: { bottom: -18, left: -40, w: 34 },
      }),
      h(
        'div',
        { style: { position: 'absolute', top: px(189), left: px(9), textAlign: 'center', fontSize: px(20), lineHeight: '1.5' } },
        h('p', { style: { margin: '0', width: px(359), height: px(60) } }, 'Ever take photobooth pictures with your friends?'),
        h('p', { style: { margin: '22px 0 0', width: px(351), height: px(54) } }, 'What if you could take them… wherever you go!')
      ),
      h(
        'ol',
        {
          style: {
            position: 'absolute', top: px(388), left: px(42), margin: '0', paddingLeft: px(24),
            fontSize: px(20), lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: px(20),
          },
        },
        h('li', null, 'Choose your frame theme!'),
        h('li', null, 'Snapshoot a pic!'),
        h('li', null, 'Add a caption!'),
        h('li', null, 'Download & share your pic!')
      ),
      h(
        'p',
        { style: { position: 'absolute', top: px(623), left: px(18), margin: '0', fontSize: px(20), lineHeight: '1.4' } },
        "Note: Snapshoot doesn't save or store your pictures!"
      ),
      primaryButton('Continue', () => app.setState({ screen: 'frame' }))
    );
  },
};
