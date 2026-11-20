// Campus Learn — макети. Локальний плагін: будує екрани нативними шарами Figma.
// Запуск: Plugins → Development → Import plugin from manifest… → обрати manifest.json → запустити.

await (async () => {
try {
const page = figma.createPage(); page.name = 'Campus Learn — макети';
await figma.setCurrentPageAsync(page);

const C = h => { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; };
const F = h => [{ type: 'SOLID', color: C(h) }];
const ST = { Inter: ['Regular', 'Medium', 'Semi Bold', 'Bold'], Montserrat: ['Regular', 'Medium', 'SemiBold', 'Bold'] };
await Promise.all([].concat(ST.Inter.map(s => figma.loadFontAsync({ family: 'Inter', style: s })), ST.Montserrat.map(s => figma.loadFontAsync({ family: 'Montserrat', style: s }))));
let FAM = 'Inter';
const errors = [];

function autoLayout(dir) { const f = figma.createFrame(); f.layoutMode = dir || 'HORIZONTAL'; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = []; return f; }
function T(s, o = {}) { const { size = 14, w = 4, color = '#1A2420', width, align, lh } = o; const t = figma.createText(); t.fontName = { family: FAM, style: ST[FAM][w - 4] }; t.characters = String(s); t.fontSize = size; t.fills = F(color); if (lh) t.lineHeight = { unit: 'PERCENT', value: lh }; if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT'; } if (align) t.textAlignHorizontal = align; return t; }
function AL(dir, o = {}) { const f = autoLayout(dir); const { gap = 0, p = 0, name, bg, r, stroke, ca, pa, w, h, clip, sw = 1, dash } = o; const px = o.px != null ? o.px : p, py = o.py != null ? o.py : p; f.itemSpacing = gap; f.paddingLeft = f.paddingRight = px; f.paddingTop = f.paddingBottom = py; if (o.pt != null) f.paddingTop = o.pt; f.fills = bg ? F(bg) : []; if (r) f.cornerRadius = r; if (stroke) { f.strokes = F(stroke); f.strokeWeight = sw; f.strokeAlign = 'INSIDE'; if (dash) f.dashPattern = [5, 4]; } if (name) f.name = name; if (ca) f.counterAxisAlignItems = ca; if (pa) f.primaryAxisAlignItems = pa; if (w || h) { f.resize(w || 10, h || 10); const H = dir === 'HORIZONTAL'; f.primaryAxisSizingMode = (H ? w : h) ? 'FIXED' : 'AUTO'; f.counterAxisSizingMode = (H ? h : w) ? 'FIXED' : 'AUTO'; } f.clipsContent = !!clip; return f; }
function add(p, ...k) { k.flat().forEach(x => x && p.appendChild(x)); return p; }
const fillW = n => { n.layoutSizingHorizontal = 'FILL'; return n; };
const grow = n => { n.layoutGrow = 1; return n; };
function box(s, w, h, o = {}) { const b = AL('HORIZONTAL', { w, h, bg: o.bg || '#FFFFFF', ca: 'CENTER', pa: o.left ? 'MIN' : 'CENTER', px: o.left ? 12 : 4, name: o.name || 'cell' }); if (s !== '' && s != null) add(b, T(s, { size: o.size || 13, w: o.wt || 7, color: o.color || '#1A2420', width: o.wrap ? w - 10 : undefined, align: o.wrap ? 'CENTER' : undefined })); return b; }
const shadow = [{ type: 'DROP_SHADOW', color: { r: 30 / 255, g: 40 / 255, b: 80 / 255, a: 0.12 }, offset: { x: 0, y: 6 }, radius: 18, spread: 0, visible: true, blendMode: 'NORMAL' }];

// ---------- Компоненти ----------
const compArea = AL('HORIZONTAL', { gap: 40, p: 40, name: 'Компоненти', bg: '#FFFFFF' }); compArea.x = 0; compArea.y = -1200;
function mkBtn(pri) { const c = figma.createComponent(); c.name = pri ? 'Button/Primary' : 'Button/Secondary'; c.layoutMode = 'HORIZONTAL'; c.resize(120, 44); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; c.paddingLeft = c.paddingRight = 16; c.counterAxisAlignItems = 'CENTER'; c.cornerRadius = 6; c.fills = F(pri ? '#184F3D' : '#FFFFFF'); if (!pri) { c.strokes = F('#C9D3C6'); c.strokeWeight = 1; c.strokeAlign = 'INSIDE'; } add(c, T('Кнопка', { w: 6, color: pri ? '#FFFFFF' : '#184F3D' })); compArea.appendChild(c); return c; }
const btnP = mkBtn(true), btnS = mkBtn(false);
function btn(s, pri) { const i = (pri ? btnP : btnS).createInstance(); i.findOne(n => n.type === 'TEXT').characters = s; return i; }
const icons = { 'Журнал': '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>', 'Тести на лекції': '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>', 'Домашні завдання': '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>', 'Розклад': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', 'Звіти та відповіді': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 15l3-3 3 3 4-5"/>' };
const svg = (p, c, s = 18) => { const n = figma.createNodeFromSvg(`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`); n.name = 'icon'; return n; };
const side = figma.createComponent(); side.name = 'Sidebar'; side.layoutMode = 'VERTICAL'; side.resize(240, 900); side.primaryAxisSizingMode = 'FIXED'; side.counterAxisSizingMode = 'FIXED'; side.paddingLeft = side.paddingRight = 16; side.paddingTop = side.paddingBottom = 24; side.itemSpacing = 24; side.fills = F('#1F3D31');
{
  const logo = AL('HORIZONTAL', { gap: 10, px: 8, ca: 'CENTER', name: 'logo' });
  const sq = AL('HORIZONTAL', { w: 34, h: 34, r: 9, bg: '#D5E6BF', ca: 'CENTER', pa: 'CENTER' }); add(sq, T('c.', { w: 7, size: 16, color: '#1F3D31' }));
  const chip = AL('HORIZONTAL', { px: 6, py: 2, r: 4, bg: '#D5E6BF' }); add(chip, T('LEARN', { w: 7, size: 11, color: '#1F3D31' }));
  add(logo, sq, T('campus', { w: 7, size: 17, color: '#FFFFFF' }), chip); add(side, logo); fillW(logo);
  const sec = (label, items) => { const g = AL('VERTICAL', { gap: 4, name: 'section/' + label }); add(g, T(label, { size: 11, w: 5, color: '#A9BDB0' })); items.forEach(it => { const row = AL('HORIZONTAL', { gap: 10, px: 12, h: 44, r: 6, ca: 'CENTER', name: 'nav/' + it }); add(row, svg(icons[it], '#D7E2D9'), T(it, { w: 5, color: '#D7E2D9' })); add(g, row); fillW(row); }); add(side, g); fillW(g); };
  sec('НАВЧАННЯ', ['Журнал', 'Тести на лекції', 'Домашні завдання', 'Розклад']);
  sec('АДМІНІСТРУВАННЯ', ['Звіти та відповіді']);
  const sp = AL('VERTICAL', { name: 'spacer' }); add(side, sp); fillW(sp); grow(sp);
  const user = AL('HORIZONTAL', { gap: 10, p: 12, ca: 'CENTER', name: 'user' }); const av = AL('HORIZONTAL', { w: 34, h: 34, r: 17, bg: '#2F5A48', ca: 'CENTER', pa: 'CENTER' }); add(av, T('ВТ', { w: 6, size: 13, color: '#FFFFFF' }));
  const uc = AL('VERTICAL', { gap: 2, name: 'user-text' }); add(uc, T('Віктор Ткаченко', { w: 6, color: '#FFFFFF' }), T('Викладач', { size: 12, color: '#A9BDB0' }));
  add(user, av, uc); add(side, user); fillW(user);
}
compArea.appendChild(side);

function shell(name, x, y, active) {
  const s = AL('HORIZONTAL', { name, bg: '#F4F6F2', w: 1440 }); s.x = x; s.y = y;
  const sb = side.createInstance(); s.appendChild(sb); sb.layoutSizingVertical = 'FILL';
  const it = sb.findOne(n => n.name === 'nav/' + active);
  if (it) { it.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.1 }]; const t = it.findOne(n => n.type === 'TEXT'); t.fontName = { family: 'Inter', style: 'Bold' }; t.fills = F('#FFFFFF'); }
  const m = AL('VERTICAL', { px: 40, py: 32, gap: 20, name: 'main' }); s.appendChild(m); fillW(m);
  return m;
}
function header(m, crumb, title, btns, pre) {
  const row = AL('HORIZONTAL', { gap: 16, ca: 'MAX', pa: 'SPACE_BETWEEN', name: 'header' }); add(m, row); fillW(row);
  const l = AL('VERTICAL', { gap: 6 }); if (pre) add(l, pre); else add(l, T(crumb, { size: 13, color: '#5B6660' })); add(l, T(title, { size: 28, w: 7 }));
  const r = AL('HORIZONTAL', { gap: 8 }); add(r, btns.map(b => btn(b[0], b[1])));
  add(row, l, r); return row;
}
const card = (name, w, o = {}) => AL('VERTICAL', Object.assign({ name, bg: '#FFFFFF', stroke: '#E1E6DE', r: 10, p: 20, gap: 14, w }, o));
const label = s => T(s, { size: 12, w: 6, color: '#5B6660' });
const caps = s => T(s.toUpperCase(), { size: 12, w: 6, color: '#5B6660' });
function field(lbl, val, w) { const c = AL('VERTICAL', { gap: 6, name: 'field/' + lbl, w }); const b = AL('HORIZONTAL', { h: 44, px: 12, r: 6, stroke: '#C9D3C6', bg: '#FFFFFF', ca: 'CENTER', gap: 8 }); const vt = T(val); add(b, vt); grow(vt); add(b, T('▾', { color: '#5B6660' })); add(c, label(lbl), b); fillW(b); return c; }
function check(lbl, on, w = 240) { const r = AL('HORIZONTAL', { gap: 10, name: 'checkbox' }); const sq = AL('HORIZONTAL', { w: 18, h: 18, r: 4, ca: 'CENTER', pa: 'CENTER', bg: on ? '#184F3D' : '#FFFFFF', stroke: on ? null : '#9AA59F', sw: 2 }); if (on) add(sq, T('✓', { size: 12, w: 7, color: '#FFFFFF' })); add(r, sq, T(lbl, { width: w, lh: 140 })); return r; }
function pill(s, bg, color) { const p = AL('HORIZONTAL', { px: 10, py: 4, r: 999, bg, name: 'badge' }); add(p, T(s, { size: 12, w: 7, color })); return p; }
function chip(s, on) { const c = AL('HORIZONTAL', { px: 14, h: 40, r: 6, ca: 'CENTER', bg: on ? '#184F3D' : '#FFFFFF', stroke: on ? null : '#C9D3C6', name: 'chip' }); add(c, T(s, { w: on ? 6 : 5, color: on ? '#FFFFFF' : '#1A2420' })); return c; }
function dashedBtn(s) { const b = AL('HORIZONTAL', { h: 44, px: 14, r: 6, stroke: '#9FB3A4', dash: true, ca: 'CENTER', pa: 'CENTER', name: 'add' }); add(b, T(s, { w: 6, color: '#184F3D' })); return b; }
function gridTable(name) { return AL('VERTICAL', { gap: 1, bg: '#DDE3DA', stroke: '#C9D3C6', r: 10, clip: true, name }); }
const rowH = () => AL('HORIZONTAL', { gap: 1, name: 'row' });
const names = ['Бондар Олена', 'Гнатюк Марко', 'Демченко Ірина', 'Коваль Тарас', 'Литвин Софія', 'Мельник Андрій', 'Олійник Дарина', 'Павленко Ігор', 'Руденко Катерина', 'Савчук Богдан', 'Ткачук Вікторія', 'Шевчук Назар'];
const look = v => v === 'н' ? ['#FBE1D8', '#8A2A12'] : v === 'н/3' ? ['#FFF1C7', '#6B4A00'] : ['#FFFFFF', '#1A2420'];

// ---------- 1. Журнал ----------
try {
  const m = shell('Викладач · Журнал', 0, 0, 'Журнал');
  header(m, 'Журнал / 1 семестр 2025–2026', 'Журнал групи ПД 5/25 БД', [['Присутність із Zoom / Meet'], ['Експорт у Excel']]);
  const tabs = AL('HORIZONTAL', { gap: 4, p: 4, r: 8, bg: '#E6EBE3', name: 'tabs' });
  const tOn = AL('HORIZONTAL', { px: 16, h: 40, r: 6, bg: '#FFFFFF', ca: 'CENTER' }); add(tOn, T('Відвідування', { w: 7, color: '#184F3D' }));
  const tOff = AL('HORIZONTAL', { px: 16, h: 40, r: 6, ca: 'CENTER' }); add(tOff, T('Кримінальне право', { w: 5, color: '#4A544F' }));
  add(tabs, tOn, tOff); add(m, tabs);
  const subj = { crim: 'Кримінальне право · моя пара', civ: 'Цивільне право · Мороз Н.П. · перегляд', pub: 'Публічне адмін. · Гриценко О.В. · перегляд', psy: 'Юр. психологія · Кравчук І.С. · перегляд' };
  const pairs = [['crim', 'л', 1], ['crim', 'с', 2], ['civ', 'л', 3], ['pub', 'с', 1], ['psy', 'л', 2], ['civ', 'с', 3], ['pub', 'с', 1], ['crim', 'с', 2], ['psy', 'с', 3]];
  const tb = gridTable('Таблиця журналу'); const hb = '#F3F6F0';
  add(tb, add(rowH(), box('День і дата', 265, 40, { left: true, bg: hb, size: 12, wt: 6, color: '#5B6660' }), ['Понеділок, 13.10', 'Вівторок, 14.10', 'Середа, 15.10'].map(d => box(d, 242, 40, { bg: hb })), box('Пропуски', 90, 40, { bg: hb })));
  add(tb, add(rowH(), box('Пара · вид заняття', 265, 30, { left: true, bg: hb, size: 12, wt: 6, color: '#5B6660' }), pairs.map(p => box(p[2] + ' пара · ' + p[1], 80, 30, { bg: hb, size: 12, wt: 6 })), box('', 90, 30, { bg: hb })));
  add(tb, add(rowH(), box('Предмет · викладач', 265, 56, { left: true, bg: hb, size: 12, wt: 6, color: '#5B6660' }), pairs.map(p => box(subj[p[0]], 80, 56, { bg: p[0] === 'crim' ? '#E3EFDA' : hb, size: 10, wt: p[0] === 'crim' ? 7 : 5, color: p[0] === 'crim' ? '#184F3D' : '#5B6660', wrap: true })), box('', 90, 56, { bg: hb })));
  names.forEach((nm, i) => {
    let abs = 0;
    const cells = pairs.map((p, j) => { const h = (i * 7 + j * 5 + 3) % 17; let v = ''; if (h < 2) v = 'н'; else if (p[1] === 'с' && h % 3 === 0) v = String([5, 4, 5, 3][h % 4]); if (v === 'н') abs++; const own = p[0] === 'crim'; const [bg, c] = own ? look(v) : ['#F1F3EF', '#5B6660']; return box(v, 80, 40, { bg, color: c, size: 14, wt: own ? 7 : 6 }); });
    add(tb, add(rowH(), box(i + 1, 44, 40, { color: '#5B6660', wt: 4 }), box(nm, 220, 40, { left: true, wt: 5, size: 14 }), cells, box(abs, 90, 40, { bg: '#EEF2EB', color: abs ? '#8A2A12' : '#184F3D', size: 14 })));
  });
  add(m, tb);
  const lg = AL('HORIZONTAL', { gap: 18, ca: 'CENTER', name: 'legend' });
  [['н', '#FBE1D8', '#8A2A12', 'відсутній'], ['н/3', '#FFF1C7', '#6B4A00', 'пропуск відпрацьовано на 3'], ['5', '#FFFFFF', '#1A2420', 'оцінка'], ['', '#F1F3EF', '#5B6660', 'пара іншого викладача — лише перегляд']].forEach(([s, bg, c, t]) => { const it = AL('HORIZONTAL', { gap: 8, ca: 'CENTER' }); const b = box(s, 30, 24, { bg, color: c }); b.cornerRadius = 4; b.strokes = F('#DDE3DA'); b.strokeWeight = 1; add(it, b, T(t, { size: 13, color: '#5B6660' })); add(lg, it); });
  add(m, lg);
} catch (e) { errors.push('Журнал: ' + e.message); }

// ---------- 2. Створення тесту ----------
try {
  const m = shell('Викладач · Створення тесту', 1540, 0, 'Тести на лекції');
  header(m, 'Тести на лекції / Новий тест', 'Склад кримінального правопорушення', [['Імпорт питань з Excel'], ['Зберегти чернетку'], ['Запустити на парі →', true]]);
  const body = AL('HORIZONTAL', { gap: 24, name: 'body' }); add(m, body); fillW(body);
  const lst = card('Питання', 240, { p: 14, gap: 6 }); add(lst, caps('Питання · 4'));
  [['Що є підставою кримінальної відп…', 'Один варіант'], ['Які елементи входять до складу…', 'Кілька варіантів'], ['Наскільки зрозуміла тема?', 'Шкала 1–5'], ['Ваше питання до лектора', 'Відкрита відповідь']].forEach(([q, k], i) => { const r = AL('HORIZONTAL', { gap: 10, p: 10, r: 6, bg: i === 0 ? '#E3EFDA' : null, name: 'question-item' }); const c = AL('VERTICAL', { gap: 2 }); add(c, T(q, { w: i === 0 ? 6 : 5, color: i === 0 ? '#184F3D' : '#1A2420', width: 170 }), T(k, { size: 12, color: '#5B6660' })); add(r, T(i + 1, { w: 7, color: i === 0 ? '#184F3D' : '#1A2420' }), c); add(lst, r); fillW(r); });
  const ab = dashedBtn('+ Питання'); add(lst, ab); fillW(ab);
  const ed = card('Редактор питання', null, { px: 28, py: 24, gap: 18 }); add(body, lst, ed); fillW(ed);
  const eh = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN', ca: 'CENTER' }); add(eh, T('Питання 1', { size: 16, w: 7 }), T('Видалити питання', { size: 13, w: 6, color: '#8A2A12' })); add(ed, eh); fillW(eh);
  const qf = AL('VERTICAL', { gap: 6 }); const qb = AL('HORIZONTAL', { px: 14, py: 12, r: 6, stroke: '#C9D3C6' }); add(qb, T('Що є підставою кримінальної відповідальності?', { size: 18, w: 6 })); add(qf, label('Текст питання'), qb); add(ed, qf); fillW(qf); fillW(qb);
  const tg = AL('VERTICAL', { gap: 8 }); const tr = AL('HORIZONTAL', { gap: 6 }); add(tr, chip('Один варіант', true), chip('Кілька варіантів'), chip('Шкала 1–5'), chip('Відкрита відповідь')); add(tg, label('Тип відповіді'), tr); add(ed, tg);
  const og = AL('VERTICAL', { gap: 8, name: 'options' }); add(og, label('Варіанти · позначте правильний')); add(ed, og); fillW(og);
  [['Вина особи', false], ['Склад кримінального правопорушення', true], ['Суспільна небезпека діяння', false]].forEach(([t, ok]) => { const r = AL('HORIZONTAL', { gap: 12, px: 14, h: 48, r: 8, ca: 'CENTER', bg: ok ? '#F0F6EA' : '#FFFFFF', stroke: ok ? '#184F3D' : '#C9D3C6', sw: ok ? 2 : 1, name: 'option' }); const d = figma.createEllipse(); d.resize(20, 20); d.fills = F(ok ? '#184F3D' : '#FFFFFF'); d.strokes = F(ok ? '#184F3D' : '#9AA59F'); d.strokeWeight = 2; const tt = T(t, { size: 15, w: ok ? 6 : 4 }); add(r, d, tt); grow(tt); if (ok) add(r, T('правильна', { size: 12, w: 7, color: '#184F3D' })); add(r, T('×', { size: 18, color: '#5B6660' })); add(og, r); fillW(r); });
  add(og, dashedBtn('+ Варіант'));
  const bt = AL('HORIZONTAL', { gap: 16 }); add(bt, field('Час на питання', '45 секунд', 180), field('Балів за відповідь', '1', 140)); add(ed, bt);
  const st = card('Налаштування тесту', 300); add(body, st);
  add(st, caps('Де проводимо'), field('Предмет', 'Кримінальне право'), field('Група', 'ПД 5/25 БД'), field('Пара з розкладу', '30.10 · 3 пара · лекція'), caps('Після тесту'), check('Зарахувати відповідь як присутність у журналі', true), check('Бали — у журнал за цю пару', true), check('Показати студентам правильні відповіді після тесту', true), check('Анонімне опитування (без імен)', false));
  st.children.filter(c => c.name.indexOf('field/') === 0).forEach(fillW);
} catch (e) { errors.push('Створення тесту: ' + e.message); }

// ---------- 3. Тест на лекції (запуск) ----------
try {
  const m = shell('Викладач · Тест на лекції', 3080, 0, 'Тести на лекції');
  const pre = AL('HORIZONTAL', { gap: 10, ca: 'CENTER' }); add(pre, pill('● Іде зараз', '#FBE1D8', '#8A2A12'), T('Лекція 30.10 · 3 пара · онлайн у Zoom', { size: 13, color: '#5B6660' }));
  header(m, '', 'Тест на лекції: склад злочину', [['Показати правильну відповідь'], ['Наступне питання'], ['Завершити тест', true]], pre);
  const body = AL('HORIZONTAL', { gap: 24, name: 'body' }); add(m, body); fillW(body);
  const lst = card('Питання', 220, { p: 14, gap: 6 }); add(lst, caps('Питання'));
  [['Підстава відповідальності', 'Один варіант'], ['Елементи складу', 'Один варіант'], ['Форми вини', 'Кілька варіантів'], ['Зрозумілість теми', 'Шкала 1–5'], ['Питання до лектора', 'Відкрита відповідь']].forEach(([q, k], i) => { const r = AL('HORIZONTAL', { gap: 10, p: 10, r: 6, bg: i === 0 ? '#E3EFDA' : null }); const c = AL('VERTICAL', { gap: 2 }); add(c, T(q, { w: i === 0 ? 6 : 5, color: i === 0 ? '#184F3D' : '#1A2420' }), T(k, { size: 12, color: '#5B6660' })); add(r, T(i + 1, { w: 7 }), c); add(lst, r); fillW(r); });
  const mid = AL('VERTICAL', { gap: 20 }); add(body, lst, mid); fillW(mid);
  const qc = card('Поточне питання', null, { px: 28, py: 24, gap: 20 }); add(mid, qc); fillW(qc);
  const qh = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN', ca: 'CENTER' }); add(qh, T('Питання 1 з 5 · один варіант', { size: 13, w: 6, color: '#5B6660' }), T('00:18', { size: 22, w: 7, color: '#184F3D' })); add(qc, qh); fillW(qh);
  add(qc, T('Що є підставою кримінальної відповідальності?', { size: 22, w: 6 }));
  [['A. Вина особи', 2], ['B. Склад кримінального правопорушення', 6], ['C. Суспільна небезпека діяння', 1]].forEach(([t, n]) => { const g = AL('VERTICAL', { gap: 6 }); const l = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN' }); add(l, T(t, { size: 15 }), T(n, { size: 15, w: 7 })); const bar = AL('HORIZONTAL', { h: 12, r: 6, bg: '#EEF1EB', clip: true }); const fl = figma.createRectangle(); fl.resize(Math.round(560 * n / 6), 12); fl.cornerRadius = 6; fl.fills = F('#5E8A6F'); add(bar, fl); add(g, l, bar); add(qc, g); fillW(g); fillW(l); fillW(bar); });
  const an = card('Хто відповів', null, { px: 24 }); add(mid, an); fillW(an);
  const ah = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN', ca: 'CENTER' }); add(ah, T('Відповіли 9 з 10', { size: 16, w: 6 }), check('Зарахувати відповідь як присутність у журналі', true, 340)); add(an, ah); fillW(ah);
  const ch = AL('HORIZONTAL', { gap: 8, name: 'students' }); ch.layoutWrap = 'WRAP'; ch.counterAxisSpacing = 8; add(an, ch); fillW(ch);
  ['Бондар О.', 'Гнатюк М.', 'Демченко І.', 'Коваль Т.', 'Литвин С.', 'Мельник А.', 'Олійник Д.', 'Павленко І.', 'Руденко К.', 'Савчук Б.'].forEach((n, i) => { let p; if (i < 9) p = pill(n, '#E3EFDA', '#184F3D'); else { p = AL('HORIZONTAL', { px: 10, py: 4, r: 999, stroke: '#C9D3C6', dash: true }); add(p, T(n, { size: 12, w: 5, color: '#5B6660' })); } add(ch, p); });
  const ps = AL('VERTICAL', { name: 'Пуш у застосунок', bg: '#1F3D31', r: 10, p: 24, gap: 12, w: 280 }); add(body, ps);
  add(ps, T('Пуш у застосунок групи', { w: 7, color: '#FFFFFF' }), T('Студент натискає сповіщення — і одразу потрапляє в Zoom або в тест. Без копіювання посилань.', { size: 13, color: '#C7D6CB', width: 232, lh: 145 }));
  ['Надіслати посилання на пару', 'Надіслати тест'].forEach(s => { const b = AL('HORIZONTAL', { h: 44, r: 6, bg: '#D5E6BF', ca: 'CENTER', pa: 'CENTER', name: 'button/push' }); add(b, T(s, { w: 7, color: '#1F3D31' })); add(ps, b); fillW(b); });
  add(ps, T('Доставлено 10 з 10 · відкрили 9', { size: 12, color: '#C7D6CB' }));
} catch (e) { errors.push('Тест на лекції: ' + e.message); }

// ---------- 4. Домашні завдання (викладач) ----------
try {
  const m = shell('Викладач · Домашні завдання', 0, 1300, 'Домашні завдання');
  header(m, 'Домашні завдання / Кримінальне право / ПД 5/25 БД', 'Домашні завдання', [['+ Нове завдання', true]]);
  const cr = AL('HORIZONTAL', { gap: 12 }); add(m, cr); fillW(cr);
  [['Активне · до 07.10, 23:59', 'Співучасть: розв’язати 3 казуси', 'Здано 8 з 12', true], ['Чернетка · до 14.10', 'Стадії злочину: схема', 'Ще не надіслано групі'], ['Закрито · 23.09', 'Склад злочину: есе', 'Перевірено 12 з 12']].forEach(([a, b, c, on]) => { const k = card('assignment', null, { p: 16, gap: 4, stroke: on ? '#184F3D' : '#E1E6DE', sw: on ? 2 : 1 }); add(k, T(a, { size: 12, w: on ? 7 : 6, color: on ? '#184F3D' : '#5B6660' }), T(b, { size: 15, w: 6 }), T(c, { size: 13, color: '#5B6660' })); add(cr, k); fillW(k); });
  const dt = card('Завдання', null, { px: 24 }); add(m, dt); fillW(dt);
  add(dt, T('Співучасть: розв’язати 3 казуси', { size: 20, w: 7 }), T('Розв’яжіть казуси з файлу. Для кожного визначте вид співучасті та роль кожного співучасника з посиланням на статті КК. Відповідь — один файл PDF або DOCX.', { size: 14, color: '#3A4440', width: 900, lh: 155 }), T('Видано: 30.09 на семінарі    ·    Дедлайн: 07.10, 23:59    ·    Макс. оцінка: 5    ·    Оцінка → журнал, семінар 07.10', { size: 13, color: '#5B6660' }));
  const fr = AL('HORIZONTAL', { gap: 8 }); [['Казуси_співучасть.pdf', '240 КБ'], ['Методичка_семінар_6.docx', '88 КБ']].forEach(([f, s]) => { const r = AL('HORIZONTAL', { gap: 10, px: 12, h: 44, r: 6, stroke: '#E1E6DE', ca: 'CENTER', name: 'file' }); add(r, svg(icons['Домашні завдання'], '#184F3D'), T(f), T(s, { size: 12, color: '#5B6660' })); add(fr, r); }); add(dt, fr);
  const bot = AL('HORIZONTAL', { gap: 24 }); add(m, bot); fillW(bot);
  const tb = gridTable('Здані роботи'); add(bot, tb); fillW(tb);
  const S = { none: ['Не здано', '#EEF1EB', '#4A544F'], sent: ['Очікує перевірки', '#FFF1C7', '#6B4A00'], late: ['Здано із запізненням', '#FBE1D8', '#8A2A12'], rework: ['На доопрацюванні', '#E2EAF4', '#1F4A7A'], graded: ['Оцінено', '#E3EFDA', '#184F3D'] };
  const subs = [['graded', '05.10, 18:12', '5'], ['sent', '06.10, 21:40', ''], ['sent', '07.10, 09:05', ''], ['none', '—', ''], ['graded', '04.10, 14:30', '4'], ['late', '08.10, 08:15', ''], ['sent', '07.10, 22:58', ''], ['rework', '03.10, 19:20', ''], ['graded', '05.10, 11:02', '5'], ['none', '—', '']];
  const hb = '#EEF2EB';
  add(tb, add(rowH(), box('№', 40, 40, { bg: hb, size: 12, wt: 6, color: '#5B6660' }), box('Студент', 220, 40, { left: true, bg: hb, size: 12, wt: 6, color: '#5B6660' }), box('Статус', 200, 40, { left: true, bg: hb, size: 12, wt: 6, color: '#5B6660' }), box('Здано', 120, 40, { left: true, bg: hb, size: 12, wt: 6, color: '#5B6660' }), box('Оцінка', 80, 40, { bg: hb, size: 12, wt: 6, color: '#5B6660' })));
  subs.forEach(([st, w, g], i) => { const bg = i === 1 ? '#E3EFDA' : '#FFFFFF'; const sc = AL('HORIZONTAL', { w: 200, h: 44, bg, px: 12, ca: 'CENTER' }); add(sc, pill(S[st][0], S[st][1], S[st][2])); add(tb, add(rowH(), box(i + 1, 40, 44, { bg, color: '#5B6660', wt: 4 }), box(names[i], 220, 44, { left: true, bg, wt: 5, size: 14 }), sc, box(w, 120, 44, { left: true, bg, wt: 4, color: '#5B6660' }), box(g, 80, 44, { bg, color: '#184F3D', size: 15 }))); });
  const rv = card('Перевірка роботи', 320); add(bot, rv);
  add(rv, caps('Перевірка'), T('Гнатюк Марко', { size: 18, w: 7 }), pill('Очікує перевірки', '#FFF1C7', '#6B4A00'));
  const f1 = AL('HORIZONTAL', { gap: 10, px: 12, h: 44, r: 6, stroke: '#E1E6DE', ca: 'CENTER' }); const ft = T('Гнатюк_казуси.docx'); add(f1, svg(icons['Домашні завдання'], '#184F3D'), ft, T('06.10, 21:40', { size: 12, color: '#5B6660' })); grow(ft); add(rv, f1); fillW(f1);
  add(rv, T('Версія 2 · попередня від 04.10 збережена', { size: 12, color: '#5B6660' }), T('Оцінка', { size: 13, w: 6 }));
  const gr = AL('HORIZONTAL', { gap: 6 }); ['5', '4', '3', '2'].forEach(v => { const b = box(v, 48, 44, { bg: v === '4' ? '#184F3D' : '#FFFFFF', color: v === '4' ? '#FFFFFF' : '#1A2420', size: 16 }); b.cornerRadius = 6; if (v !== '4') { b.strokes = F('#C9D3C6'); b.strokeWeight = 1; } add(gr, b); }); add(rv, gr);
  const cm = AL('VERTICAL', { gap: 6 }); const cb = AL('HORIZONTAL', { p: 10, r: 6, stroke: '#C9D3C6' }); add(cb, T('Казус 2: роль пособника визначено вірно, але бракує посилання на ч. 5 ст. 27 КК.', { width: 256, lh: 145 })); add(cm, T('Коментар студенту', { size: 13, w: 6 }), cb); add(rv, cm); fillW(cm); fillW(cb);
  const ba = AL('VERTICAL', { gap: 8 }); const b1 = btn('На доопрацювання'); b1.findOne(n => n.type === 'TEXT').fills = F('#8A2A12'); const b2 = btn('Оцінити → журнал', true); add(ba, b1, b2); add(rv, ba); fillW(ba); fillW(b1); fillW(b2); b1.primaryAxisAlignItems = 'CENTER'; b2.primaryAxisAlignItems = 'CENTER';
} catch (e) { errors.push('Домашні завдання: ' + e.message); }

// ---------- 5. Адмінка: відповіді ----------
try {
  const m = shell('Адмінка · Відповіді на тести', 2080, 1300, 'Звіти та відповіді');
  header(m, 'Звіти / Тести на лекціях', 'Відповіді студентів', [['Експорт у Excel']]);
  const fl = AL('HORIZONTAL', { gap: 12 }); add(fl, field('Група', 'ПД 5/25 БД', 160), field('Предмет', 'Кримінальне право', 220), field('Тест', '30.10 · 3 пара · Склад злочину', 320)); add(m, fl);
  const body = AL('HORIZONTAL', { gap: 24 }); add(m, body); fillW(body);
  const tb = gridTable('Матриця відповідей'); add(body, tb); fillW(tb);
  const hb = '#EEF2EB';
  add(tb, add(rowH(), box('№', 44, 40, { bg: hb, size: 12, wt: 6, color: '#5B6660' }), box('Студент', 210, 40, { left: true, bg: hb, size: 12, wt: 6, color: '#5B6660' }), ['П1', 'П2', 'П3', 'П4', 'П5'].map(p => box(p, 64, 40, { bg: hb, size: 12, wt: 6, color: '#5B6660' })), box('Бали', 80, 40, { bg: hb, size: 12, wt: 6, color: '#5B6660' }), box('Час', 64, 40, { bg: hb, size: 12, wt: 6, color: '#5B6660' })));
  const ok = ['B', 'C', 'AB']; const A = [['B', 'C', 'AB', '5', 'т'], ['B', 'C', 'A', '4', ''], ['A', 'C', 'AB', '4', ''], [null], ['B', 'C', 'AB', '5', 'т'], ['B', 'A', 'AB', '3', 'т'], ['B', 'C', 'ABC', '4', ''], ['C', 'C', 'AB', '3', ''], ['B', 'C', 'AB', '5', ''], ['B', 'D', 'A', '2', 'т']]; const tm = ['0:21', '0:34', '0:40', '—', '0:18', '0:39', '0:27', '0:44', '0:22', '0:41'];
  A.forEach((a, i) => { const bg0 = i === 5 ? '#F0F6EA' : '#FFFFFF'; const cells = [0, 1, 2, 3, 4].map(k => { const v = a[k]; if (v == null) return box('—', 64, 42, { bg: '#EEF1EB', color: '#5B6660' }); if (k === 3) return box(v, 64, 42, { bg: bg0 }); if (k === 4) return box(v ? 'текст' : '', 64, 42, { bg: bg0, color: '#1F4A7A', size: 12 }); const good = v === ok[k]; return box((good ? '✓ ' : '✗ ') + v, 64, 42, { bg: good ? '#E3EFDA' : '#FBE1D8', color: good ? '#184F3D' : '#8A2A12' }); }); const sc = a[0] == null ? 'не відп.' : [0, 1, 2].filter(k => a[k] === ok[k]).length + ' / 3'; add(tb, add(rowH(), box(i + 1, 44, 42, { bg: bg0, color: '#5B6660', wt: 4 }), box(names[i], 210, 42, { left: true, bg: bg0, wt: 5, size: 14 }), cells, box(sc, 80, 42, { bg: bg0, color: '#184F3D' }), box(tm[i], 64, 42, { bg: bg0, color: '#5B6660', wt: 4 }))); });
  const dp = card('Відповіді студента', 320, { gap: 12 }); add(body, dp);
  add(dp, caps('Відповіді студента'), T('Мельник Андрій', { size: 18, w: 7 }), T('Бали: 2 з 3 · у журнал: семінар 30.10', { size: 13, color: '#5B6660' }));
  [['1. Що є підставою кримінальної відповідальності?', '✓ Склад кримінального правопорушення', '#184F3D'], ['2. Що НЕ входить до складу правопорушення?', '✗ Об’єкт', '#8A2A12'], ['3. Форми вини (кілька варіантів)', '✓ Умисел, необережність', '#184F3D'], ['4. Наскільки зрозуміла тема? (1–5)', '3 з 5', '#1A2420'], ['5. Питання до лектора', '«Можна ще приклад про суб’єктивну сторону?»', '#1F4A7A']].forEach(([q, a, c]) => { const g = AL('VERTICAL', { gap: 4, pt: 10 }); g.strokes = F('#EEF1EB'); g.strokeTopWeight = 1; g.strokeBottomWeight = 0; g.strokeLeftWeight = 0; g.strokeRightWeight = 0; add(g, T(q, { size: 13, color: '#5B6660', width: 280 }), T(a, { size: 15, w: 6, color: c, width: 280 })); add(dp, g); });
} catch (e) { errors.push('Відповіді: ' + e.message); }

// ---------- Екрани застосунку (Montserrat) ----------
FAM = 'Montserrat';
const grad = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [{ position: 0, color: { r: 26 / 255, g: 26 / 255, b: 34 / 255, a: 1 } }, { position: 1, color: { r: 19 / 255, g: 35 / 255, b: 94 / 255, a: 1 } }] }];
function phone(name, x, y, title) { const f = AL('VERTICAL', { name, w: 440, h: 956, bg: '#E7E9F0', px: 16, pt: 64, gap: 18, clip: true }); f.paddingBottom = 40; f.x = x; f.y = y; const h = AL('HORIZONTAL', { gap: 14, ca: 'CENTER' }); const ar = figma.createNodeFromSvg('<svg width="30" height="27" viewBox="0 0 30 27" fill="none" stroke="#1B2A6B" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M27 13.5H4M13 3L3 13.5 13 24"/></svg>'); ar.name = 'icon/back'; add(h, ar, T(title, { size: 29, w: 7, color: '#1E1E1E' })); add(f, h); return f; }
const acard = () => { const c = AL('VERTICAL', { bg: '#FFFFFF', r: 16, p: 18, gap: 12, name: 'card' }); c.effects = shadow; return c; };
function cta(f, s) { const sp = AL('VERTICAL', { name: 'spacer' }); add(f, sp); fillW(sp); grow(sp); const b = AL('HORIZONTAL', { h: 58, r: 10, ca: 'CENTER', pa: 'CENTER', gap: 10, name: 'button/primary' }); b.fills = grad; add(b, T(s, { size: 17, w: 6, color: '#FFFFFF' })); add(f, b); fillW(b); }
try {
  const f = phone('Застосунок · Тест', 4620, 0, 'Тест');
  const sub = AL('VERTICAL', { gap: 6 }); add(sub, T('Кримінальне право', { size: 21, w: 6, color: '#1E1E1E' }), T('Лекція · 3 пара · онлайн у Zoom', { color: '#5F6475' })); add(f, sub);
  const c = acard(); add(f, c); fillW(c);
  const tm = AL('HORIZONTAL', { px: 12, py: 5, r: 6, bg: '#FDE3D3' }); add(tm, T('Залишилось 0:45', { w: 7, color: '#A8380A' }));
  add(c, tm, T('Питання 1 з 1', { color: '#5F6475' }), T('Що є підставою кримінальної відповідальності?', { size: 22, w: 7, color: '#1E1E1E', width: 370, lh: 130 }));
  [['Вина особи', false], ['Склад кримінального правопорушення', true], ['Суспільна небезпека діяння', false]].forEach(([t, on]) => { const r = AL('HORIZONTAL', { gap: 18, px: 18, py: 16, r: 12, ca: 'CENTER', bg: on ? '#FFF0E6' : '#FFFFFF', stroke: on ? '#F26B1D' : '#D9DCE6', sw: 2, name: 'option' }); const d = figma.createEllipse(); d.resize(26, 26); if (on) { d.fills = F('#F26B1D'); } else { d.fills = F('#FFFFFF'); d.strokes = F('#9A9EB0'); d.strokeWeight = 3; } add(r, d, T(t, { size: 17, w: on ? 7 : 5, color: '#1E1E1E', width: 280 })); add(c, r); fillW(r); });
  const pb = AL('HORIZONTAL', { h: 8, r: 4, bg: '#D9DCE6', clip: true }); const pf = figma.createRectangle(); pf.resize(312, 8); pf.cornerRadius = 4; pf.fills = F('#F26B1D'); add(pb, pf); add(c, pb); fillW(pb);
  const pr = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN' }); add(pr, T('Відповіли', { size: 15, color: '#5F6475' }), T('32 з 38', { size: 15, w: 7, color: '#1E1E1E' })); add(c, pr); fillW(pr);
  cta(f, 'Відповісти →');
} catch (e) { errors.push('Застосунок · Тест: ' + e.message); }
try {
  const f = phone('Застосунок · Домашнє завдання', 1540, 1300, 'Домашнє завдання');
  add(f, T('Кримінальне право', { size: 21, w: 6, color: '#1E1E1E' }));
  const c1 = acard(); add(f, c1); fillW(c1);
  const h1 = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN', ca: 'MIN' }); const d2 = AL('HORIZONTAL', { px: 10, py: 4, r: 6, bg: '#FDE3D3' }); add(d2, T('2 дні', { size: 13, w: 7, color: '#A8380A' })); add(h1, T('Домашнє завдання до 7 жовтня', { size: 17, w: 6, color: '#1E1E1E' }), d2); add(c1, h1); fillW(h1);
  const l1 = AL('HORIZONTAL', { gap: 12 }); add(l1, svg('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 14l2 2 4-4"/>', '#6B6F80', 24), T('Розв’язати 3 казуси: вид співучасті та роль кожного', { size: 16, color: '#5F6475', width: 300, lh: 140 })); add(c1, l1);
  const l2 = AL('HORIZONTAL', { gap: 12, ca: 'CENTER' }); add(l2, svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', '#6B6F80', 24), T('Казуси_співучасть.pdf', { size: 16, w: 6, color: '#1B2A6B' })); add(c1, l2);
  const c2 = acard(); add(f, c2); fillW(c2);
  const h2 = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN', ca: 'CENTER' }); const sd = AL('HORIZONTAL', { px: 10, py: 4, r: 6, bg: '#ECEEF4' }); add(sd, T('Чернетка', { size: 13, w: 7, color: '#4A4F60' })); add(h2, T('Моя відповідь', { size: 17, w: 6, color: '#1E1E1E' }), sd); add(c2, h2); fillW(h2);
  const fr = AL('HORIZONTAL', { gap: 12, px: 14, h: 52, r: 12, stroke: '#D9DCE6', sw: 2, ca: 'CENTER', name: 'file' }); const fn = T('Казуси_Мельник.pdf', { size: 15, w: 6, color: '#1E1E1E' }); add(fr, svg(icons['Домашні завдання'], '#F26B1D', 22), fn, T('1,2 МБ', { size: 13, color: '#5F6475' })); grow(fn); add(c2, fr); fillW(fr);
  const up = AL('HORIZONTAL', { h: 64, r: 12, bg: '#F5F6FA', stroke: '#9A9EB0', sw: 2, dash: true, ca: 'CENTER', pa: 'CENTER', name: 'upload' }); add(up, T('+  Додати файл або фото', { size: 15, w: 6, color: '#1B2A6B' })); add(c2, up); fillW(up);
  add(c2, T('PDF, DOCX, JPG · до 20 МБ', { size: 13, color: '#5F6475' }));
  const c3 = acard(); add(f, c3); fillW(c3);
  const h3 = AL('HORIZONTAL', { pa: 'SPACE_BETWEEN', ca: 'CENTER' }); add(h3, T('Есе: склад злочину', { size: 16, w: 6, color: '#1E1E1E' }), T('5', { size: 20, w: 7, color: '#F26B1D' })); add(c3, h3); fillW(h3);
  add(c3, T('Викладач: «Добре аргументовано, гарні приклади з практики».', { size: 14, color: '#5F6475', width: 368, lh: 145 }));
  cta(f, 'Здати роботу →');
} catch (e) { errors.push('Застосунок · ДЗ: ' + e.message); }

figma.viewport.scrollAndZoomIntoView(page.children.filter(n => n.id !== compArea.id));
if (errors.length) figma.notify('Готово з помилками: ' + errors.join('; '), { error: true, timeout: 15000 });
else figma.notify('Готово: 7 екранів на сторінці «Campus Learn — макети»');
} catch (e) {
  figma.notify('Помилка: ' + e.message, { error: true, timeout: 15000 });
}
})();
