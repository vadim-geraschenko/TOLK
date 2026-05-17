import type { Metadata } from "next";

import { ReadingsPage } from "../../components/readings/ReadingsPage";

export const metadata: Metadata = {
  title: "Очные чтения — TOLK",
  description:
    "Очные чтения TOLK: камерные записи и встречи, где участники читают Библию и обсуждают текст после записи.",
  openGraph: {
    title: "Очные чтения — TOLK",
    description:
      "Камерные записи TOLK в студии: чтение Библии, вопросы и обсуждение с участниками.",
    images: ["/readings/assets/shumno-table.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Очные чтения — TOLK",
    description:
      "Камерные записи TOLK в студии: чтение Библии, вопросы и обсуждение с участниками.",
    images: ["/readings/assets/shumno-table.webp"],
  },
};

export default function ReadingsRoute() {
  return <ReadingsPage />;
}
