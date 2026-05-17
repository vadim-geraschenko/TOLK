import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EpisodePage } from "../../../components/episodes/EpisodePage";
import {
  episodes,
  episodeKindLabels,
  getEpisodeBySlug,
} from "../../../content/episodes";
import { withBasePath } from "../../../lib/base-path";

type EpisodeRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({
  params,
}: EpisodeRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) {
    return { title: "Выпуск не найден — TOLK" };
  }

  return {
    title: `${episode.title} — ${episodeKindLabels[episode.kind]} — TOLK`,
    description: episode.description,
    openGraph: {
      title: episode.title,
      description: episode.description,
      images: [withBasePath(episode.cover)],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.description,
      images: [withBasePath(episode.cover)],
    },
  };
}

export default async function EpisodeRoute({ params }: EpisodeRouteProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) notFound();
  return <EpisodePage episode={episode} />;
}
