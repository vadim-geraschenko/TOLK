import type { EpisodeKind } from "../../content/episodes.overrides";
import { bindStyles } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import styles from "./EpisodeFeedCard.module.css";

const cx = bindStyles(styles);

type EpisodeFeedCardParticipant = {
  name: string;
  avatar: string;
  isGuest?: boolean;
};

type EpisodeFeedCardData = {
  slug: string;
  kind: EpisodeKind;
  title: string;
  dateLabel: string;
  duration: string;
  cover: string;
  coverAlt: string;
  description: string;
  participants: EpisodeFeedCardParticipant[];
};

type EpisodeFeedCardProps = {
  episode: EpisodeFeedCardData;
  href?: string;
  metaSuffix?: string;
  className?: string;
};

export function EpisodeFeedCard({
  episode,
  href = `/episodes/${episode.slug}`,
  metaSuffix,
  className = "",
}: EpisodeFeedCardProps) {
  const guest = episode.participants.find((participant) => participant.isGuest);
  const shouldShowParticipants = episode.kind !== "video" && episode.kind !== "shorts";

  return (
    <a className={cx("card", className)} href={withBasePath(href)} data-home-episode-card>
      <div className={cx("cover")}>
        <img
          src={withBasePath(episode.cover)}
          alt={episode.coverAlt}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
        <span className={cx("duration")}>{episode.duration}</span>
      </div>
      <div className={cx("body")}>
        <span className={cx("meta")}>
          {episode.dateLabel}
          {metaSuffix ? ` · ${metaSuffix}` : ""}
        </span>
        <h3>{episode.title}</h3>
        {shouldShowParticipants ? (
          <div className={cx("participants")}>
            <span className={cx("participantsLabel")}>Участники</span>
            <div className={cx("participantsLine")}>
              <div className={cx("hostStack")}>
                {episode.participants.map((participant) => (
                  <div
                    key={`${episode.slug}-${participant.name}`}
                    className={cx("hostAvatar", participant.isGuest ? "guest" : "")}
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
              {guest ? <span className={cx("guestBadge")}>Гость: {guest.name}</span> : null}
            </div>
          </div>
        ) : null}
        <p className={cx("description")}>{episode.description}</p>
      </div>
    </a>
  );
}
