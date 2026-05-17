import type { Metadata } from "next";

import { AboutPage } from "../../components/about/AboutPage";

export const metadata: Metadata = {
  title: "TOLK — О проекте",
  description:
    "О проекте TOLK: почему мы читаем Библию как культурный, религиозный и философский текст и спорим о ней с разных позиций.",
  openGraph: {
    title: "TOLK — О проекте",
    description:
      "Честная беседа о Библии без догм: атеистический, ортодоксальный и личный взгляд.",
    images: ["/about/assets/clouds.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOLK — О проекте",
    description:
      "Честная беседа о Библии без догм: атеистический, ортодоксальный и личный взгляд.",
    images: ["/about/assets/clouds.webp"],
  },
};

export default function AboutRoute() {
  return <AboutPage />;
}
