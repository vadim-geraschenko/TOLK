import type { Metadata } from "next";
import { EpisodesCatalogPage } from "../../components/episodes/EpisodesCatalogPage";

export const metadata: Metadata = {
  title: "TOLK — Выпуски",
  description: "Лента выпусков TOLK с фильтрацией по категориям",
};

type EpisodesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EpisodesPage({ searchParams }: EpisodesPageProps) {
  const params = (await searchParams) ?? {};
  const tabRaw = params.tab;
  const tab = Array.isArray(tabRaw) ? tabRaw[0] : tabRaw;
  const pageRaw = params.page;
  const pageParam = Array.isArray(pageRaw) ? pageRaw[0] : pageRaw;
  const page = Number.parseInt(pageParam ?? "1", 10);
  return <EpisodesCatalogPage tab={tab} page={Number.isFinite(page) ? page : 1} />;
}
