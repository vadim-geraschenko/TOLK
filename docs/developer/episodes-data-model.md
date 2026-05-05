# Episodes Data Model

## Files

- `content/episodes.base.json`
  - автослой из YouTube API
  - поля: `youtubeId`, `title`, `description`, `publishedAt`, `durationIso`, `thumbnailUrl`
- `content/episode-thumbnails.generated.json`
  - автослой локальных WebP-превью, созданный `npm run sync:thumbnails`
  - маппинг `youtubeId -> /episodes/thumbnails/<youtubeId>.webp`
- `content/episodes.overrides.ts`
  - ручные проектные поля:
  - `slug`, `kind`, `participants`, `timestamps`, `supportLinks`, `cover`, `coverAlt`, `dateLabel`
- `content/episodes.data.ts`
  - нормализация + валидация
  - объединяет base+overrides в итоговый `Episode[]`
- `content/episodes.ts`
  - публичный фасад для UI

## Why This Split

- YouTube API даёт только “сырьё”.
- YouTube thumbnails не грузятся в UI напрямую: внешний `i.ytimg.com` медленный и может таймаутиться.
- Контентные решения проекта (типы выпусков, участники, таймкоды, лейблы) живут отдельно и не теряются при sync.

## Rules

- Не редактировать `episodes.base.json` вручную как долгосрочный источник.
- Не ссылаться из UI на YouTube thumbnails напрямую; после `sync:episodes` запускать `sync:thumbnails`.
- В UI не импортировать `episodes.data.ts` напрямую; использовать `content/episodes.ts`.
- Для новых видео без override допустимы дефолты, но перед публикацией override должен быть заполнен.
