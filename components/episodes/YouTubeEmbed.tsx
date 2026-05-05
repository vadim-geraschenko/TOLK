"use client";

import { useState } from "react";
import { withBasePath } from "../../lib/base-path";
import styles from "./episode.module.css";
import { bindStyles } from "../../lib/bind-styles";

const cx = bindStyles(styles);

type YouTubeEmbedProps = {
  title: string;
  youtubeId: string;
  poster: string;
  posterAlt: string;
};

function buildEmbedSrc(youtubeId: string): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    autoplay: "1",
  });
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}

export function YouTubeEmbed({
  title,
  youtubeId,
  poster,
  posterAlt,
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <iframe
        title={title}
        src={buildEmbedSrc(youtubeId)}
        loading="eager"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      className={cx("youtube-placeholder")}
      type="button"
      onClick={() => setIsLoaded(true)}
      aria-label={`Смотреть выпуск: ${title}`}
    >
      <img
        src={withBasePath(poster)}
        alt={posterAlt}
        width={1280}
        height={720}
        decoding="async"
      />
      <span className={cx("youtube-play")} aria-hidden="true" />
    </button>
  );
}
