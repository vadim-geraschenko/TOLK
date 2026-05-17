import type { Metadata } from "next";

import { MerchPage } from "../../components/merch/MerchPage";

export const metadata: Metadata = {
  title: "TOLK — Мерч",
  description:
    "Мерч TOLK: плотная черная футболка «Вы не правы» с белой вышивкой.",
  openGraph: {
    title: "TOLK — Мерч",
    description:
      "Первый дроп TOLK: черная футболка «Вы не правы» с белой вышивкой.",
    images: ["/assets/merch.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOLK — Мерч",
    description:
      "Первый дроп TOLK: черная футболка «Вы не правы» с белой вышивкой.",
    images: ["/assets/merch.webp"],
  },
};

export default function MerchRoute() {
  return <MerchPage />;
}
