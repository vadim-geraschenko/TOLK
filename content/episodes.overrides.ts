export type EpisodeKind =
  | "episode"
  | "special"
  | "stream-record"
  | "video"
  | "shorts";

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
  description?: string;
  sourceEpisodeSlug?: string;
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
  "2bNB5xfAAI8": {
    slug: "ecclesiastes",
    kind: "special",
    description:
      "Спецвыпуск наших чтений. Вместе с Кириллом Кириченко читаем и обсуждаем Екклесиаста — одну из самых мрачных, странных и философски насыщенных книг Библии.",
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
    description:
      "Спецвыпуск наших чтений. Вместе с Артемом Широковым читаем Книгу Судей, а именно историю Самсона. Пытаемся понять какого происхождения сила Самсона и в чем праведность этого персонажа Библии.",
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
  lRx_FEXKac0: {
    slug: "thomas",
    kind: "special",
    description:
      "Спецвыпуск: обсуждаем один из самых известных раннехристианских апокрифов и сравниваем его с каноническими текстами.",
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
  "Na-LoqoMp4I": {
    slug: "isaac",
    kind: "episode",
    description:
      "Читаем и обсуждаем Бытие 23–25: смерть Сарры, женитьбу Исаака и последствия решений патриархов.",
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
  l9xkYRd1LTg: {
    kind: "stream-record",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg", role: "Ведущий" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg", role: "Ведущий" },
    ],
  },
  FtOMsIyNOug: {
    kind: "special",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg", role: "Ведущий" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg", role: "Ведущий" },
      {
        name: "Серафим",
        avatar: "/home/assets/host-serafim.png",
        role: "Гость",
        isGuest: true,
        guestNote: "Серафим Сашлиев",
      },
    ],
  },
  "1D7eI7xANsk": {
    kind: "special",
  },
  "Ytd_yy-Rr4E": {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  "oDaNfYsB_yI": {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  "4jHYlye1uDE": {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  "pj6erjC-KB0": {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  w5IxEebpEMA: {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  "14OIzOxW9J8": {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  "HFCTS7EKpUk": {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  "8gYyAKMV0qE": {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  X5EAGE7xF8w: {
    sourceEpisodeSlug: "vse-vetvi-hristianstva-za-14-minut",
  },
  "NzWJrbgzb6I": {
    sourceEpisodeSlug: "chitaem-bibliyu-s-samogo-nachala-sotvorenie-mira",
  },
  "9Cf9ZvUf1T8": {
    sourceEpisodeSlug: "silneyshie-argumenty-v-polzu-suschestvovaniya-boga",
  },
  "YtsridQj4KQ": {
    sourceEpisodeSlug: "silneyshie-argumenty-v-polzu-suschestvovaniya-boga",
  },
  "mFP6tLu8xwU": {
    sourceEpisodeSlug: "silneyshie-argumenty-v-polzu-suschestvovaniya-boga",
  },
  "t_q0M_hp48Y": {
    sourceEpisodeSlug: "isaac",
  },
  "WzUE2SvyM2s": {
    sourceEpisodeSlug: "isaac",
  },
  "37t4zvHNASQ": {
    sourceEpisodeSlug: "isaac",
  },
  "ABgcg--GRr4": {
    sourceEpisodeSlug: "isaac",
  },
  "sgD7VMe6jVk": {
    sourceEpisodeSlug: "isaac",
  },
  "sJsKh0r-GBI": {
    sourceEpisodeSlug: "isaac",
  },
  "CPB4HmArpXw": {
    sourceEpisodeSlug: "chitaem-bibliyu-bog-reshaet-ubit-chelovechestvo",
  },
  "jHQ0bWLB9eQ": {
    sourceEpisodeSlug: "filosof-v-shoke-ot-panchina-reaktsiya-na-moral-bez-boga-tolk",
  },
  "VnmS0mxze08": {
    sourceEpisodeSlug: "filosof-v-shoke-ot-panchina-reaktsiya-na-moral-bez-boga-tolk",
  },
};
