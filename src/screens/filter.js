import { h, px } from '../dom.js';
import { framePreview, imageButton } from '../components.js';
import { FILTERS } from '../data.js';

export const filterScreen = {
  mount(app) {
    const s = app.state;

    const circles = h(
      'div',
      { class: 'carousel-row', style: { alignItems: 'center', padding: '8px 0 16px 16px', width: 'max-content' } },
      ...FILTERS.map((f, i) =>
        h(
          'button',
          {
            class: `filter-circle${i === s.filter ? ' selected' : ''}`,
            'aria-label': f.name,
            onClick: () => app.setState({ filter: i }),
          },
          h('img', { src: 'assets/filter-model.png', alt: '', style: { filter: f.css } })
        )
      )
    );

    return h(
      'div',
      { class: 'screen' },
      h('img', { src: 'assets/clover.svg', alt: '', style: { position: 'absolute', top: px(148), left: px(36), width: px(34), height: 'auto' } }),
      h('img', { src: 'assets/clover.svg', alt: '', style: { position: 'absolute', top: px(70), right: px(30), width: px(34), height: 'auto' } }),
      h(
        'div',
        { class: 'title-wrap', style: { top: px(80) } },
        h('img', { src: 'assets/title-filter.png', alt: 'Filter', style: { width: px(170) }, class: 'title-img' })
      ),
      framePreview({
        left: 75, top: 150, w: 240, h: 394,
        frameSrc: app.frameFile(),
        photos: s.photos,
        dispW: 240,
        filterCss: app.filterCss(),
        overlaySrc: app.frameOverlay(),
      }),
      h('div', { class: 'filter-name', style: { top: px(590) } }, app.filterName()),
      // Constrained + centered (icons peek at the right edge to hint it scrolls),
      // instead of a full-width carousel.
      h('div', { class: 'carousel', style: { top: px(620), left: '50%', right: 'auto', width: px(300), transform: 'translateX(-50%)' } }, circles),
      imageButton({
        src: 'assets/btn-confirm.png',
        alt: 'Confirm',
        bottom: 40,
        height: 60,
        onClick: () => app.setState({ screen: 'caption' }),
      })
    );
  },
};
