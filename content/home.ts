export type HomeParticipant = {
  name: string;
  avatar: string;
  perspective: string;
};

export type HomeSocial = {
  name: string;
  href: string;
  icon: string;
  iconClass: string;
  description: string;
};

export type HomeEpisodeParticipant = {
  name: string;
  avatar: string;
  guest?: boolean;
};

export type HomeEpisode = {
  id: string;
  kind: "episode" | "special" | "stream-record" | "video";
  title: string;
  meta: string;
  duration: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  summary?: string;
  description: string;
  participants: HomeEpisodeParticipant[];
  guestLabel?: string;
};

const HOME_EPISODES_LIMIT = 4;

function toHomeEpisodeDescription(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= 520) return normalized;
  return `${normalized.slice(0, 517).trimEnd()}...`;
}

export const homeParticipants: HomeParticipant[] = [
  {
    name: "Тарас",
    avatar: "/home/assets/host-taras.jpg",
    perspective: "Скептический и атеистический взгляд.",
  },
  {
    name: "Мурат",
    avatar: "/home/assets/host-murat.jpg",
    perspective: "Ортодоксальная перспектива традиции.",
  },
  {
    name: "Валентин",
    avatar: "/home/assets/host-valentin.jpg",
    perspective: "Личный и внеконфессиональный поиск.",
  },
];

export const homeSocials: HomeSocial[] = [
  {
    name: "Telegram",
    href: "#",
    icon: "/assets/socials-telegram.svg",
    iconClass: "icon-telegram",
    description: "Анонсы, короткие посты и текущая жизнь проекта.",
  },
  {
    name: "YouTube",
    href: "#",
    icon: "/assets/socials-youtube.svg",
    iconClass: "icon-youtube",
    description:
      "Подскасты, записи чтений и стримов, shorts и познавательный контент.",
  },
  {
    name: "Boosty",
    href: "#",
    icon: "/assets/socials-boosty.svg",
    iconClass: "icon-boosty",
    description: "Поддержка проекта и доступ к доп. материалам.",
  },
];

export const homeEpisodes: HomeEpisode[] = episodes
  .filter(
    (
      episode,
    ): episode is typeof episode & {
      kind: "episode" | "special" | "stream-record" | "video";
    } => episode.kind !== "shorts",
  )
  .slice(0, HOME_EPISODES_LIMIT)
  .map((episode) => {
    const guest = episode.participants.find((participant) => participant.isGuest);
    return {
      id: episode.slug,
      kind: episode.kind,
      title: episode.title,
      meta: episode.dateLabel,
      duration: episode.duration,
      image: episode.cover,
      imageAlt: episode.coverAlt,
      imageWidth: 1280,
      imageHeight: 720,
      summary: episode.description,
      description: toHomeEpisodeDescription(episode.description),
      participants: episode.participants.map((participant) => ({
        name: participant.name,
        avatar: participant.avatar,
        guest: participant.isGuest,
      })),
      guestLabel: guest ? `Гость: ${guest.name}` : undefined,
    };
  });
import { episodes } from "./episodes";
