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
    subtitle: "Ультрамегасупер-плотная футболка с вышивкой",
    description:
      "Если вы вдруг думали, что мы никогда не сделаем мерч, то вы неправы. Черная футболка с белой вышивкой «Вы не правы» работает как лучший способ закончить дискуссию.",
    status: "Первый дроп",
    priceLabel: "2900 ₽",
    ctaLabel: "Приобрести мерч",
    ctaHref: "https://t.me/yolo282",
    details: [
      "Материал: 100% хлопок",
      "Плотность: 240 GSM",
      "Посадка: оверсайз",
      "Белая вышивка на груди",
    ],
    images: [
      {
        src: "/assets/merch/merch.png",
        alt: "Футболка TOLK «Вы не правы»",
        width: 853,
        height: 1280,
      },
      {
        src: "/assets/merch/merch_2.jpg",
        alt: "Крупный план вышивки «Вы не правы» на черной футболке",
        width: 1280,
        height: 853,
      },
      {
        src: "/assets/merch/merch_3.jpg",
        alt: "Футболка «Вы не правы» на модели на ледяном фоне",
        width: 1199,
        height: 1041,
      },
      {
        src: "/assets/merch/merch_4.jpg",
        alt: "Футболка «Вы не правы» на модели с трубкой",
        width: 1180,
        height: 1129,
      },
      {
        src: "/assets/merch/merch_5.jpg",
        alt: "Черная футболка «Вы не правы» на модели",
        width: 1203,
        height: 1055,
      },
      {
        src: "/assets/merch/merch_6.jpg",
        alt: "Две сложенные футболки «Вы не правы»",
        width: 853,
        height: 1280,
      },
    ],
  },
];
