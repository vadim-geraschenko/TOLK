"use client";

import { aboutContent } from "@/content/about";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CardKicker } from "@/components/ui/CardKicker";
import { Button } from "@/components/ui/Button";
import { StoryCard } from "@/components/primitives/StoryCard";
import { TextPanel } from "@/components/primitives/TextPanel";
import { VoiceCard } from "@/components/primitives/VoiceCard";
import { AboutBackgroundScene } from "./AboutBackgroundScene";
import styles from "./about.module.css";
import { useAboutSceneMotion } from "@/lib/motion/useAboutSceneMotion";

export function AboutPage() {
  const {
    frameRef,
    leftCloudRef,
    rightCloudRef,
    setPairRef,
    setPairStepRef,
    frameReady,
  } =
    useAboutSceneMotion(3);

  return (
    <div className={styles.pageShell}>
      <AboutBackgroundScene
        frameRef={frameRef}
        leftCloudRef={leftCloudRef}
        rightCloudRef={rightCloudRef}
        frameReady={frameReady}
      />
      <SiteHeader currentPath="/about" />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={`${styles.heroShell} ${styles.toneNeutral}`}>
              <div className={styles.heroGrid}>
                <div className={styles.heroCopy}>
                  <CardKicker lines>{aboutContent.hero.kicker}</CardKicker>
                  <h1>{aboutContent.hero.title}</h1>
                  <p>{aboutContent.hero.description}</p>
                </div>
              </div>
            </div>
            <div className={styles.mobileDivider} aria-hidden="true" />
          </div>
        </section>

        <section className={`${styles.section} ${styles.storyLead}`}>
          <div className={styles.container}>
            <StoryCard
              className={`${styles.storyCard} ${styles.centered} ${styles.toneNeutral}`}
            >
              <CardKicker lines>{aboutContent.lead.kicker}</CardKicker>
              <h2>{aboutContent.lead.title}</h2>
              {aboutContent.lead.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </StoryCard>
          </div>
        </section>

        <section className={`${styles.section} ${styles.story}`}>
          <div className={styles.container}>
            <div className={styles.storyCards}>
              {aboutContent.pairGroups.slice(0, 2).map((group, index) => (
                <article
                  key={`pair-${index}`}
                  className={`${styles.storyStep} ${styles.storyStepPair}`}
                  ref={setPairStepRef(index)}
                >
                  <div className={styles.storyPair} ref={setPairRef(index)} data-pair>
                    {group.map((item) => (
                      <div
                        key={item.title}
                        className={`${styles.storyCard} ${styles.pairCard} ${
                          item.tone === "warm" ? styles.toneWarm : styles.toneSoft
                        }`}
                      >
                        <CardKicker>{item.kicker}</CardKicker>
                        <h2>{item.title}</h2>
                        {item.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                  {index === 1 ? (
                    <div className={styles.mobileDivider} aria-hidden="true" />
                  ) : null}
                </article>
              ))}

              <article className={styles.storyStep}>
                <StoryCard
                  className={`${styles.storyCard} ${styles.centered} ${styles.toneSoft}`}
                >
                  <CardKicker lines>{aboutContent.readingMethod.kicker}</CardKicker>
                  <h2>{aboutContent.readingMethod.title}</h2>
                  {aboutContent.readingMethod.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </StoryCard>
                <div className={styles.mobileDivider} aria-hidden="true" />
              </article>

              <article
                className={`${styles.storyStep} ${styles.storyStepPair}`}
                ref={setPairStepRef(2)}
              >
                <div className={styles.storyPair} ref={setPairRef(2)} data-pair>
                  {aboutContent.pairGroups[2].map((item) => (
                    <div
                      key={item.title}
                      className={`${styles.storyCard} ${styles.pairCard} ${
                        item.tone === "warm" ? styles.toneWarm : styles.toneSoft
                      }`}
                    >
                      <CardKicker>{item.kicker}</CardKicker>
                      <h2>{item.title}</h2>
                      {item.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className={styles.mobileDivider} aria-hidden="true" />
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <StoryCard
              className={`${styles.storyCard} ${styles.centered} ${styles.voiceIntroCard} ${styles.toneSoft}`}
            >
              <div className={styles.sectionHead}>
                <CardKicker lines>{aboutContent.voicesIntro.kicker}</CardKicker>
                <h2>{aboutContent.voicesIntro.title}</h2>
              </div>
              <p>{aboutContent.voicesIntro.description}</p>
            </StoryCard>

            <div className={styles.voicesGrid}>
              {aboutContent.voices.map((voice, index) => (
                <VoiceCard
                  key={voice.name}
                  className={`${styles.voiceCard} ${styles.toneSoft}`}
                >
                  <div className={styles.voiceAvatar}>
                    <img src={voice.avatar} alt={voice.name} />
                  </div>
                  <h3>{voice.name}</h3>
                  <p>{voice.description}</p>
                </VoiceCard>
              ))}
              <div className={styles.mobileDivider} aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <TextPanel className={`${styles.textPanel} ${styles.toneWarm}`}>
              <div className={styles.sectionHead}>
                <CardKicker lines>{aboutContent.audience.kicker}</CardKicker>
                <h2>{aboutContent.audience.title}</h2>
              </div>
              {aboutContent.audience.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </TextPanel>
            <div className={styles.mobileDivider} aria-hidden="true" />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <StoryCard
              className={`${styles.storyCard} ${styles.centered} ${styles.toneSoft}`}
            >
              <div className={styles.sectionHead}>
                <CardKicker lines>{aboutContent.next.kicker}</CardKicker>
                <h2>{aboutContent.next.title}</h2>
              </div>
              <p>{aboutContent.next.description}</p>
              <div className={styles.ctaActions}>
                <Button href="/">Перейти на главную</Button>
              </div>
            </StoryCard>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
