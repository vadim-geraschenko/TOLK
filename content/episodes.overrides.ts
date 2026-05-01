export type EpisodeKind = "episode" | "special" | "stream-record" | "video";

export type EpisodeTimestamp = {
  label: string;
  at: string;
  seconds: number;
};

export type EpisodeParticipant = {
  name: string;
  avatar: string;
  role: string;
  isGuest?: boolean;
  guestNote?: string;
};

export type EpisodeSupportLink = {
  label: string;
  href: string;
};

export type EpisodeOverride = {
  slug?: string;
  kind?: EpisodeKind;
  dateLabel?: string;
  cover?: string;
  coverAlt?: string;
  participants?: EpisodeParticipant[];
  timestamps?: EpisodeTimestamp[];
  supportLinks?: EpisodeSupportLink[];
};

export const defaultSupportLinks: EpisodeSupportLink[] = [
  { label: "Поддержать на Boosty", href: "#" },
  { label: "Мерч TOLK", href: "#" },
];

export const episodeOverridesByYoutubeId: Record<string, EpisodeOverride> = {
  "aqz-KE-bpKQ": {
    slug: "ecclesiastes",
    kind: "special",
    dateLabel: "9 дней назад",
    cover: "/home/assets/episode-ecclesiastes.jpg",
    coverAlt: "Превью выпуска про Екклесиаста",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg", role: "Ведущий" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg", role: "Ведущий" },
      {
        name: "Кирилл",
        avatar: "/home/assets/host-kirill.png",
        role: "Гость",
        isGuest: true,
        guestNote: "Библеист, исследователь раннехристианской литературы",
      },
    ],
    timestamps: [
      { label: "Вступление", at: "00:00", seconds: 0 },
      { label: "Контекст книги", at: "06:52", seconds: 412 },
      { label: "Суета и смысл", at: "39:18", seconds: 2358 },
      { label: "Финальные выводы", at: "1:57:43", seconds: 7063 },
    ],
    supportLinks: defaultSupportLinks,
  },
  ipCHGXdNtAo: {
    slug: "samson",
    kind: "special",
    dateLabel: "3 недели назад",
    cover: "/home/assets/episode-samson.jpg",
    coverAlt: "Превью выпуска про Самсона",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg", role: "Ведущий" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg", role: "Ведущий" },
      { name: "Валентин", avatar: "/home/assets/host-valentin.jpg", role: "Ведущий" },
      {
        name: "Артем",
        avatar: "/home/assets/host-artem.jpg",
        role: "Гость",
        isGuest: true,
        guestNote: "Историк и исследователь культуры Древнего Востока",
      },
    ],
    timestamps: [],
    supportLinks: defaultSupportLinks,
  },
  "thomas-demo-video-id": {
    slug: "thomas",
    kind: "video",
    dateLabel: "1 месяц назад",
    cover: "/home/assets/episode-thomas.jpg",
    coverAlt: "Превью выпуска про Евангелие от Фомы",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg", role: "Ведущий" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg", role: "Ведущий" },
      { name: "Валентин", avatar: "/home/assets/host-valentin.jpg", role: "Ведущий" },
    ],
    timestamps: [
      { label: "Что такое апокриф", at: "00:00", seconds: 0 },
      { label: "История текста", at: "18:10", seconds: 1090 },
      { label: "Ключевые логии", at: "52:14", seconds: 3134 },
    ],
    supportLinks: defaultSupportLinks,
  },
  "isaac-demo-video-id": {
    slug: "isaac",
    kind: "episode",
    dateLabel: "2 месяца назад",
    cover: "/home/assets/episode-isaac.jpg",
    coverAlt: "Превью выпуска про женитьбу Исаака",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg", role: "Ведущий" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg", role: "Ведущий" },
      { name: "Валентин", avatar: "/home/assets/host-valentin.jpg", role: "Ведущий" },
    ],
    timestamps: [
      { label: "Смерть Сарры", at: "00:00", seconds: 0 },
      { label: "Поиск невесты", at: "17:45", seconds: 1065 },
      { label: "Ревекка и Исаак", at: "49:02", seconds: 2942 },
    ],
    supportLinks: defaultSupportLinks,
  },
};
