import { bindStyles } from "../../lib/bind-styles";
import {
  homeEpisodes,
  homeParticipants,
  homeSocials,
  type HomeEpisode,
  type HomeParticipant,
  type HomeSocial,
} from "../../content/home";
import { Button } from "../site/Button";
import { Eyebrow } from "../site/Eyebrow";
import { PanelShell } from "../site/PanelShell";
import { SectionHeader } from "../site/SectionHeader";
import { EpisodeFeedCard } from "../episodes/EpisodeFeedCard";
import styles from "./home.module.css";

const cx = bindStyles(styles);

function EpisodeParticipants({
  episode,
}: {
  episode: Pick<HomeEpisode, "kind" | "participants" | "guestLabel">;
}) {
  if (episode.kind === "video") return null;

  return (
    <div className={cx("episode-participants")}>
      <span className={cx("episode-participants-label")}>Участники</span>
      <div className={cx("episode-participants-line")}>
        <div className={cx("episode-host-stack")}>
          {episode.participants.map((participant) => (
            <div
              key={`${participant.name}-${participant.avatar}`}
              className={cx("episode-host-avatar", participant.guest ? "guest" : "")}
            >
              <img src={participant.avatar} alt={participant.name} />
            </div>
          ))}
        </div>
        {episode.guestLabel ? (
          <span className={cx("episode-guest-badge")}>{episode.guestLabel}</span>
        ) : null}
      </div>
    </div>
  );
}

function HeroEpisode({ episode }: { episode: HomeEpisode }) {
  return (
    <article className={cx("hero-episode")}>
      <div className={cx("hero-episode-cover")}>
        <img
          src={episode.image}
          alt={episode.imageAlt}
          width={episode.imageWidth}
          height={episode.imageHeight}
        />
        <span className={cx("episode-duration")}>{episode.duration}</span>
      </div>
      <div className={cx("hero-episode-body")}>
        <span className={cx("hero-episode-meta")}>{episode.meta}</span>
        <h3>{episode.title}</h3>
        <EpisodeParticipants episode={episode} />
        <p>{episode.summary ?? episode.description}</p>
        <Button
          cx={cx}
          className="mini-button"
          href={`/episodes/${episode.id}`}
          label="Открыть выпуск"
        />
      </div>
    </article>
  );
}

function ParticipantCard({ participant }: { participant: HomeParticipant }) {
  return (
    <div className={cx("participant")}>
      <div className={cx("avatar")}>
        <img src={participant.avatar} alt={participant.name} />
      </div>
      <div>
        <strong>{participant.name}</strong>
        <p>{participant.perspective}</p>
      </div>
    </div>
  );
}

function SocialButton({ social }: { social: HomeSocial }) {
  return (
    <a className={cx("social-button")} href={social.href}>
      <div className={cx("social-icon")} aria-hidden="true">
        <img src={social.icon} alt="" className={cx(social.iconClass)} />
      </div>
      <div className={cx("social-copy")}>
        <strong>{social.name}</strong>
        <p>{social.description}</p>
      </div>
      <div className={cx("social-arrow")}>›</div>
    </a>
  );
}

