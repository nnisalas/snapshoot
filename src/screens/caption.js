import { h, px } from '../dom.js';
import { framePreview, imageButton } from '../components.js';

export const captionScreen = {
  mount(app) {
    const s = app.state;

    return h(
      'div',
      { class: 'screen' },
      h('img', { src: 'assets/clover.svg', alt: '', style: { position: 'absolute', top: px(146), left: px(36), width: px(34), height: 'auto' } }),
      h('img', { src: 'assets/clover.svg', alt: '', style: { position: 'absolute', top: px(68), right: px(28), width: px(34), height: 'auto' } }),
      h(
        'div',
        { class: 'title-wrap', style: { top: px(78) } },
        h('img', { src: 'assets/title-addcaption.png', alt: 'Add Caption', style: { width: px(224) }, class: 'title-img' })
      ),
      framePreview({
        left: 75, top: 150, w: 240, h: 394,
        frameSrc: app.frameFile(),
        photos: s.photos,
        dispW: 240,
        filterCss: app.filterCss(),
        overlaySrc: app.frameOverlay(),
      }),
      h('div', { class: 'caption-label', style: { top: px(576), left: px(75) } }, 'Caption'),
      h('input', {
        type: 'text',
        class: 'caption-input',
        value: s.caption,
        maxlength: 40,
        style: { top: px(606), left: px(75), width: px(240), height: px(46) },
        onInput: (e) => app.setState({ caption: e.target.value }),
      }),
      imageButton({
        src: 'assets/btn-finish.png',
        alt: 'Finish Snapshoot',
        bottom: 40,
        height: 60,
        onClick: () => app.setState({ date: app.today(), screen: 'done' }),
      })
    );
  },

  // No visible part of this screen besides the input reacts to `caption`
  // changes, so skip full remounts on every keystroke — that would steal
  // focus/cursor position from the text field.
  update() {},
};
