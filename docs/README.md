# TOLK Documentation

Единая точка входа в документацию проекта.

## Main Tracks

- `design/README.md` — дизайн-контракты, визуальная паритетность, baseline-процессы
- `developer/README.md` — инженерные runbook'и, data workflows, эксплуатация скриптов

## Fast Paths

- Источник дизайн-истины: `design/source-of-truth.md`
- Правила визуальной регрессии: `design/visual-regression.md`
- Модель данных эпизодов: `developer/episodes-data-model.md`
- Синк выпусков из YouTube: `developer/runbooks/sync-episodes.md`

## Navigation Rules

- Изменения UI должны сверяться с `design/*`.
- Изменения data pipeline и скриптов — документировать в `developer/*`.
- Не дублировать длинные инструкции в нескольких местах; использовать ссылки на canonical doc.
