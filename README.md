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
