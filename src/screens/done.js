import { h, px } from '../dom.js';
import { framePreview, imageButton } from '../components.js';

export const doneScreen = {
  mount(app) {
    const s = app.state;

    const preview = framePreview({
      left: 75, top: 150, w: 240, h: 394,
      frameSrc: app.frameFile(),
      photos: s.photos,
      dispW: 240,
      filterCss: app.filterCss(),
      overlay: app.frameOverlay(),
    });
    preview.appendChild(
      h(
        'div',
        { class: 'done-text', style: { top: px(316), left: px(21), right: px(14), color: app.captionColor() } },
        h('div', null, s.date),
        h('div', { class: 'caption-line' }, s.caption)
      )
    );

    return h(
      'div',
      { class: 'screen' },
      h('img', { src: 'assets/clover.svg', alt: '', style: { position: 'absolute', top: px(150), left: px(34), width: px(34), height: 'auto' } }),
      h('img', { src: 'assets/clover.svg', alt: '', style: { position: 'absolute', top: px(60), right: px(28), width: px(34), height: 'auto' } }),
      h(
        'div',
        { class: 'title-wrap', style: { top: px(44) } },
        h('img', { src: 'assets/title-yoursnapshoot.png', alt: 'Your Snapshoot', style: { width: px(232) }, class: 'title-img' })
      ),
      preview,
      imageButton({
        src: 'assets/btn-downloadshare.png',
        alt: 'Download and Share',
        bottom: 112,
        height: 58,
        onClick: () => app.exportImage(),
      }),
      imageButton({
        src: 'assets/btn-takeanother.png',
        alt: 'Take Another Snapshoot',
        bottom: 40,
        height: 58,
        onClick: () => {
          app.stopCamera();
          app.setState({ photos: [null, null, null, null], caption: '', filter: 0, date: '', screen: 'frame' });
        },
      }),
      h('div', { class: 'toast' })
    );
  },
};
