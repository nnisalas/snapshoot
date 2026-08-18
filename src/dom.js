// Tiny DOM-building helper — no framework, just ergonomics.
// h('div', { class: 'x', style: {top: '10px'}, onClick: fn }, child1, child2)

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  props = props || {};
  for (const [key, val] of Object.entries(props)) {
    if (val == null || val === false) continue;
    if (key === 'style' && typeof val === 'object') {
      Object.assign(el.style, val);
    } else if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === 'class' || key === 'className') {
      el.className = val;
    } else if (key === 'text') {
      el.textContent = val;
    } else if (key === 'html') {
      el.innerHTML = val;
    } else if (key in el && key !== 'list') {
      try { el[key] = val; } catch { el.setAttribute(key, val); }
    } else {
      el.setAttribute(key, val);
    }
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function px(n) {
  return `${n}px`;
}