export function HomeHeroSection() {
  const heroEpisode = homeEpisodes[0];

  return (
    <section className={cx("hero")} id="about">
      <div className={cx("container")}>
        <div className={cx("hero-row")}>
          <div className={cx("hero-frame")}>
            <div className={cx("hero-grid")}>
              <div className={cx("hero-copy")}>
                <Eyebrow cx={cx}>TOLK</Eyebrow>
                <h1>Читать. Мыслить. Искать истину.</h1>
                <div className={cx("hero-manifest")}>
                  <p>
                    Мы читаем и обсуждаем Библию с разных точек зрения: Тарас —
                    атеист, Мурат — придерживается ортодоксальных взглядов,
                    Валентин — внеконфессиональный верующий. Но мы не планируем
                    ограничиваться только чтением Библии, этот канал — площадка
                    для глубоких вопросов, смелых идей и открытого диалога без
                    догм.
                  </p>
                </div>
                <div className={cx("hero-actions")}>
                  <Button cx={cx} href="#episodes" label="Смотреть выпуски" />
                  <Button cx={cx} href="/about" label="О проекте" />
                </div>
              </div>

              <div className={cx("hero-side")}>
                <HeroEpisode episode={heroEpisode} />
              </div>
            </div>
          </div>

          <article className={cx("reading-card")}>
            <div className={cx("reading-card-body")}>
              <Eyebrow cx={cx}>Очные Чтения</Eyebrow>
              <div className={cx("reading-status")}>Событие прошло</div>
              <h3>Читаем Библию. Бог решает убить человечество</h3>
              <p>
                Запись следующих чтений планируется 13-го апреля, в 18:00 в
                Москве. Мероприятие, как и в прошлый раз, будет очень камерным,
                фактически мы приглашаем вас в нашу студию записи, поэтому
                количество мест сильно ограничено. После основной записи мы
                ответим на ваши вопросы и вместе обсудим прочитанное.
              </p>
              <div className={cx("reading-actions")}>
                <div className={cx("reading-meta")}>
                  <div className={cx("reading-meta-item")}>
                    <div className={cx("reading-meta-row")}>
                      <span>Дата</span>
                      <strong>13 апреля 2025 · 18:00</strong>
                    </div>
                    <div className={cx("reading-meta-row")}>
                      <span>Адрес</span>
                      <strong>Москва, Спартаковская площадь, 14 стр. 3</strong>
                    </div>
                  </div>
                </div>
                <Button cx={cx} className="mini-button" href="#" label="Приобрести билет" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function HomeParticipantsSection() {
  return (
    <section className={cx("section", "participants-strip")}>
      <div className={cx("container")}>
        <div className={cx("participants-head")}>
          <Eyebrow cx={cx}>Главные ведущие</Eyebrow>
          <h3>Три взгляда на один текст</h3>
        </div>
        <div className={cx("participants-list")}>
          {homeParticipants.map((participant) => (
            <ParticipantCard key={participant.name} participant={participant} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeaderContent({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <>
      <Eyebrow cx={cx}>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
    </>
  );
}

export function HomeEpisodesSection() {
  return (
    <section className={cx("section", "episodes")} id="episodes">
      <div className={cx("container")}>
        <SectionHeader
          cx={cx}
          content={
            <SectionHeaderContent
              eyebrow="Выпуски"
              title="Подкасты, записи чтений и спецвыпуски"
            />
          }
          action={<Button cx={cx} href="/episodes" label="Все выпуски" />}
        />

        <div className={cx("episodes-track")}>
          {homeEpisodes.map((episode) => (
            <EpisodeFeedCard
              key={episode.id}
              episode={{
                slug: episode.id,
                kind: episode.kind,
                title: episode.title,
                dateLabel: episode.meta,
                duration: episode.duration,
                cover: episode.image,
                coverAlt: episode.imageAlt,
                description: episode.description,
                participants: episode.participants.map((participant) => ({
                  name: participant.name,
                  avatar: participant.avatar,
                  isGuest: participant.guest,
                })),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MerchCard() {
  return (
    <article className={cx("merch-card")}>
      <div className={cx("merch-layout")}>
        <div className={cx("merch-card-media")}>
          <img
            src="/assets/merch.png"
            alt="Футболки TOLK от одного из ведущих проекта"
            width="1200"
            height="1600"
          />
        </div>
        <div className={cx("merch-copy")}>
          <h3>
            Вы <span className={cx("strikethrough")}>не</span>правы
          </h3>
          <p>
            У Тараса вышел мерч для важных переговоров. Приобретайте и побеждайте
            в дискуссиях.
          </p>
          <div>
            <Button cx={cx} href="#" label="Приобрести" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ContactPanelBody() {
  return (
    <>
      <Eyebrow cx={cx}>Контакты</Eyebrow>
      <h2>Наши соцсети</h2>

      <div className={cx("social-buttons")}>
        {homeSocials.map((social) => (
          <SocialButton key={social.name} social={social} />
        ))}
      </div>
    </>
  );
}

function MerchPanelBody() {
  return (
    <>
      <SectionHeader
        cx={cx}
        content={<SectionHeaderContent eyebrow="Мерч" title="Мерч от TOLK" />}
      />

      <div className={cx("merch-grid")}>
        <MerchCard />
      </div>
    </>
  );
}

export function HomeBottomSections() {
  return (
    <section className={cx("section")}>
      <div className={cx("container")}>
        <div className={cx("lower-row")}>
          <section className={cx("section", "merch")}>
            <PanelShell cx={cx} className="merch-panel">
              <MerchPanelBody />
            </PanelShell>
          </section>

          <section className={cx("section")}>
            <PanelShell cx={cx} className="contact-panel">
              <ContactPanelBody />
            </PanelShell>
          </section>
        </div>
      </div>
    </section>
  );
}
