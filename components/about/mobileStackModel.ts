import {
  aboutStoryLeadCard,
  aboutStorySteps,
  aboutVoices,
  type AboutStoryCard,
  type AboutStoryStep,
  type AboutVoice,
} from "../../content/about";

export type AboutMobileStackCard =
  | {
      kind: "story";
      id: string;
      card: AboutStoryCard;
    }
  | {
      kind: "voice";
      id: string;
      voice: AboutVoice;
    }
  | {
      kind: "voice-intro";
      id: string;
    };

export type AboutMobileStackGroup = {
  id: string;
  cards: AboutMobileStackCard[];
};

function getStoryStepCards(step: AboutStoryStep): AboutStoryCard[] {
  return step.kind === "pair" ? step.cards : [step.card];
}

export function buildAboutStoryMobileStackGroups(
  steps = aboutStorySteps,
  leadCard = aboutStoryLeadCard,
): AboutMobileStackGroup[] {
  const groups: AboutMobileStackGroup[] = [];
  let currentCards: AboutMobileStackCard[] = [
    { kind: "story", id: "story-lead", card: leadCard },
  ];

  steps.forEach((step, stepIndex) => {
    getStoryStepCards(step).forEach((card, cardIndex) => {
      currentCards.push({
        kind: "story",
        id: `story-${stepIndex}-${cardIndex}`,
        card,
      });
    });

    if (step.kind === "pair" && step.hasMobileDivider) {
      groups.push({
        id: `story-group-${groups.length}`,
        cards: currentCards,
      });
      currentCards = [];
    }
  });

  if (currentCards.length > 0) {
    groups.push({
      id: `story-group-${groups.length}`,
      cards: currentCards,
    });
  }

  return groups;
}

export function buildAboutVoicesMobileStackGroup(
  voices = aboutVoices,
): AboutMobileStackGroup {
  return {
    id: "voices",
    cards: [
      { kind: "voice-intro", id: "voice-intro" },
      ...voices.map((voice) => ({
        kind: "voice" as const,
        id: `voice-${voice.name}`,
        voice,
      })),
    ],
  };
}
