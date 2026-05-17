import type { Metadata } from "next";
import { Suspense } from "react";
import { episodes } from "../../content/episodes";
import { EpisodesCatalogPage } from "../../components/episodes/EpisodesCatalogPage";

export const metadata: Metadata = {
  title: "TOLK — Выпуски",
  description:
    "Лента выпусков TOLK: чтения Библии, спецвыпуски, стримы и короткие видео с обсуждениями о вере, культуре и философии.",
  openGraph: {
    title: "TOLK — Выпуски",
    description:
      "Смотреть выпуски TOLK: чтения, спецвыпуски, стримы и короткие видео.",
    images: ["/home/assets/episode-ecclesiastes.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOLK — Выпуски",
    description:
      "Смотреть выпуски TOLK: чтения, спецвыпуски, стримы и короткие видео.",
    images: ["/home/assets/episode-ecclesiastes.webp"],
  },
};

export default function EpisodesPage() {
  return (
    <Suspense fallback={null}>
      <EpisodesCatalogPage episodes={episodes} />
    </Suspense>
  );
}
