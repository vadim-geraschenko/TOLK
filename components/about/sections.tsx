import { type CSSProperties } from "react";
import { bindStyles } from "../../lib/bind-styles";
import { withBasePath } from "../../lib/base-path";
import {
  aboutStoryLeadCard,
  aboutStorySteps,
  aboutVoices,
  type AboutStoryCard,
  type AboutStoryStep,
} from "../../content/about";
import { Button } from "../site/Button";
import { CardKicker } from "../site/CardKicker";
import {
  buildAboutStoryMobileStackGroups,
  buildAboutVoicesMobileStackGroup,
  type AboutMobileStackGroup,
  type AboutMobileStackCard,
} from "./mobileStackModel";
import styles from "./about.module.css";

const cx = bindStyles(styles);

function mobileStackSceneStyle(cardCount: number): CSSProperties {
  return {
    "--mobile-stack-card-count": cardCount,
  } as CSSProperties;
}

function mobileStackCardStyle(index: number): CSSProperties {
  return {
    "--mobile-stack-card-index": index,
    "--mobile-stack-card-z": index + 1,
  } as CSSProperties;
}

export function AboutHeroSection() {
  return (
    <section className={cx("hero")}>
      <div className={cx("container")}>
        <div className={cx("hero-shell", "tone-neutral")} data-about-reveal-target>
          <div className={cx("hero-grid")}>
            <div className={cx("hero-copy")}>
              <CardKicker cx={cx} hasLines label="О Проекте" />
              <h1>Поиск истины в честной беседе</h1>
              <p>
                TOLK — это искренний разговор о самом живом и нетривиальном тексте в
                истории человечества. Это не площадка для проповедей — мы не
                декларируем истину, а ищем её. Нами движут природное любопытство,
                неутолимая жажда истины, любовь к размышлениям и поиску смыслов. Мы
                занимаемся обывательским чтением и делимся своими интерпретациями,
                не боясь увидеть ветхий текст под новым углом.
              </p>
            </div>
          </div>
        </div>
        <div className={cx("mobile-divider")} aria-hidden="true" />
      </div>
    </section>
  );
}

export function AboutStoryLeadSection() {
  return (
    <section className={cx("section", "story-lead")}>
      <div className={cx("container")}>
        <article
          className={cx("story-card", "centered", "tone-neutral")}
          data-about-reveal-target
        >
          <CardKicker
            cx={cx}
            hasLines={aboutStoryLeadCard.kickerHasLines}
            label={aboutStoryLeadCard.kicker}
          />
          <h2>{aboutStoryLeadCard.title}</h2>
          <StoryParagraphs paragraphs={aboutStoryLeadCard.paragraphs} />
        </article>
      </div>
    </section>
  );
}

function StoryParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </>
  );
}

function StoryCard({ card }: { card: AboutStoryCard }) {
  return (
    <div
      className={cx("story-card", card.centered ? "centered" : "", card.tone ?? "tone-soft")}
      data-about-story-card
    >
      <CardKicker cx={cx} hasLines={card.kickerHasLines} label={card.kicker} />
      <h2>{card.title}</h2>
      <StoryParagraphs paragraphs={card.paragraphs} />
    </div>
  );
}

function MobileStackCard({ item }: { item: AboutMobileStackCard }) {
  if (item.kind === "voice-intro") {
    return <VoiceIntroCard />;
  }

  if (item.kind === "voice") {
    return <VoiceCard {...item.voice} />;
  }

  return <StoryCard card={item.card} />;
}

