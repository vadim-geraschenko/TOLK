import type { Metadata } from "next";
import { Suspense } from "react";
import { episodes } from "../../content/episodes";
import { EpisodesCatalogPage } from "../../components/episodes/EpisodesCatalogPage";

export const metadata: Metadata = {
  title: "TOLK — Выпуски",
  description: "Лента выпусков TOLK с фильтрацией по категориям",
};

export default function EpisodesPage() {
  return (
    <Suspense fallback={null}>
      <EpisodesCatalogPage episodes={episodes} />
    </Suspense>
  );
}
