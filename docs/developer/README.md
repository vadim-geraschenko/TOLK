# Developer Docs

Практичная документация для разработки и операционных задач.

## Start Here

- `episodes-data-model.md` — как устроен слой данных выпусков
- `runbooks/sync-episodes.md` — как синхронизировать выпуски с YouTube

## Conventions

- UI/роуты импортируют эпизоды из `content/episodes.ts` (фасад).
- `content/episodes.base.json` — машинный base-слой, обновляется скриптом.
- `content/episodes.overrides.ts` — ручные редакторские поля.

## Related Design Docs

- `../design/source-of-truth.md`
- `../design/parity-rules.md`
- `../design/visual-regression.md`
