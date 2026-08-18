import { h, px } from '../dom.js';
import { primaryButton, titleWithClovers } from '../components.js';
import { COLORS, THEMES } from '../data.js';

export const frameScreen = {
  mount(app) {
    const s = app.state;
    const selFrame = s.tab === 'theme' ? THEMES[s.theme].file : COLORS[s.color].file;

    const tabs = h(
      'div',
      { style: { position: 'absolute', top: px(508), left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: px(36), fontSize: px(22) } },
      h('button', { class: `tab-btn${s.tab === 'color' ? ' active' : ''}`, onClick: () => app.setState({ tab: 'color' }) }, 'Color'),
      h('button', { class: `tab-btn${s.tab === 'theme' ? ' active' : ''}`, onClick: () => app.setState({ tab: 'theme' }) }, 'Theme')
    );

    const colorRow = h(
      'div',
      { class: 'carousel-row' },
      ...COLORS.map((c, i) =>
        h('button', {
          class: `swatch${i === s.color ? ' selected' : ''}`,
          'aria-label': c.name,
          style: { backgroundColor: c.hex, borderColor: c.border },
          onClick: () => app.setState({ color: i }),
        })
      )
    );

    const themeRow = h(
      'div',
      { class: 'carousel-row' },
      ...THEMES.map((t, i) =>
        h(
          'button',
          {
            class: `swatch${i === s.theme ? ' selected' : ''}`,
            'aria-label': t.name,
            onClick: () => app.setState({ theme: i }),
          },
          h('img', { src: t.icon, alt: '' })
        )
      )
    );

    const carousel = h(
      'div',
      { class: 'carousel', style: { top: px(560) } },
      s.tab === 'color' ? colorRow : themeRow
    );

    return h(
      'div',
      { class: 'screen' },
      titleWithClovers({
        top: 56,
        titleSrc: 'assets/title-frametheme.png',
        titleAlt: 'Frame Theme',
        titleW: 280,
        cloverTL: { top: -20, right: -20, w: 34 },
        cloverBR: { bottom: -16, left: -30, w: 34 },
      }),
      h(
        'div',
        { style: { position: 'absolute', top: px(150), left: 0, right: 0, display: 'flex', justifyContent: 'center' } },
        h('img', { src: selFrame, alt: 'Frame preview', style: { width: px(206), height: 'auto', transition: 'transform 0.25s ease' } })
      ),
      tabs,
      carousel,
      primaryButton('Start Snapshoot!', () => {
        app.setState({ screen: 'capture' });
        app.startCamera();
      })
    );
  },
};
