// Аудит сторінки «Campus Learn — макети»: що все редаговане, без картинок, без обрізаного тексту.
// Заодно виправляє таблиці, що не розтягуються на всю ширину.
const page = figma.root.children.find(p => p.name === 'Campus Learn — макети');
await figma.setCurrentPageAsync(page);

// 1. Виправлення ширини таблиць: рядки й колонка «Студент» тягнуться на всю ширину
let fixed = 0;
for (const name of ['Здані роботи', 'Матриця відповідей']) {
  for (const tb of page.findAll(n => n.type === 'FRAME' && n.name === name)) {
    for (const row of tb.children) {
      if (row.type !== 'FRAME') continue;
      row.layoutSizingHorizontal = 'FILL';
      const nameCell = row.children[1];
      if (nameCell) { nameCell.layoutSizingHorizontal = 'FILL'; fixed++; }
    }
  }
}

// 2. Аудит
const report = [];
for (const top of page.children) {
  const all = top.findAll(() => true);
  const types = {};
  let images = 0, hidden = 0, locked = 0, clipped = 0, emptyText = 0, missingFont = 0;
  for (const n of all) {
    types[n.type] = (types[n.type] || 0) + 1;
    if ('fills' in n && Array.isArray(n.fills) && n.fills.some(f => f.type === 'IMAGE')) images++;
    if (n.visible === false) hidden++;
    if (n.locked) locked++;
    if (n.type === 'TEXT') {
      if (!n.characters.trim()) emptyText++;
      if (n.hasMissingFont) missingFont++;
      const p = n.parent;
      if (p && 'width' in p && p.clipsContent && (n.x + n.width > p.width + 1 || n.y + n.height > p.height + 1)) clipped++;
    }
  }
  report.push({ name: top.name, w: Math.round(top.width), h: Math.round(top.height), layers: all.length, text: types.TEXT || 0, frames: types.FRAME || 0, instances: types.INSTANCE || 0, components: types.COMPONENT || 0, vectors: (types.VECTOR || 0), images, hidden, locked, clipped, emptyText, missingFont });
}
print('Виправлено рядків таблиць: ' + fixed);
const sum = k => report.reduce((s, r) => s + r[k], 0);
const bad = report.filter(r => r.images || r.clipped || r.missingFont || r.hidden || r.locked || r.emptyText).map(r => r.name);
print(`ЕКРАНІВ ${report.length} | шарів ${sum('layers')} | текстів ${sum('text')} | інстансів ${sum('instances')} | КАРТИНОК ${sum('images')} | ОБРІЗАНИХ ${sum('clipped')} | БЕЗ ШРИФТУ ${sum('missingFont')} | ПРИХОВАНИХ ${sum('hidden')} | ЗАБЛОК. ${sum('locked')} | ПОРОЖНІХ ТЕКСТІВ ${sum('emptyText')} | проблемні: ${bad.join(', ') || 'немає'}`);
