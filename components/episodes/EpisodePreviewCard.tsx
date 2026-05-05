import type { Episode } from "../../content/episodes";
import { bindStyles, type StyleBinder } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import styles from "./episode.module.css";

const localCx = bindStyles(styles);

type EpisodePreviewCardProps = {
  episode: Episode;
  href: string;
  className?: string;
  showParticipants?: boolean;
  showDescription?: boolean;
  cx?: StyleBinder;
};

export function EpisodePreviewCard({
  episode,
  href,
  className = "",
  showParticipants = true,
  showDescription = true,
  cx = localCx,
}: EpisodePreviewCardProps) {
  const guest = episode.participants.find((participant) => participant.isGuest);
  const shouldShowParticipants =
    showParticipants && episode.kind !== "video" && episode.kind !== "shorts";

  return (
    <a className={cx("related-card", className)} href={withBasePath(href)}>
      <div className={cx("related-cover")}>
        <img
          src={withBasePath(episode.cover)}
          alt={episode.coverAlt}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
        <span className={cx("episode-duration")}>{episode.duration}</span>
      </div>
      <div className={cx("related-body")}>
        <p className={cx("related-meta")}>{episode.dateLabel}</p>
        <h3>{episode.title}</h3>
        {shouldShowParticipants ? (
          <div className={cx("related-participants")}>
            <span className={cx("related-participants-label")}>Участники</span>
            <div className={cx("related-participants-line")}>
              <div className={cx("related-host-stack")}>
                {episode.participants.map((participant) => (
                  <div
                    key={`${episode.slug}-${participant.name}`}
                    className={cx("related-host-avatar", participant.isGuest ? "guest" : "")}
                  >
                    <img
                      src={withBasePath(participant.avatar)}
                      alt={participant.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
              {guest ? (
                <span className={cx("related-guest-badge")}>Гость: {guest.name}</span>
              ) : null}
            </div>
          </div>
        ) : null}
        {showDescription ? (
          <p className={cx("related-description")}>{episode.description}</p>
        ) : null}
      </div>
    </a>
  );
}
