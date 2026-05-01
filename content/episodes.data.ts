import baseEpisodes from "./episodes.base.json";
import {
  defaultSupportLinks,
  episodeOverridesByYoutubeId,
  type EpisodeKind,
  type EpisodeParticipant,
  type EpisodeSupportLink,
  type EpisodeTimestamp,
} from "./episodes.overrides";

export type Episode = {
  slug: string;
  kind: EpisodeKind;
  title: string;
  dateLabel: string;
  publishedAt: string;
  duration: string;
  youtubeId: string;
  description: string;
  participants: EpisodeParticipant[];
  timestamps: EpisodeTimestamp[];
  supportLinks: EpisodeSupportLink[];
  cover: string;
  coverAlt: string;
};

type EpisodeBaseRecord = {
  youtubeId: string;
  title: string;
  description: string;
  publishedAt: string;
  durationIso: string;
  thumbnailUrl: string;
};

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid ${field}: expected non-empty string`);
  }
  return value;
}

function assertBaseRecord(value: unknown, index: number): EpisodeBaseRecord {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid base episode at index ${index}`);
  }
  const record = value as Record<string, unknown>;
  return {
    youtubeId: assertString(record.youtubeId, `episodes.base[${index}].youtubeId`),
    title: assertString(record.title, `episodes.base[${index}].title`),
    description: assertString(record.description, `episodes.base[${index}].description`),
    publishedAt: assertString(record.publishedAt, `episodes.base[${index}].publishedAt`),
    durationIso: assertString(record.durationIso, `episodes.base[${index}].durationIso`),
    thumbnailUrl: assertString(record.thumbnailUrl, `episodes.base[${index}].thumbnailUrl`),
  };
}

function slugify(value: string): string {
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  const normalized = value
    .toLowerCase()
    .split("")
    .map((char) => translit[char] ?? char)
    .join("");

  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function toClockDuration(durationIso: string): string {
  const match = durationIso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return "0:00";

  const hours = Number.parseInt(match[1] ?? "0", 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const seconds = Number.parseInt(match[3] ?? "0", 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getRelativeDateLabel(isoDate: string): string {
  const now = new Date();
  const published = new Date(isoDate);
  if (Number.isNaN(published.getTime())) return "Недавно";

  const diffDays = Math.max(
    0,
    Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffDays < 1) return "Сегодня";
  if (diffDays === 1) return "1 день назад";
  if (diffDays < 7) return `${diffDays} дней назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  return `${Math.floor(diffDays / 30)} мес. назад`;
}

function normalizeEpisodes(): Episode[] {
  const records = baseEpisodes.map(assertBaseRecord);

  return records
    .map((record) => {
      const override = episodeOverridesByYoutubeId[record.youtubeId];
      const title = override?.slug ? record.title : record.title.trim();
      const generatedSlug = slugify(title);
      return {
        slug: (override?.slug ?? generatedSlug) || record.youtubeId.toLowerCase(),
        kind: override?.kind ?? "video",
        title: record.title,
        dateLabel: override?.dateLabel ?? getRelativeDateLabel(record.publishedAt),
        publishedAt: record.publishedAt.slice(0, 10),
        duration: toClockDuration(record.durationIso),
        youtubeId: record.youtubeId,
        description: record.description,
        participants: override?.participants ?? [],
        timestamps: override?.timestamps ?? [],
        supportLinks: override?.supportLinks ?? defaultSupportLinks,
        cover: override?.cover ?? record.thumbnailUrl,
        coverAlt: override?.coverAlt ?? `Превью выпуска ${record.title}`,
      } satisfies Episode;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export const episodes: Episode[] = normalizeEpisodes();

export const episodeKindLabels: Record<EpisodeKind, string> = {
  episode: "Выпуск",
  special: "Спецвыпуск",
  "stream-record": "Запись стрима",
  video: "Видео",
};

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodes.find((episode) => episode.slug === slug);
}

export function getEpisodeNeighbors(slug: string, count = 4): Episode[] {
  const index = episodes.findIndex((episode) => episode.slug === slug);
  if (index < 0) return episodes.slice(0, count);
  return episodes.filter((episode) => episode.slug !== slug).slice(0, count);
}
