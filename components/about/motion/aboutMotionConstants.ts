import { withBasePath } from "../../../lib/base-path";

export const ABOUT_PREINIT_STYLE_ID = "__about-preinit-vars";
export const ABOUT_REVEAL_STYLE_ID = "__about-reveal";

export const ABOUT_ROUTE_PATHNAME = "/about";

export const ABOUT_SELECTOR_ROOT = "[data-about-root]";
export const ABOUT_SELECTOR_FRAME = "[data-about-frame]";
export const ABOUT_SELECTOR_CLOUD = "[data-about-cloud]";
export const ABOUT_SELECTOR_CLOUD_LEFT = '[data-about-cloud="left"]';
export const ABOUT_SELECTOR_CLOUD_RIGHT = '[data-about-cloud="right"]';
export const ABOUT_SELECTOR_PAIR = "[data-about-pair]";
export const ABOUT_SELECTOR_STORY_STEP = "[data-story-step]";
export const ABOUT_SELECTOR_REVEAL_TARGET = "[data-about-reveal-target]";
export const ABOUT_SELECTOR_MOBILE_STACK_SCENE = "[data-mobile-stack-scene]";
export const ABOUT_SELECTOR_MOBILE_STACK_ITEM = "[data-mobile-stack-item]";

export const ABOUT_TOTAL_FRAMES = 60;
export const ABOUT_FRAME_START_INDEX = 1;
export const ABOUT_STATIC_FRAME_DESKTOP =
  withBasePath("/about/assets/angel-sequence/desktop/frame-028.webp");
export const ABOUT_STATIC_FRAME_MOBILE =
  withBasePath("/about/assets/angel-sequence/mobile/frame-028.webp");

export const ABOUT_REVEAL_END_PROGRESS = 0.3;
export const ABOUT_PAIR_SPREAD_START = 0.1;
export const ABOUT_PAIR_SPREAD_END = 1;

export const ABOUT_SCENE_SPLIT_INPUT = 0.84;
export const ABOUT_SCENE_SPLIT_OUTPUT = 0.9;

export const ABOUT_CLOUD_LEFT_START_X_MULTIPLIER = 0.28;
export const ABOUT_CLOUD_LEFT_END_X_MULTIPLIER = -0.3;
export const ABOUT_CLOUD_RIGHT_START_X_MULTIPLIER = 0.27;
export const ABOUT_CLOUD_RIGHT_END_X_MULTIPLIER = 0.8;
export const ABOUT_CLOUD_START_Y_MULTIPLIER = 0.07;
export const ABOUT_CLOUD_END_Y_MULTIPLIER = 0.02;
export const ABOUT_CLOUD_RIGHT_START_Y_OFFSET = 8;
export const ABOUT_CLOUD_RIGHT_END_Y_OFFSET = -4;
export const ABOUT_CLOUD_START_SCALE = 1.42;
export const ABOUT_CLOUD_END_SCALE = 1.16;
export const ABOUT_CLOUD_RIGHT_START_SCALE_MULTIPLIER = 1.03;
export const ABOUT_CLOUD_RIGHT_END_SCALE_MULTIPLIER = 1.01;

export const ABOUT_REVEAL_STYLE_TEXT = `${ABOUT_SELECTOR_REVEAL_TARGET}{visibility:visible !important;opacity:1 !important;transition:opacity 180ms ease;}`;

export const ABOUT_MOTION_RENDER_EPSILON = 0.0008;
export const ABOUT_LERP_FACTOR = 0.12;

export const ABOUT_STATIC_SCENE_QUERY = "(max-width: 1100px)";
export const ABOUT_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const ABOUT_MOBILE_STACK_QUERY = "(max-width: 760px)";
export const ABOUT_MOBILE_STACK_SAFE_TOP = 202;
export const ABOUT_MOBILE_STACK_BOTTOM_GAP = 32;
export const ABOUT_MOBILE_STACK_CARD_GAP = 40;
export const ABOUT_MOBILE_STACK_CARD_PEEK = 12;

export const ABOUT_PRELOAD_BUFFER = 6;
export const ABOUT_PRELOAD_EAGER_RADIUS = 10;
export const ABOUT_BOOT_EAGER_RADIUS = 14;
export const ABOUT_BOOT_MAX_WAIT_MS = 3200;
export const ABOUT_BACKGROUND_PRELOAD_CONCURRENCY = 4;

export const ABOUT_PREINIT_MAX_FRAMES = 150;
