import {
  aboutStorySteps,
  aboutVoices,
  type AboutStoryCard,
  type AboutStoryStep,
} from "../../content/about";
import { Button } from "../site/Button";
import { CardKicker } from "../site/CardKicker";

export function AboutHeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-shell tone-neutral">
          <div className="hero-grid">
            <div className="hero-copy">
              <CardKicker hasLines label="О Проекте" />
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
        <div className="mobile-divider" aria-hidden="true" />
      </div>
    </section>
  );
}

export function AboutStoryLeadSection() {
  return (
    <section className="section story-lead">
      <div className="container">
        <article className="story-card centered tone-neutral">
          <CardKicker hasLines label="Почему Библия" />
          <h2>Почему мы снова и снова возвращаемся к этой книге</h2>
          <p>
            Библия — это текстуальная точка сингулярности. Чем глубже вглядываешься
            в книгу, тем больше смыслов в ней видишь. Мы исследуем её, как
            неисчерпаемый источник людской мудрости, новых идей и изящных
            концептов.
          </p>
          <p>
            Это книга, из которой во многом выросли наша культура, моральный язык,
            образ человека и само представление о добре, вине, спасении, надежде,
            любви и жертве.
          </p>
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
  const classes = [
    "story-card",
    card.centered ? "centered" : "",
    card.tone ?? "tone-soft",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <CardKicker hasLines={card.kickerHasLines} label={card.kicker} />
      <h2>{card.title}</h2>
      <StoryParagraphs paragraphs={card.paragraphs} />
    </div>
  );
}

function StoryStep({ step }: { step: AboutStoryStep }) {
  const stepClasses = [
    "story-step",
    step.kind === "pair" ? "story-step-pair" : "",
    step.kind === "pair" ? step.className ?? "" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={stepClasses} data-progress={step.progress}>
      {step.kind === "pair" ? (
        <div className="story-pair" data-pair>
          <StoryCard card={step.cards[0]} />
          <StoryCard card={step.cards[1]} />
        </div>
      ) : (
        <StoryCard card={step.card} />
      )}
      {step.hasMobileDivider ? <div className="mobile-divider" aria-hidden="true" /> : null}
    </article>
  );
}

export function AboutStorySection() {
  return (
    <section className="section story" id="story">
      <div className="container">
        <div className="story-cards" id="story-cards">
          {aboutStorySteps.map((step, index) => (
            <StoryStep key={index} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VoiceIntroCard() {
  return (
    <div className="story-card centered voice-intro-card tone-soft">
      <div className="section-head">
        <CardKicker hasLines label="Три точки зрения" />
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
    <article className="voice-card tone-soft">
      <div className="voice-avatar">
        <img src={avatar} alt={name} />
      </div>
      <h3>{name}</h3>
      <p>{description}</p>
    </article>
  );
}

export function AboutVoicesSection() {
  return (
    <section className="section">
      <div className="container">
        <VoiceIntroCard />

        <div className="voices-grid">
          {aboutVoices.map((voice) => (
            <VoiceCard key={voice.name} {...voice} />
          ))}
          <div className="mobile-divider" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export function AboutAudienceSection() {
  return (
    <section className="section">
      <div className="container">
        <article className="text-panel tone-warm is-centered">
          <div className="section-head">
            <CardKicker hasLines label="Для Кого TOLK" />
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
        <div className="mobile-divider" aria-hidden="true" />
      </div>
    </section>
  );
}

export function AboutClosingSection() {
  return (
    <section className="section">
      <div className="container">
        <article className="story-card centered tone-soft">
          <div className="section-head">
            <CardKicker hasLines label="Продолжение" />
            <h2>Если вам это близко</h2>
          </div>
          <p>
            На главной странице вы найдёте записи стримов, новые выпуски, анонсы
            очных чтений, ссылки на наши соцсети и витрину мерча от TOLK.
          </p>
          <div className="cta-actions">
            <Button href="/" label="Перейти на главную" />
          </div>
        </article>
      </div>
    </section>
  );
}
