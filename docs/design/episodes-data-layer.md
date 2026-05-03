# Episodes Data Layer

## Source of truth

`content/episodes.base.json` is the auto-synced base dataset from YouTube API.

Each item keeps only stable source fields:

- `youtubeId`
- `title`
- `description`
- `publishedAt`
- `durationIso`
- `thumbnailUrl`

## Manual editorial layer

`content/episodes.overrides.ts` keeps project-specific fields that YouTube does not know:

- `slug`
- `kind`
- participants / guest notes
- curated timestamps
- support links
- cover override
- custom date label (optional)

## Runtime adapter

`content/episodes.data.ts` validates and normalizes base + overrides to typed `Episode[]` used by pages.

`content/episodes.ts` is a stable facade export used by UI.

## Sync command

```bash
YOUTUBE_API_KEY=... YOUTUBE_CHANNEL_ID=... npm run sync:episodes
```

Or use uploads playlist directly:

```bash
YOUTUBE_API_KEY=... YOUTUBE_UPLOADS_PLAYLIST_ID=... npm run sync:episodes
```

After sync:

1. Review updated `content/episodes.base.json`.
2. Update `content/episodes.overrides.ts` for new videos (slug/kind/participants/timestamps).
3. Run `npm run build`.
