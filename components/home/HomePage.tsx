import { homeContent } from "@/content/home";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { CardKicker } from "@/components/ui/CardKicker";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./home.module.css";

function EpisodeParticipants({
  participants,
  guestLabel,
}: {
  participants: { name: string; avatar: string; guest?: boolean }[];
  guestLabel?: string;
}) {
  return (
    <div className={styles.episodeParticipants}>
      <span className={styles.episodeParticipantsLabel}>Участники</span>
      <div className={styles.episodeParticipantsLine}>
        <div className={styles.episodeHostStack}>
          {participants.map((participant) => (
            <div key={`${participant.name}-${participant.avatar}`} className={styles.episodeHostAvatar}>
              <img src={participant.avatar} alt={participant.name} />
            </div>
          ))}
        </div>
        {guestLabel ? <span className={styles.episodeGuestBadge}>{guestLabel}</span> : null}
      </div>
    </div>
  );
}

export function HomePage() {
  const [featuredEpisode] = homeContent.episodes;

  return (
    <div className={styles.pageShell}>
      <SiteHeader currentPath="/" />
      <main>
        <section className={styles.hero} id="about">
          <div className={styles.container}>
            <div className={styles.heroRow}>
              <div className={styles.heroFrame}>
                <div className={styles.heroGrid}>
                  <div className={styles.heroCopy}>
                    <CardKicker variant="eyebrow">{homeContent.hero.kicker}</CardKicker>
                    <h1>{homeContent.hero.title}</h1>
                    <div className={styles.heroManifest}>
                      <p>{homeContent.hero.description}</p>
                    </div>
                    <div className={styles.heroActions}>
                      <Button href="#episodes">Смотреть выпуски</Button>
                      <Button href="/about">О проекте</Button>
                    </div>
                  </div>

                  <div className={styles.heroSide}>
                    <article className={styles.heroEpisode}>
                      <div className={styles.heroEpisodeCover}>
                        <img src={featuredEpisode.image} alt={featuredEpisode.imageAlt} />
                        <span className={styles.duration}>{featuredEpisode.duration}</span>
                      </div>
                      <div className={styles.heroEpisodeBody}>
                        <span className={styles.heroEpisodeMeta}>{featuredEpisode.meta}</span>
                        <h3>{featuredEpisode.title}</h3>
                        <EpisodeParticipants
                          participants={featuredEpisode.participants}
                          guestLabel={featuredEpisode.guestLabel}
                        />
                        <p>{featuredEpisode.summary ?? featuredEpisode.description}</p>
                        <Button href="#" mini>
                          Открыть выпуск
                        </Button>
                      </div>
                    </article>
                  </div>
                </div>
              </div>

              <article className={styles.readingCard}>
                <div className={styles.readingCardBody}>
                  <CardKicker variant="eyebrow">{homeContent.readingCard.kicker}</CardKicker>
                  <div className={styles.readingStatus}>{homeContent.readingCard.status}</div>
                  <h3>{homeContent.readingCard.title}</h3>
                  <p>{homeContent.readingCard.description}</p>
                  <div className={styles.readingActions}>
                    <div className={styles.readingMeta}>
                      <div className={styles.readingMetaRow}>
                        <span>Дата</span>
                        <strong>{homeContent.readingCard.date}</strong>
                      </div>
                      <div className={styles.readingMetaRow}>
                        <span>Адрес</span>
                        <strong>{homeContent.readingCard.address}</strong>
                      </div>
                    </div>
                    <Button href="#" mini>
                      Приобрести билет
                    </Button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} aria-hidden="true" />

        <section className={styles.participantsStrip}>
          <div className={styles.container}>
            <div className={styles.participantsHead}>
              <CardKicker variant="eyebrow">Главные ведущие</CardKicker>
              <h3>Три взгляда на один текст</h3>
            </div>
            <div className={styles.participantsList}>
              {homeContent.participants.map((participant) => (
                <div key={participant.name} className={styles.participant}>
                  <div className={styles.avatar}>
                    <img src={participant.avatar} alt={participant.name} />
                  </div>
                  <div>
                    <strong>{participant.name}</strong>
                    <p>{participant.perspective}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} aria-hidden="true" />

        <section className={styles.episodes} id="episodes">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <SectionHead
                kicker="Выпуски"
                title="Подкасты, записи чтений и спецвыпуски"
                variant="eyebrow"
              />
              <Button href="#">Все выпуски</Button>
            </div>

            <div className={styles.episodesTrack}>
              {homeContent.episodes.map((episode) => (
                <article key={episode.id} className={styles.episodeCard}>
                  <div className={styles.episodeCover}>
                    <img src={episode.image} alt={episode.imageAlt} />
                    <span className={styles.duration}>{episode.duration}</span>
                  </div>
                  <div className={styles.episodeBody}>
                    <span className={styles.meta}>{episode.meta}</span>
                    <h3>{episode.title}</h3>
                    <EpisodeParticipants
                      participants={episode.participants}
                      guestLabel={episode.guestLabel}
                    />
                    <p>{episode.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} aria-hidden="true" />

        <section>
          <div className={styles.container}>
            <div className={styles.lowerRow}>
              <section className={styles.merch}>
                <article className={styles.merchPanel}>
                  <div className={styles.panelContent}>
                    <div className={styles.sectionHeader}>
                      <SectionHead
                        kicker={homeContent.merch.kicker}
                        title={homeContent.merch.title}
                        variant="eyebrow"
                      />
                    </div>
                    <div className={styles.merchGrid}>
                      <article className={styles.merchCard}>
                        <div className={styles.merchLayout}>
                          <div className={styles.merchCardMedia}>
                            <img
                              src={homeContent.merch.image}
                              alt="Футболки TOLK от одного из ведущих проекта"
                            />
                          </div>
                          <div className={styles.merchCopy}>
                            <h3>
                              Вы <span className={styles.strikethrough}>не</span>правы
                            </h3>
                            <p>{homeContent.merch.description}</p>
                            <div>
                              <Button href="#">Приобрести</Button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                </article>
              </section>

              <section>
                <article className={styles.supportPanel}>
                  <div className={styles.panelContent}>
                    <CardKicker variant="eyebrow">Контакты</CardKicker>
                    <h2 className={styles.supportTitle}>Наши соцсети</h2>
                    <div className={styles.socialButtons}>
                      {homeContent.socials.map((social) => (
                        <a key={social.name} className={styles.socialButton} href={social.href}>
                          <div className={styles.socialIcon} aria-hidden="true">
                            <img src={social.icon} alt="" />
                          </div>
                          <div className={styles.socialCopy}>
                            <strong>{social.name}</strong>
                            <p>{social.description}</p>
                          </div>
                          <div className={styles.socialArrow}>›</div>
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
