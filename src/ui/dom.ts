type Child = Node | string | number | false | null | undefined | Child[];
type Props = Record<string, unknown> & { class?: string; style?: Partial<CSSStyleDeclaration> | string };

const SVG_NS = 'http://www.w3.org/2000/svg';

function append(el: Element, child: Child): void {
  if (child === null || child === undefined || child === false) return;
  if (Array.isArray(child)) child.forEach((c) => append(el, c));
  else if (child instanceof Node) el.appendChild(child);
  else el.appendChild(document.createTextNode(String(child)));
}

function apply(el: Element, props: Props | null): void {
  if (!props) return;
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.setAttribute('class', String(v));
    else if (k === 'style') {
      if (typeof v === 'string') el.setAttribute('style', v);
      else Object.assign((el as HTMLElement).style, v);
    } else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
}

/** Tiny hyperscript helper for HTML elements. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Props | null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  apply(el, props ?? null);
  children.forEach((c) => append(el, c));
  return el;
}

/** Hyperscript helper for SVG elements. */
export function s(tag: string, props?: Props | null, ...children: Child[]): SVGElement {
  const el = document.createElementNS(SVG_NS, tag);
  apply(el, props ?? null);
  children.forEach((c) => append(el, c));
  return el;
}

export function clear(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Parse furigana markup like "{漢字|かんじ}" into <ruby> elements. */
export function ruby(text: string, mode: 'always' | 'tap' | 'off' = 'always'): HTMLElement {
  const wrap = h('span', { class: `jp furi-${mode}` });
  const re = /\{([^|}]+)\|([^}]+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) wrap.appendChild(document.createTextNode(text.slice(last, m.index)));
    const r = h('ruby', { class: 'furi' }, m[1]!, h('rt', null, m[2]!));
    if (mode === 'tap') r.addEventListener('click', () => r.classList.toggle('show'));
    wrap.appendChild(r);
    last = m.index + m[0].length;
  }
  if (last < text.length) wrap.appendChild(document.createTextNode(text.slice(last)));
  return wrap;
}

/** Replace an element's children, skipping null/false entries. */
export function fill(el: Element, ...children: Child[]): void {
  clear(el);
  children.forEach((c) => append(el, c));
}
