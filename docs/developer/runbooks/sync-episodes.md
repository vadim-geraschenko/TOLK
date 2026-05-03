# Runbook: Sync Episodes

Синхронизирует выпуски из YouTube в `content/episodes.base.json`.

## Preconditions

1. Включен `YouTube Data API v3` в Google Cloud проекте.
2. Есть `YOUTUBE_API_KEY`.
3. Есть `YOUTUBE_CHANNEL_ID` или `YOUTUBE_UPLOADS_PLAYLIST_ID`.

## Local Setup

Создай `.env.local` в корне проекта:

```bash
YOUTUBE_API_KEY=...
YOUTUBE_CHANNEL_ID=UCQSo5k6wZ4HxmBqbqFuUW7Q
```

`.env.local` не коммитится (игнорируется git).

## Run

```bash
set -a
source .env.local
set +a
npm run sync:episodes
```

Ожидаемый успех:

`Synced <N> videos -> .../content/episodes.base.json`

## After Sync Checklist

1. Проверить `content/episodes.base.json` (обновились реальные `youtubeId`, даты, длительности).
2. Для новых `youtubeId` добавить override в `content/episodes.overrides.ts`.
3. Проверить `slug`/`kind` у ключевых роликов.
4. Проверить сборку:

```bash
npm run build
```

## Common Issues

- В base остались старые demo-id:
  - sync не выполнился или запускался не из корня проекта.
- `Missing required env`:
  - не загружены переменные окружения.
- `YouTube API 403`:
  - ключ некорректен, отключен API или исчерпана квота.