function MobileStackScene({
  group,
  hasDivider = false,
}: {
  group: AboutMobileStackGroup;
  hasDivider?: boolean;
}) {
  return (
    <div
      className={cx("mobile-stack-scene")}
      data-mobile-stack-scene={group.id}
      style={mobileStackSceneStyle(group.cards.length)}
    >
      <div className={cx("mobile-stack-stage")}>
        {hasDivider ? (
          <div className={cx("mobile-stack-divider")} aria-hidden="true" />
        ) : null}
        {group.cards.map((item, index) => (
          <div
            className={cx("mobile-stack-item")}
            key={item.id}
            data-mobile-stack-item
            style={mobileStackCardStyle(index)}
          >
            <MobileStackCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryStep({
  step,
  pairIndex,
}: {
  step: AboutStoryStep;
  pairIndex?: number;
}) {
  const pairVarsStyle =
    step.kind === "pair"
      ? ({
          "--about-pair-progress-var": `var(--about-pair-${pairIndex ?? 0}-progress, 0)`,
          "--about-pair-y-var": `var(--about-pair-${pairIndex ?? 0}-y, 0)`,
        } as CSSProperties)
      : undefined;

  return (
    <article
      className={cx(
        "story-step",
        step.kind === "pair" ? "story-step-pair" : "",
        step.kind === "pair" ? step.className ?? "" : "",
      )}
      data-progress={step.progress}
      data-story-step
      data-story-kind={step.kind}
      data-about-reveal-target
    >
      {step.kind === "pair" ? (
        <div
          className={cx("story-pair")}
          data-pair
          data-about-pair
          data-pair-index={pairIndex}
          style={pairVarsStyle}
        >
          <StoryCard card={step.cards[0]} />
          <StoryCard card={step.cards[1]} />
        </div>
      ) : (
        <StoryCard card={step.card} />
      )}
      {step.hasMobileDivider ? (
        <div className={cx("mobile-divider")} aria-hidden="true" />
      ) : null}
    </article>
  );
}

export function AboutStorySection() {
  let pairCounter = 0;
  const mobileGroups = buildAboutStoryMobileStackGroups();

  return (
    <section className={cx("section", "story")} id="story">
      <div className={cx("container")}>
        <div className={cx("story-cards")} id="story-cards">
          <div className={cx("desktop-story-flow")}>
            {aboutStorySteps.map((step, index) => {
              const pairIndex = step.kind === "pair" ? pairCounter++ : undefined;
              return <StoryStep key={index} step={step} pairIndex={pairIndex} />;
            })}
          </div>

          <div className={cx("mobile-story-flow")}>
            {mobileGroups.map((group, index) => (
              <MobileStackScene
                group={group}
                hasDivider
                key={group.id}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VoiceIntroCard() {
  return (
    <div
      className={cx("story-card", "centered", "voice-intro-card", "tone-soft")}
      data-about-reveal-target
      data-about-voices-intro
    >
      <div className={cx("section-head")}>
        <CardKicker cx={cx} hasLines label="Три точки зрения" />
        <h2>Один текст, несколько взглядов</h2>
      </div>
      <p>
        Основной состав TOLK — ортодокс, внеконфессиональный христианин и атеист.
        Наши местами полярные, а местами схожие взгляды позволяют рассмотреть
        Библию с неожиданных углов и считывать разные интерпретации одного текста.
      </p>
    </div>
  );
}

function VoiceCard({
  name,
  avatar,
  description,
}: {
  name: string;
  avatar: string;
  description: string;
}) {
  return (
    <article className={cx("voice-card", "tone-soft")} data-about-reveal-target data-about-voice-card>
      <div className={cx("voice-avatar")}>
        <img
          src={withBasePath(avatar)}
          alt={name}
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3>{name}</h3>
      <p>{description}</p>
    </article>
  );
}

export function AboutVoicesSection() {
  const mobileVoicesGroup = buildAboutVoicesMobileStackGroup();

  return (
    <section className={cx("section")}>
      <div className={cx("container")}>
        <div className={cx("desktop-voices-flow")}>
          <VoiceIntroCard />

          <div className={cx("voices-grid")}>
            {aboutVoices.map((voice) => (
              <VoiceCard key={voice.name} {...voice} />
            ))}
            <div className={cx("mobile-divider")} aria-hidden="true" />
          </div>
        </div>

        <div className={cx("mobile-voices-flow")}>
          <MobileStackScene group={mobileVoicesGroup} hasDivider />
          <div className={cx("mobile-divider")} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export function AboutAudienceSection() {
  return (
    <section className={cx("section")}>
      <div className={cx("container")}>
        <article
          className={cx("text-panel", "tone-warm", "is-centered")}
          data-about-reveal-target
          data-about-audience-panel
        >
          <div className={cx("section-head")}>
            <CardKicker cx={cx} hasLines label="Для Кого TOLK" />
            <h2>Для тех, кто ищет</h2>
          </div>
          <p>
            TOLK — это проект для каждого, кто готов к честному диалогу, ценит
            юмор в обсуждении серьезных тем и хочет наполняться мудростью через
            интеллектуальный энтертейнмент.
          </p>
          <p>
            Проект поможет тем, кто интересуется христианством и религией, но не
            знает, как полноценно погрузиться в изучение текстов.
          </p>
          <p>
            Если вам больше по душе обывательское прочтение нежели сухие лекции,
            то вам понравится наша беседа у костра истины.
          </p>
          <p>
            Те, кто стоит перед предельными вопросами бытия, может найти в нашем
            диалоге ориентиры на пути к важным для себя ответам.
          </p>
        </article>
        <div className={cx("mobile-divider")} aria-hidden="true" />
      </div>
    </section>
  );
}

export function AboutClosingSection() {
  return (
    <section className={cx("section")}>
      <div className={cx("container")}>
        <article
          className={cx("story-card", "centered", "tone-soft")}
          data-about-reveal-target
        >
          <div className={cx("section-head")}>
            <CardKicker cx={cx} hasLines label="Продолжение" />
            <h2>Если вам это близко</h2>
          </div>
          <p>
            На главной странице вы найдёте записи стримов, новые выпуски, анонсы
            очных чтений, ссылки на наши соцсети и витрину мерча от TOLK.
          </p>
          <div className={cx("cta-actions")}>
            <Button cx={cx} href="/" label="Перейти на главную" />
          </div>
        </article>
      </div>
    </section>
  );
}
