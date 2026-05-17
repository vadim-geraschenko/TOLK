import type { Metadata } from "next";

import { HomePage } from "../components/home/HomePage";

export const metadata: Metadata = {
  title: "TOLK — Библия для всех",
  description:
    "TOLK читает и обсуждает Библию с разных точек зрения: атеистической, ортодоксальной и внеконфессиональной.",
  openGraph: {
    title: "TOLK — Библия для всех",
    description:
      "Разговоры о Библии, вере, культуре и вечных вопросах без готовых ответов.",
    images: ["/home/assets/episode-ecclesiastes.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOLK — Библия для всех",
    description:
      "Разговоры о Библии, вере, культуре и вечных вопросах без готовых ответов.",
    images: ["/home/assets/episode-ecclesiastes.webp"],
  },
};

export default function HomeRoute() {
  return <HomePage />;
}
