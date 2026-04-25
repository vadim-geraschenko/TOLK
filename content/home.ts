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

export const homeEpisodes: HomeEpisode[] = [
  {
    id: "ecclesiastes",
    title: "Читаем Екклесиаста с Кириллом Кириченко",
    meta: "9 дней назад",
    duration: "2:14:22",
    image: "/home/assets/episode-ecclesiastes.jpg",
    imageAlt: "Превью выпуска Читаем Екклесиаста с Кириллом Кириченко",
    imageWidth: 1280,
    imageHeight: 720,
    summary:
      "Спецвыпуск наших чтений о книге Екклесиаста вместе с Кириллом Кириченко.",
    description:
      "Спецвыпуск наших чтений. Вместе с Кириллом Кириченко читаем и обсуждаем Екклесиаста — одну из самых мрачных, странных и философски насыщенных книг Библии. Пытаемся понять, действительно ли она такая мрачная и что именно говорит Екклесиаст о смысле жизни, суете, труде, времени и мудрости.",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg" },
      { name: "Кирилл", avatar: "/home/assets/host-kirill.png", guest: true },
    ],
    guestLabel: "Гость: Кирилл",
  },
  {
    id: "samson",
    title: "Читаем историю Самсона с Артемом Широковым",
    meta: "3 недели назад",
    duration: "1:55:30",
    image: "/home/assets/episode-samson.jpg",
    imageAlt: "Превью выпуска Читаем историю Самсона с Артемом Широковым",
    imageWidth: 1280,
    imageHeight: 720,
    description:
      "Спецвыпуск наших чтений. Вместе с Артемом Широковым читаем Книгу Судей, а именно историю Самсона. Пытаемся понять какого происхождения сила Самсона и в чем праведность этого персонажа Библии.",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg" },
      { name: "Валентин", avatar: "/home/assets/host-valentin.jpg" },
      { name: "Артем", avatar: "/home/assets/host-artem.jpg", guest: true },
    ],
    guestLabel: "Гость: Артем",
  },
  {
    id: "thomas",
    title: "Читаем апокрифы. Евангелие от Фомы",
    meta: "1 месяц назад",
    duration: "2:11:36",
    image: "/home/assets/episode-thomas.jpg",
    imageAlt: "Превью выпуска Читаем апокрифы. Евангелие от Фомы",
    imageWidth: 1280,
    imageHeight: 720,
    description:
      "Спецвыпуск наших чтений: «Евангелие от Фомы». Что это за текст и почему вокруг него столько споров? В этом выпуске мы читаем и обсуждаем один из самых известных раннехристианских апокрифов: сборник изречений Иисуса без привычного сюжета. Чем он отличается от канонических Евангелий, что здесь значит «познание» и «Царство», и можно ли считать этот текст гностическим? Как всегда, смотрим с трёх позиций: атеист, ортодокс и внеконфессиональный верующий. Делитесь мыслями в комментариях.",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg" },
      { name: "Валентин", avatar: "/home/assets/host-valentin.jpg" },
    ],
  },
  {
    id: "isaac",
    title: "Читаем Библию. Женитьба Исаака",
    meta: "2 месяца назад",
    duration: "1:17:32",
    image: "/home/assets/episode-isaac.jpg",
    imageAlt: "Превью выпуска Читаем Библию. Женитьба Исаака",
    imageWidth: 1280,
    imageHeight: 720,
    description:
      "В этом выпуске мы читаем и обсуждаем Бытие 23–25: смерть Сарры и погребение в пещере Махпела; переговоры Авраама с хеттеями и покупку поля с пещерой у Ефрона. Затем — история поиска жены для Исаака: Авраам поручает слуге поездку в Месопотамию, встреча у колодца, знакомство с Ревеккой, разговор в доме её семьи и согласие на брак; возвращение в Ханаан и встреча Исаака с Ревеккой. В 25-й главе — Кетура и сыновья Авраама, распределение наследства и смерть Авраама; родословие Измаила. Финал — рождение Исава и Иакова, голод Исава и продажа первородства за похлёбку.",
    participants: [
      { name: "Тарас", avatar: "/home/assets/host-taras.jpg" },
      { name: "Мурат", avatar: "/home/assets/host-murat.jpg" },
      { name: "Валентин", avatar: "/home/assets/host-valentin.jpg" },
    ],
  },
];
