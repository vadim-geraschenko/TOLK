import { bindStyles } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import {
  getMoreShortsFromSameSource,
  getEpisodeNeighbors,
  getSourceEpisodeForShort,
  type Episode,
} from "../../content/episodes";
import { SiteFooter } from "../site/SiteFooter";
import { SiteHeader } from "../site/SiteHeader";
import { EpisodePreviewCard } from "./EpisodePreviewCard";
import { YouTubeEmbed } from "./YouTubeEmbed";
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

const episodeBreadcrumbParents: Record<Episode["kind"], { label: string; href: string }> = {
  episode: { label: "Выпуски", href: "/episodes?tab=episode" },
  special: { label: "Спецвыпуски", href: "/episodes?tab=special" },
  "stream-record": { label: "Стримы", href: "/episodes?tab=stream-record" },
  video: { label: "Видео", href: "/episodes?tab=video" },
  shorts: { label: "Shorts", href: "/episodes?tab=shorts" },
};

export function EpisodePage({ episode }: { episode: Episode }) {
  const navItems = [
    { label: "Главная", href: "/" },
    { label: "О нас", href: "/about" },
    { label: "Выпуски", href: "/episodes", isActive: true },
    { label: "Очные чтения", href: "/readings" },
    { label: "Мерч", href: "/merch" },
    { label: "Telegram", href: "#", isSocial: true },
    { label: "YouTube", href: "#", isSocial: true },
    { label: "Boosty", href: "#", isSocial: true },
  ];
  const related = getEpisodeNeighbors(episode.slug, 4);
  const sourceEpisode = getSourceEpisodeForShort(episode);
  const shortFragments = getMoreShortsFromSameSource(episode, 8);
  const hosts = episode.participants.filter((participant) => !participant.isGuest);
  const guest = episode.participants.find((participant) => participant.isGuest);
  const breadcrumbParent = episodeBreadcrumbParents[episode.kind];

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
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: withBasePath("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbParent.label,
        item: withBasePath(breadcrumbParent.href),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: episode.title,
      },
    ],
  };

  return (
    <div className={cx("root", "page-shell")}>
      <SiteHeader navItems={navItems} />

      <main className={cx("main")}>
        {episode.kind === "shorts" ? (
          <>
            <section className={cx("hero", "container")}>
              <div className={cx("breadcrumbs")}>
                <a href={withBasePath("/")}>Главная</a>
                <span>›</span>
                <a href={withBasePath(breadcrumbParent.href)}>{breadcrumbParent.label}</a>
                <span>›</span>
                <span>{episode.title}</span>
              </div>

              <div className={cx("short-layout")}>
                <article className={cx("panel", "short-player-panel")}>
                  <p className={cx("meta")}>
                    {episode.dateLabel} · {episode.duration}
                  </p>
                  <h1>{episode.title}</h1>
                  <div className={cx("short-player-wrap")}>
                    <YouTubeEmbed
                      title={episode.title}
                      youtubeId={episode.youtubeId}
                      poster={episode.cover}
                      posterAlt={episode.coverAlt}
                    />
                  </div>
                </article>

                <article className={cx("panel", "short-info-panel")}>
                  <div className={cx("short-source-block")}>
                    {sourceEpisode ? (
                      <EpisodePreviewCard
                        episode={sourceEpisode}
                        href={`/episodes/${sourceEpisode.slug}`}
                        className="short-source-card"
                      />
                    ) : (
                      <p className={cx("timestamps-empty")}>Исходный выпуск скоро будет добавлен.</p>
                    )}
                    {sourceEpisode ? (
                      <a className={cx("button", "support-link")} href={withBasePath(`/episodes/${sourceEpisode.slug}`)}>
                        <span className={cx("button-label")}>Смотреть полный разговор</span>
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
                    ) : null}
                  </div>
                </article>
              </div>
            </section>

            <section className={cx("container", "related")}>
              <h2>Ещё фрагменты из этого выпуска</h2>
              <div className={cx("related-track")}>
                {shortFragments.length > 0 ? (
                  shortFragments.map((item) => (
                    <EpisodePreviewCard key={item.slug} episode={item} href={`/episodes/${item.slug}`} />
                  ))
                ) : (
                  <p className={cx("timestamps-empty")}>Скоро добавим ещё фрагменты.</p>
                )}
              </div>
            </section>
          </>
        ) : (
          <>
        <section className={cx("hero", "container")}>
          <div className={cx("breadcrumbs")}>
            <a href={withBasePath("/")}>Главная</a>
            <span>›</span>
            <a href={withBasePath(breadcrumbParent.href)}>{breadcrumbParent.label}</a>
            <span>›</span>
            <span>{episode.title}</span>
          </div>

          <div className={cx("hero-grid")}>
            <article className={cx("panel", "video-panel")}>
              <div className={cx("video-wrap")}>
                <YouTubeEmbed
                  title={episode.title}
                  youtubeId={episode.youtubeId}
                  poster={episode.cover}
                  posterAlt={episode.coverAlt}
                />
              </div>

              {episode.kind !== "video" ? (
                <div className={cx("participants")}>
                  <h2>Участники</h2>
                  <div className={cx("participants-list")}>
                    {hosts.length > 0 ? (
                      <article
                        className={cx("hosts-row", hosts.length === 2 ? "hosts-row-two" : "")}
                      >
                        <div className={cx("host-stack")}>
                          {hosts.map((host) => (
                            <div key={host.name} className={cx("host-avatar")} title={host.name}>
                              <img
                                src={withBasePath(host.avatar)}
                                alt={host.name}
                                loading="lazy"
                                decoding="async"
                              />
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
                        <img
                          src={withBasePath(guest.avatar)}
                          alt={guest.name}
                          loading="lazy"
                          decoding="async"
                        />
                        <div>
                          <strong>Гость: {guest.name}</strong>
                          {guest.guestNote ? (
                            <p className={cx("guest-note")}>{guest.guestNote}</p>
                          ) : null}
                        </div>
                      </article>
                    ) : null}
                  </div>
                </div>
              ) : null}
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
              <EpisodePreviewCard key={item.slug} episode={item} href={`/episodes/${item.slug}`} />
            ))}
          </div>
        </section>
          </>
        )}
      </main>

      <SiteFooter text="TOLK 2026" cx={cx} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
