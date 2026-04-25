import type { ReactNode } from "react";

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

function EpisodeParticipants({
  episode,
}: {
  episode: Pick<HomeEpisode, "participants" | "guestLabel">;
}) {
  return (
    <div className="episode-participants">
      <span className="episode-participants-label">Участники</span>
      <div className="episode-participants-line">
        <div className="episode-host-stack">
          {episode.participants.map((participant) => (
            <div
              key={`${participant.name}-${participant.avatar}`}
              className={`episode-host-avatar${participant.guest ? " guest" : ""}`}
            >
              <img src={participant.avatar} alt={participant.name} />
            </div>
          ))}
        </div>
        {episode.guestLabel ? (
          <span className="episode-guest-badge">{episode.guestLabel}</span>
        ) : null}
      </div>
    </div>
  );
}

function HeroEpisode({ episode }: { episode: HomeEpisode }) {
  return (
    <article className="hero-episode">
      <div className="hero-episode-cover">
        <img
          src={episode.image}
          alt={episode.imageAlt}
          width={episode.imageWidth}
          height={episode.imageHeight}
        />
        <span className="episode-duration">{episode.duration}</span>
      </div>
      <div className="hero-episode-body">
        <span className="hero-episode-meta">{episode.meta}</span>
        <h3>{episode.title}</h3>
        <EpisodeParticipants episode={episode} />
        <p>{episode.summary ?? episode.description}</p>
        <Button className="mini-button" href="#" label="Открыть выпуск" />
      </div>
    </article>
  );
}

function ParticipantCard({ participant }: { participant: HomeParticipant }) {
  return (
    <div className="participant">
      <div className="avatar">
        <img src={participant.avatar} alt={participant.name} />
      </div>
      <div>
        <strong>{participant.name}</strong>
        <p>{participant.perspective}</p>
      </div>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: HomeEpisode }) {
  return (
    <article className="episode-card">
      <div className="episode-cover">
        <img
          src={episode.image}
          alt={episode.imageAlt}
          width={episode.imageWidth}
          height={episode.imageHeight}
        />
        <span className="episode-duration">{episode.duration}</span>
      </div>
      <div className="episode-body">
        <span className="meta">{episode.meta}</span>
        <h3>{episode.title}</h3>
        <EpisodeParticipants episode={episode} />
        <p>{episode.description}</p>
      </div>
    </article>
  );
}

function SocialButton({ social }: { social: HomeSocial }) {
  return (
    <a className="social-button" href={social.href}>
      <div className="social-icon" aria-hidden="true">
        <img src={social.icon} alt="" className={social.iconClass} />
      </div>
      <div className="social-copy">
        <strong>{social.name}</strong>
        <p>{social.description}</p>
      </div>
      <div className="social-arrow">›</div>
    </a>
  );
}

export function HomeHeroSection() {
  const heroEpisode = homeEpisodes[0];

  return (
    <section className="hero" id="about">
      <div className="container">
        <div className="hero-row">
          <div className="hero-frame">
            <div className="hero-grid">
              <div className="hero-copy">
                <Eyebrow>TOLK</Eyebrow>
                <h1>Читать. Мыслить. Искать истину.</h1>
                <div className="hero-manifest">
                  <p>
                    Мы читаем и обсуждаем Библию с разных точек зрения: Тарас —
                    атеист, Мурат — придерживается ортодоксальных взглядов,
                    Валентин — внеконфессиональный верующий. Но мы не планируем
                    ограничиваться только чтением Библии, этот канал — площадка
                    для глубоких вопросов, смелых идей и открытого диалога без
                    догм.
                  </p>
                </div>
                <div className="hero-actions">
                  <Button href="#episodes" label="Смотреть выпуски" />
                  <Button href="/about" label="О проекте" />
                </div>
              </div>

              <div className="hero-side">
                <HeroEpisode episode={heroEpisode} />
              </div>
            </div>
          </div>

          <article className="reading-card">
            <div className="reading-card-body">
              <Eyebrow>Очные Чтения</Eyebrow>
              <div className="reading-status">Событие прошло</div>
              <h3>Читаем Библию. Бог решает убить человечество</h3>
              <p>
                Запись следующих чтений планируется 13-го апреля, в 18:00 в
                Москве. Мероприятие, как и в прошлый раз, будет очень камерным,
                фактически мы приглашаем вас в нашу студию записи, поэтому
                количество мест сильно ограничено. После основной записи мы
                ответим на ваши вопросы и вместе обсудим прочитанное.
              </p>
              <div className="reading-actions">
                <div className="reading-meta">
                  <div className="reading-meta-item">
                    <div className="reading-meta-row">
                      <span>Дата</span>
                      <strong>13 апреля 2025 · 18:00</strong>
                    </div>
                    <div className="reading-meta-row">
                      <span>Адрес</span>
                      <strong>Москва, Спартаковская площадь, 14 стр. 3</strong>
                    </div>
                  </div>
                </div>
                <Button className="mini-button" href="#" label="Приобрести билет" />
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
    <section className="section participants-strip">
      <div className="container">
        <div className="participants-head">
          <Eyebrow>Главные ведущие</Eyebrow>
          <h3>Три взгляда на один текст</h3>
        </div>
        <div className="participants-list">
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
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
    </>
  );
}

export function HomeEpisodesSection() {
  return (
    <section className="section episodes" id="episodes">
      <div className="container">
        <SectionHeader
          content={
            <SectionHeaderContent
              eyebrow="Выпуски"
              title="Подкасты, записи чтений и спецвыпуски"
            />
          }
          action={<Button href="#" label="Все выпуски" />}
        />

        <div className="episodes-track">
          {homeEpisodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MerchCard() {
  return (
    <article className="merch-card">
      <div className="merch-layout">
        <div className="merch-card-media">
          <img
            src="/assets/merch.png"
            alt="Футболки TOLK от одного из ведущих проекта"
            width="1200"
            height="1600"
          />
        </div>
        <div className="merch-copy">
          <h3>
            Вы <span className="strikethrough">не</span>правы
          </h3>
          <p>
            У Тараса вышел мерч для важных переговоров. Приобретайте и побеждайте
            в дискуссиях.
          </p>
          <div>
            <Button href="#" label="Приобрести" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ContactPanelBody() {
  return (
    <>
      <Eyebrow>Контакты</Eyebrow>
      <h2>Наши соцсети</h2>

      <div className="social-buttons">
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
        content={<SectionHeaderContent eyebrow="Мерч" title="Мерч от TOLK" />}
      />

      <div className="merch-grid">
        <MerchCard />
      </div>
    </>
  );
}

export function HomeBottomSections() {
  return (
    <section className="section">
      <div className="container">
        <div className="lower-row">
          <section className="section merch">
            <PanelShell className="merch-panel">
              <MerchPanelBody />
            </PanelShell>
          </section>

          <section className="section">
            <PanelShell className="contact-panel">
              <ContactPanelBody />
            </PanelShell>
          </section>
        </div>
      </div>
    </section>
  );
}
