import baseEpisodes from "./episodes.base.json";
import thumbnailManifest from "./episode-thumbnails.generated.json";
import {
  defaultSupportLinks,
  episodeOverridesByYoutubeId,
  type EpisodeKind,
  type EpisodeParticipant,
  type EpisodeSupportLink,
  type EpisodeTimestamp,
} from "./episodes.overrides";
import { defaultHosts } from "./people";

export type Episode = {
  slug: string;
  kind: EpisodeKind;
  title: string;
  dateLabel: string;
  publishedAt: string;
  duration: string;
  youtubeId: string;
  description: string;
  sourceEpisodeSlug?: string;
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

const DESCRIPTION_PLACEHOLDER = "Описание скоро будет.";
const thumbnailByYoutubeId = thumbnailManifest as Record<string, string>;

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid ${field}: expected non-empty string`);
  }
  return value;
}

function assertMaybeEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${field}: expected string`);
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
    description: assertMaybeEmptyString(
      record.description,
      `episodes.base[${index}].description`,
    ),
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

function toDurationSeconds(durationIso: string): number {
  const match = durationIso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return 0;
  const hours = Number.parseInt(match[1] ?? "0", 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const seconds = Number.parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function inferEpisodeKind(durationIso: string): EpisodeKind {
  const seconds = toDurationSeconds(durationIso);
  if (seconds <= 180) return "shorts";
  if (seconds > 180 && seconds < 25 * 60) return "video";
  return "episode";
}

function hasGuestParticipant(participants?: EpisodeParticipant[]): boolean {
  return Boolean(participants?.some((participant) => participant.isGuest));
}

function getRelativeDateLabel(isoDate: string): string {
  const published = new Date(isoDate);
  if (Number.isNaN(published.getTime())) return "Недавно";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(published);
}

function normalizeEpisodes(): Episode[] {
  const records = baseEpisodes.map(assertBaseRecord);

  return records
    .map((record) => {
      const override = episodeOverridesByYoutubeId[record.youtubeId];
      const title = override?.slug ? record.title : record.title.trim();
      const generatedSlug = slugify(title);
      const inferredKind = inferEpisodeKind(record.durationIso);
      const effectiveKind =
        override?.kind ??
        (hasGuestParticipant(override?.participants) ? "special" : inferredKind);
      return {
        slug: (override?.slug ?? generatedSlug) || record.youtubeId.toLowerCase(),
        kind: effectiveKind,
        title: record.title,
        dateLabel: getRelativeDateLabel(record.publishedAt),
        publishedAt: record.publishedAt.slice(0, 10),
        duration: toClockDuration(record.durationIso),
        youtubeId: record.youtubeId,
        description: override?.description ?? DESCRIPTION_PLACEHOLDER,
        sourceEpisodeSlug: override?.sourceEpisodeSlug,
        participants: override?.participants ?? defaultHosts,
        timestamps: [],
        supportLinks: override?.supportLinks ?? defaultSupportLinks,
        cover: override?.cover ?? thumbnailByYoutubeId[record.youtubeId] ?? record.thumbnailUrl,
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
  shorts: "Shorts",
};

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodes.find((episode) => episode.slug === slug);
}

export function getEpisodeNeighbors(slug: string, count = 4): Episode[] {
  return episodes.filter(
    (episode) => episode.slug !== slug && episode.kind !== "shorts",
  ).slice(0, count);
}

export function getSourceEpisodeForShort(shortEpisode: Episode): Episode | undefined {
  if (shortEpisode.kind !== "shorts") return undefined;

  if (shortEpisode.sourceEpisodeSlug) {
    return episodes.find(
      (episode) => episode.slug === shortEpisode.sourceEpisodeSlug && episode.kind !== "shorts",
    );
  }

  const shortIndex = episodes.findIndex((episode) => episode.slug === shortEpisode.slug);
  if (shortIndex < 0) return undefined;

  for (let i = shortIndex + 1; i < episodes.length; i += 1) {
    const candidate = episodes[i];
    if (candidate.kind !== "shorts") return candidate;
  }
  for (let i = shortIndex - 1; i >= 0; i -= 1) {
    const candidate = episodes[i];
    if (candidate.kind !== "shorts") return candidate;
  }
  return undefined;
}

export function getMoreShortsFromSameSource(shortEpisode: Episode, count = 6): Episode[] {
  const source = getSourceEpisodeForShort(shortEpisode);
  if (!source) return [];

  return episodes
    .filter((episode) => {
      if (episode.kind !== "shorts") return false;
      if (episode.slug === shortEpisode.slug) return false;
      const currentSource = getSourceEpisodeForShort(episode);
      return currentSource?.slug === source.slug;
    })
    .slice(0, count);
}
