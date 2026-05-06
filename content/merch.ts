export type MerchImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type MerchProduct = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  priceLabel: string;
  ctaLabel: string;
  ctaHref: string;
  details: string[];
  images: MerchImage[];
};

export const merchProducts: MerchProduct[] = [
  {
    slug: "vy-ne-pravy",
    title: "Вы не правы",
    subtitle: "Футболка для важных переговоров",
    description:
      "Первый мерч TOLK: спокойная форма для людей, которые готовы спорить о вечном и личном без истерики.",
    status: "В наличии ограниченно",
    priceLabel: "Стоимость и размеры уточняются при заказе",
    ctaLabel: "Написать о покупке",
    ctaHref: "#",
    details: ["Футболка", "Принт «Вы не правы»", "Фотографии и размеры можно обновлять"],
    images: [
      {
        src: "/assets/merch.webp",
        alt: "Футболка TOLK «Вы не правы»",
        width: 640,
        height: 960,
      },
    ],
  },
];
