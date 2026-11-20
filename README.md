# kuivp

Демо Campus (KUIVP): адмінка та застосунок студента.

- `prototype/oplaty.html` — HTML-прототип розділу «Оплати» адмінки: історія оплат у форматі відомості й на весь термін навчання, картка студента, внесення оплати, тарифи, звіти. Дані вигадані.
- `figma-plugin-campus-learn/` — локальний плагін Figma, що будує макети «Campus Learn — макети» (кабінет викладача, адмінка, екрани застосунку).

## Як подивитися прототип

```bash
python3 -m http.server 8765 --directory prototype
```

Потім відкрити http://localhost:8765/oplaty.html

## Як запустити плагін у Figma

Plugins → Development → Import plugin from manifest… → `figma-plugin-campus-learn/manifest.json` → запустити.

## Netlify

Сайт: https://kuivp-oplaty.netlify.app

Збірка: `sh scripts/build.sh` → `dist/index.html` (налаштовано в `netlify.toml`).

```bash
npx netlify-cli deploy --prod --dir dist   # сайт прив’язаний через .netlify/state.json (не в git); інакше додайте --site ea141f7a-164c-4680-99aa-a65d297b5612
```
