import { bindStyles } from "../../lib/bind-styles";
import {
  episodeKindLabels,
  getEpisodeNeighbors,
  type Episode,
} from "../../content/episodes";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import styles from "./episode.module.css";

const cx = bindStyles(styles);

function toIsoDuration(duration: string): string {
  const parts = duration.split(":").map((value) => Number.parseInt(value, 10));
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return `PT${h}H${m}M${s}S`;
  }
  const [m, s] = parts;
  return `PT${m}M${s}S`;
}

function buildEmbedSrc(youtubeId: string, start?: number): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  if (typeof start === "number" && start > 0) {
    params.set("start", String(start));
    params.set("autoplay", "1");
  }
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}

export function EpisodePage({ episode }: { episode: Episode }) {
  const navItems = [
    { label: "Главная", href: "/" },
    { label: "О нас", href: "/about" },
    { label: "Выпуски", href: "#", isActive: true },
    { label: "Очные чтения", href: "#" },
    { label: "Мерч", href: "#" },
    { label: "Telegram", href: "#", isSocial: true },
    { label: "YouTube", href: "#", isSocial: true },
    { label: "Boosty", href: "#", isSocial: true },
  ];
  const related = getEpisodeNeighbors(episode.slug, 4);
  const hosts = episode.participants.filter((participant) => !participant.isGuest);
  const guest = episode.participants.find((participant) => participant.isGuest);

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: episode.title,
    description: episode.description,
    thumbnailUrl: [episode.cover],
    uploadDate: episode.publishedAt,
    duration: toIsoDuration(episode.duration),
    embedUrl: `https://www.youtube.com/embed/${episode.youtubeId}`,
  };

  return (
    <div className={cx("root", "page-shell")}>
      <SiteHeader navItems={navItems} cx={cx} />

      <main className={cx("main")}>
        <section className={cx("hero", "container")}>
          <div className={cx("breadcrumbs")}>
            <a href="/">Главная</a>
            <span>›</span>
            <a href="#">Выпуски</a>
            <span>›</span>
            <span>{episodeKindLabels[episode.kind]}</span>
          </div>

          <div className={cx("hero-grid")}>
            <article className={cx("panel", "video-panel")}>
              <div className={cx("video-wrap")}>
                <iframe
                  title={episode.title}
                  src={buildEmbedSrc(episode.youtubeId)}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className={cx("participants")}>
                <h2>Участники</h2>
                <div className={cx("participants-list")}>
                  {hosts.length > 0 ? (
                    <article className={cx("hosts-row")}>
                      <div className={cx("host-stack")}>
                        {hosts.map((host) => (
                          <div key={host.name} className={cx("host-avatar")} title={host.name}>
                            <img src={host.avatar} alt={host.name} />
                          </div>
                        ))}
                      </div>
                      <div className={cx("hosts-copy")}>
                        <strong>{hosts.map((host) => host.name).join(" · ")}</strong>
                        <p>Ведущие</p>
                      </div>
                    </article>
                  ) : (
                    <article className={cx("guest-row")}>
                      <div />
                      <div>
                        <strong>Состав будет добавлен</strong>
                        <p className={cx("guest-note")}>Данные участников скоро появятся.</p>
                      </div>
                    </article>
                  )}

                  {guest ? (
                    <article className={cx("guest-row")}>
                      <img src={guest.avatar} alt={guest.name} />
                      <div>
                        <strong>Гость: {guest.name}</strong>
                        {guest.guestNote ? <p className={cx("guest-note")}>{guest.guestNote}</p> : null}
                      </div>
                    </article>
                  ) : null}
                </div>
              </div>
            </article>

            <article className={cx("panel", "content-panel")}>
              <p className={cx("meta")}>
                {episode.dateLabel} · {episode.duration}
              </p>
              <h1>{episode.title}</h1>
              <p className={cx("description")}>{episode.description}</p>

              <div className={cx("timestamps")}>
                <h2>Таймкоды</h2>
                {episode.timestamps.length > 0 ? (
                  <ul>
                    {episode.timestamps.map((timestamp) => (
                      <li key={`${timestamp.at}-${timestamp.label}`}>
                        <a href={buildEmbedSrc(episode.youtubeId, timestamp.seconds)}>
                          <span>{timestamp.at}</span>
                          <span>{timestamp.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={cx("timestamps-empty")}>Таймкоды скоро будут.</p>
                )}
              </div>

              <div className={cx("support")}>
                <h2>Поддержать TOLK</h2>
                <div className={cx("support-actions")}>
                  {episode.supportLinks.map((link) => (
                    <a key={link.label} href={link.href} className={cx("button", "support-link")}>
                      <span className={cx("button-label")}>{link.label}</span>
                      <span className={cx("stars")}>
                        <span className={cx("star", "star-lg", "star-1")} />
                        <span className={cx("star", "star-sm", "star-2")} />
                        <span className={cx("star", "star-lg", "star-3")} />
                        <span className={cx("star", "star-sm", "star-4")} />
                        <span className={cx("star", "star-lg", "star-5")} />
                        <span className={cx("star", "star-sm", "star-6")} />
                        <span className={cx("star", "star-sm", "star-7")} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className={cx("container", "related")}>
          <h2>Смотреть ещё</h2>
          <div className={cx("related-track")}>
            {related.map((item) => (
              <a key={item.slug} className={cx("related-card")} href={`/episodes/${item.slug}`}>
                <div className={cx("related-cover")}>
                  <img src={item.cover} alt={item.coverAlt} width={1280} height={720} />
                  <span className={cx("episode-duration")}>{item.duration}</span>
                </div>
                <div className={cx("related-body")}>
                  <p className={cx("related-meta")}>{item.dateLabel}</p>
                  <h3>{item.title}</h3>
                  <div className={cx("related-participants")}>
                    <span className={cx("related-participants-label")}>Участники</span>
                    <div className={cx("related-participants-line")}>
                      <div className={cx("related-host-stack")}>
                        {item.participants.map((participant) => (
                          <div
                            key={`${item.slug}-${participant.name}`}
                            className={cx(
                              "related-host-avatar",
                              participant.isGuest ? "guest" : "",
                            )}
                          >
                            <img src={participant.avatar} alt={participant.name} />
                          </div>
                        ))}
                      </div>
                      {item.participants.some((participant) => participant.isGuest) ? (
                        <span className={cx("related-guest-badge")}>
                          Гость:{" "}
                          {item.participants.find((participant) => participant.isGuest)?.name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className={cx("related-description")}>{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
    </div>
  );
}
