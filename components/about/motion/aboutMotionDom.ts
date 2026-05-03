import {
  ABOUT_PREINIT_STYLE_ID,
  ABOUT_REVEAL_STYLE_ID,
  ABOUT_REVEAL_STYLE_TEXT,
  ABOUT_SELECTOR_CLOUD_LEFT,
  ABOUT_SELECTOR_CLOUD_RIGHT,
  ABOUT_SELECTOR_FRAME,
  ABOUT_SELECTOR_PAIR,
  ABOUT_SELECTOR_ROOT,
  ABOUT_SELECTOR_STORY_STEP,
} from "./aboutMotionConstants";

export const ensureStyleById = (id: string) => {
  let styleEl = document.getElementById(id) as HTMLStyleElement | null;
  if (styleEl) return styleEl;
  styleEl = document.createElement("style");
  styleEl.id = id;
  document.head.appendChild(styleEl);
  return styleEl;
};

export const ensureAboutRevealStyle = () => {
  const styleEl = ensureStyleById(ABOUT_REVEAL_STYLE_ID);
  if (styleEl.textContent !== ABOUT_REVEAL_STYLE_TEXT) {
    styleEl.textContent = ABOUT_REVEAL_STYLE_TEXT;
  }
  return styleEl;
};

export const ensureAboutMotionVarsStyle = () => ensureStyleById(ABOUT_PREINIT_STYLE_ID);

export const readAboutDomNodes = () => {
  const root = document.querySelector<HTMLElement>(ABOUT_SELECTOR_ROOT);
  const frame = document.querySelector<HTMLImageElement>(ABOUT_SELECTOR_FRAME);
  const leftCloud = document.querySelector<HTMLElement>(ABOUT_SELECTOR_CLOUD_LEFT);
  const rightCloud = document.querySelector<HTMLElement>(ABOUT_SELECTOR_CLOUD_RIGHT);
  const pairs = Array.from(document.querySelectorAll<HTMLElement>(ABOUT_SELECTOR_PAIR));
  return { root, frame, leftCloud, rightCloud, pairs };
};

export const getStoryStepForPair = (pairEl: HTMLElement) =>
  pairEl.closest<HTMLElement>(ABOUT_SELECTOR_STORY_STEP);

export type AboutMotionVarsSnapshot = {
  cloudLeftX: string;
  cloudLeftY: string;
  cloudLeftScale: string;
  cloudRightX: string;
  cloudRightY: string;
  cloudRightScale: string;
  frameSrc: string;
  pairs: Array<{ index: number; progress: string; yProgress: string }>;
};

export const writeAboutMotionVarsStyle = (snapshot: AboutMotionVarsSnapshot) => {
  const styleEl = ensureAboutMotionVarsStyle();
  const css = [
    ":root{",
    `--about-cloud-left-x:${snapshot.cloudLeftX};`,
    `--about-cloud-left-y:${snapshot.cloudLeftY};`,
    `--about-cloud-left-scale:${snapshot.cloudLeftScale};`,
    `--about-cloud-right-x:${snapshot.cloudRightX};`,
    `--about-cloud-right-y:${snapshot.cloudRightY};`,
    `--about-cloud-right-scale:${snapshot.cloudRightScale};`,
    `--about-frame-src:url("${snapshot.frameSrc}");`,
    ...snapshot.pairs.flatMap((pair) => [
      `--about-pair-${pair.index}-progress:${pair.progress};`,
      `--about-pair-${pair.index}-y:${pair.yProgress};`,
    ]),
    "}",
  ].join("");
  styleEl.textContent = css;
  return styleEl;
};

export const getPairIndexFromElement = (pairEl: HTMLElement, fallbackIndex: number) => {
  const rawIndex = pairEl.getAttribute("data-pair-index");
  if (!rawIndex) return fallbackIndex;
  const parsed = Number.parseInt(rawIndex, 10);
  return Number.isFinite(parsed) ? parsed : fallbackIndex;
};
