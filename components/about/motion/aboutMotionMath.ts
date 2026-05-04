import {
  ABOUT_CLOUD_END_SCALE,
  ABOUT_CLOUD_END_Y_MULTIPLIER,
  ABOUT_CLOUD_LEFT_END_X_MULTIPLIER,
  ABOUT_CLOUD_LEFT_START_X_MULTIPLIER,
  ABOUT_CLOUD_RIGHT_END_SCALE_MULTIPLIER,
  ABOUT_CLOUD_RIGHT_END_X_MULTIPLIER,
  ABOUT_CLOUD_RIGHT_END_Y_OFFSET,
  ABOUT_CLOUD_RIGHT_START_SCALE_MULTIPLIER,
  ABOUT_CLOUD_RIGHT_START_X_MULTIPLIER,
  ABOUT_CLOUD_RIGHT_START_Y_OFFSET,
  ABOUT_CLOUD_START_SCALE,
  ABOUT_CLOUD_START_Y_MULTIPLIER,
  ABOUT_FRAME_START_INDEX,
  ABOUT_PAIR_SPREAD_END,
  ABOUT_PAIR_SPREAD_START,
  ABOUT_REVEAL_END_PROGRESS,
  ABOUT_SCENE_SPLIT_INPUT,
  ABOUT_SCENE_SPLIT_OUTPUT,
  ABOUT_TOTAL_FRAMES,
} from "./aboutMotionConstants";
import { withBasePath } from "../../../lib/base-path";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const mix = (from: number, to: number, t: number) => from + (to - from) * t;

export const mapSceneProgress = (x: number) => {
  const clamped = clamp(x, 0, 1);

  if (clamped <= ABOUT_SCENE_SPLIT_INPUT) {
    return (clamped / ABOUT_SCENE_SPLIT_INPUT) * ABOUT_SCENE_SPLIT_OUTPUT;
  }

  return (
    ABOUT_SCENE_SPLIT_OUTPUT +
    ((clamped - ABOUT_SCENE_SPLIT_INPUT) / (1 - ABOUT_SCENE_SPLIT_INPUT)) *
      (1 - ABOUT_SCENE_SPLIT_OUTPUT)
  );
};

export const easeRevealProgress = (progress: number) => {
  const revealInput = clamp(progress / ABOUT_REVEAL_END_PROGRESS, 0, 1);
  return revealInput < 0.5
    ? 2 * revealInput * revealInput
    : 1 - Math.pow(-2 * revealInput + 2, 2) / 2;
};

export type CloudMotionState = {
  leftX: number;
  leftY: number;
  leftScale: number;
  rightX: number;
  rightY: number;
  rightScale: number;
};

export const getCloudMotionState = (
  progress: number,
  viewportWidth: number,
  viewportHeight: number,
): CloudMotionState => {
  const reveal = easeRevealProgress(progress);

  const leftX = mix(
    viewportWidth * ABOUT_CLOUD_LEFT_START_X_MULTIPLIER,
    viewportWidth * ABOUT_CLOUD_LEFT_END_X_MULTIPLIER,
    reveal,
  );
  const rightX = mix(
    viewportWidth * ABOUT_CLOUD_RIGHT_START_X_MULTIPLIER,
    viewportWidth * ABOUT_CLOUD_RIGHT_END_X_MULTIPLIER,
    reveal,
  );
  const leftY = mix(
    viewportHeight * ABOUT_CLOUD_START_Y_MULTIPLIER,
    viewportHeight * ABOUT_CLOUD_END_Y_MULTIPLIER,
    reveal,
  );
  const rightY = mix(
    viewportHeight * ABOUT_CLOUD_START_Y_MULTIPLIER + ABOUT_CLOUD_RIGHT_START_Y_OFFSET,
    viewportHeight * ABOUT_CLOUD_END_Y_MULTIPLIER + ABOUT_CLOUD_RIGHT_END_Y_OFFSET,
    reveal,
  );
  const leftScale = mix(ABOUT_CLOUD_START_SCALE, ABOUT_CLOUD_END_SCALE, reveal);
  const rightScale = mix(
    ABOUT_CLOUD_START_SCALE * ABOUT_CLOUD_RIGHT_START_SCALE_MULTIPLIER,
    ABOUT_CLOUD_END_SCALE * ABOUT_CLOUD_RIGHT_END_SCALE_MULTIPLIER,
    reveal,
  );

  return { leftX, leftY, leftScale, rightX, rightY, rightScale };
};

export const getFrameIndex = (progress: number) =>
  Math.round(clamp(progress, 0, 1) * (ABOUT_TOTAL_FRAMES - 1));

export const getFrameNumberFromIndex = (index: number) =>
  String(index + ABOUT_FRAME_START_INDEX).padStart(3, "0");

export const getFrameSrcByIndex = (index: number, variant: "desktop" | "mobile") =>
  withBasePath(
    `/about/assets/angel-sequence/${variant}/frame-${getFrameNumberFromIndex(index)}.webp`,
  );

export const getFrameSrcByProgress = (
  progress: number,
  variant: "desktop" | "mobile",
) => getFrameSrcByIndex(getFrameIndex(progress), variant);

export const getPairProgress = (pairYProgress: number) =>
  clamp(
    (pairYProgress - ABOUT_PAIR_SPREAD_START) /
      Math.max(ABOUT_PAIR_SPREAD_END - ABOUT_PAIR_SPREAD_START, 0.001),
    0,
    1,
  );
