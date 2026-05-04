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
  ABOUT_PREINIT_MAX_FRAMES,
  ABOUT_PREINIT_STYLE_ID,
  ABOUT_REDUCED_MOTION_QUERY,
  ABOUT_REVEAL_END_PROGRESS,
  ABOUT_REVEAL_STYLE_ID,
  ABOUT_REVEAL_STYLE_TEXT,
  ABOUT_ROUTE_PATHNAME,
  ABOUT_SCENE_SPLIT_INPUT,
  ABOUT_SCENE_SPLIT_OUTPUT,
  ABOUT_SELECTOR_CLOUD_LEFT,
  ABOUT_SELECTOR_CLOUD_RIGHT,
  ABOUT_SELECTOR_CLOUD,
  ABOUT_SELECTOR_FRAME,
  ABOUT_SELECTOR_PAIR,
  ABOUT_SELECTOR_ROOT,
  ABOUT_SELECTOR_STORY_STEP,
  ABOUT_STATIC_FRAME_DESKTOP,
  ABOUT_STATIC_FRAME_MOBILE,
  ABOUT_STATIC_SCENE_QUERY,
  ABOUT_TOTAL_FRAMES,
} from "./aboutMotionConstants";
import { BASE_PATH, withBasePath } from "../../../lib/base-path";

type SerializedConfig = {
  basePath: string;
  routePathname: string;
  totalFrames: number;
  frameStartIndex: number;
  maxFrames: number;
  styles: {
    preinitStyleId: string;
    revealStyleId: string;
    revealStyleText: string;
  };
  selectors: {
    root: string;
    frame: string;
    cloud: string;
    cloudLeft: string;
    cloudRight: string;
    pair: string;
    storyStep: string;
  };
  media: {
    staticSceneQuery: string;
    reducedMotionQuery: string;
  };
  staticFrames: {
    desktop: string;
    mobile: string;
  };
  motion: {
    sceneSplitInput: number;
    sceneSplitOutput: number;
    revealEndProgress: number;
    pairSpreadStart: number;
    pairSpreadEnd: number;
    cloudLeftStartX: number;
    cloudLeftEndX: number;
    cloudRightStartX: number;
    cloudRightEndX: number;
    cloudStartY: number;
    cloudEndY: number;
    cloudRightStartYOffset: number;
    cloudRightEndYOffset: number;
    cloudStartScale: number;
    cloudEndScale: number;
    cloudRightStartScaleMultiplier: number;
    cloudRightEndScaleMultiplier: number;
  };
};

const buildConfig = (): SerializedConfig => ({
  basePath: BASE_PATH,
  routePathname: withBasePath(ABOUT_ROUTE_PATHNAME),
  totalFrames: ABOUT_TOTAL_FRAMES,
  frameStartIndex: ABOUT_FRAME_START_INDEX,
  maxFrames: ABOUT_PREINIT_MAX_FRAMES,
  styles: {
    preinitStyleId: ABOUT_PREINIT_STYLE_ID,
    revealStyleId: ABOUT_REVEAL_STYLE_ID,
    revealStyleText: ABOUT_REVEAL_STYLE_TEXT,
  },
  selectors: {
    root: ABOUT_SELECTOR_ROOT,
    frame: ABOUT_SELECTOR_FRAME,
    cloud: ABOUT_SELECTOR_CLOUD,
    cloudLeft: ABOUT_SELECTOR_CLOUD_LEFT,
    cloudRight: ABOUT_SELECTOR_CLOUD_RIGHT,
    pair: ABOUT_SELECTOR_PAIR,
    storyStep: ABOUT_SELECTOR_STORY_STEP,
  },
  media: {
    staticSceneQuery: ABOUT_STATIC_SCENE_QUERY,
    reducedMotionQuery: ABOUT_REDUCED_MOTION_QUERY,
  },
  staticFrames: {
    desktop: ABOUT_STATIC_FRAME_DESKTOP,
    mobile: ABOUT_STATIC_FRAME_MOBILE,
  },
  motion: {
    sceneSplitInput: ABOUT_SCENE_SPLIT_INPUT,
    sceneSplitOutput: ABOUT_SCENE_SPLIT_OUTPUT,
    revealEndProgress: ABOUT_REVEAL_END_PROGRESS,
    pairSpreadStart: ABOUT_PAIR_SPREAD_START,
    pairSpreadEnd: ABOUT_PAIR_SPREAD_END,
    cloudLeftStartX: ABOUT_CLOUD_LEFT_START_X_MULTIPLIER,
    cloudLeftEndX: ABOUT_CLOUD_LEFT_END_X_MULTIPLIER,
    cloudRightStartX: ABOUT_CLOUD_RIGHT_START_X_MULTIPLIER,
    cloudRightEndX: ABOUT_CLOUD_RIGHT_END_X_MULTIPLIER,
    cloudStartY: ABOUT_CLOUD_START_Y_MULTIPLIER,
    cloudEndY: ABOUT_CLOUD_END_Y_MULTIPLIER,
    cloudRightStartYOffset: ABOUT_CLOUD_RIGHT_START_Y_OFFSET,
    cloudRightEndYOffset: ABOUT_CLOUD_RIGHT_END_Y_OFFSET,
    cloudStartScale: ABOUT_CLOUD_START_SCALE,
    cloudEndScale: ABOUT_CLOUD_END_SCALE,
    cloudRightStartScaleMultiplier: ABOUT_CLOUD_RIGHT_START_SCALE_MULTIPLIER,
    cloudRightEndScaleMultiplier: ABOUT_CLOUD_RIGHT_END_SCALE_MULTIPLIER,
  },
});

export const buildAboutPreinitScript = () => {
  const config = JSON.stringify(buildConfig());
  return `(function () {
  var cfg = ${config};
  var normalizePathname = function (pathname) {
    if (!pathname) return "/";
    if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === "/") {
      return pathname.slice(0, -1);
    }
    return pathname;
  };
  if (normalizePathname(window.location.pathname) !== normalizePathname(cfg.routePathname)) return;

  var clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
  };
  var mix = function (from, to, t) {
    return from + (to - from) * t;
  };
  var mapSceneProgress = function (x) {
    var clamped = clamp(x, 0, 1);
    if (clamped <= cfg.motion.sceneSplitInput) {
      return (clamped / cfg.motion.sceneSplitInput) * cfg.motion.sceneSplitOutput;
    }
    return cfg.motion.sceneSplitOutput + ((clamped - cfg.motion.sceneSplitInput) / (1 - cfg.motion.sceneSplitInput)) * (1 - cfg.motion.sceneSplitOutput);
  };
  var easeRevealProgress = function (progress) {
    var revealInput = clamp(progress / cfg.motion.revealEndProgress, 0, 1);
    return revealInput < 0.5
      ? 2 * revealInput * revealInput
      : 1 - Math.pow(-2 * revealInput + 2, 2) / 2;
  };
  var getCloudMotionState = function (progress, viewportWidth, viewportHeight) {
    var reveal = easeRevealProgress(progress);
    var leftX = mix(viewportWidth * cfg.motion.cloudLeftStartX, viewportWidth * cfg.motion.cloudLeftEndX, reveal);
    var rightX = mix(viewportWidth * cfg.motion.cloudRightStartX, viewportWidth * cfg.motion.cloudRightEndX, reveal);
    var leftY = mix(viewportHeight * cfg.motion.cloudStartY, viewportHeight * cfg.motion.cloudEndY, reveal);
    var rightY = mix(viewportHeight * cfg.motion.cloudStartY + cfg.motion.cloudRightStartYOffset, viewportHeight * cfg.motion.cloudEndY + cfg.motion.cloudRightEndYOffset, reveal);
    var leftScale = mix(cfg.motion.cloudStartScale, cfg.motion.cloudEndScale, reveal);
    var rightScale = mix(cfg.motion.cloudStartScale * cfg.motion.cloudRightStartScaleMultiplier, cfg.motion.cloudEndScale * cfg.motion.cloudRightEndScaleMultiplier, reveal);
    return { leftX: leftX, leftY: leftY, leftScale: leftScale, rightX: rightX, rightY: rightY, rightScale: rightScale };
  };
  var getFrameIndex = function (progress) {
    return Math.round(clamp(progress, 0, 1) * (cfg.totalFrames - 1));
  };
  var getFrameVariant = function () {
    if (window.matchMedia(cfg.media.reducedMotionQuery).matches) return "desktop";
    return window.matchMedia(cfg.media.staticSceneQuery).matches ? "mobile" : "desktop";
  };
  var getFrameSrc = function (progress, variant) {
    var frameNumber = String(getFrameIndex(progress) + cfg.frameStartIndex).padStart(3, "0");
    return cfg.basePath + "/about/assets/angel-sequence/" + variant + "/frame-" + frameNumber + ".webp";
  };
  var getPairProgress = function (pairYProgress) {
    return clamp(
      (pairYProgress - cfg.motion.pairSpreadStart) /
        Math.max(cfg.motion.pairSpreadEnd - cfg.motion.pairSpreadStart, 0.001),
      0,
      1
    );
  };

  var ensureStyleById = function (id) {
    var styleEl = document.getElementById(id);
    if (styleEl) return styleEl;
    styleEl = document.createElement("style");
    styleEl.id = id;
    document.head.appendChild(styleEl);
    return styleEl;
  };
  var ensureRevealStyle = function () {
    var styleEl = ensureStyleById(cfg.styles.revealStyleId);
    if (styleEl.textContent !== cfg.styles.revealStyleText) {
      styleEl.textContent = cfg.styles.revealStyleText;
    }
    return styleEl;
  };
  var writeVars = function (vars) {
    var css = ":root{";
    for (var i = 0; i < vars.pairs.length; i += 1) {
      var p = vars.pairs[i];
      css += "--about-pair-" + p.index + "-progress:" + p.progress + ";";
      css += "--about-pair-" + p.index + "-y:" + p.yProgress + ";";
    }
    css += "--about-cloud-left-x:" + vars.cloudLeftX + ";";
    css += "--about-cloud-left-y:" + vars.cloudLeftY + ";";
    css += "--about-cloud-left-scale:" + vars.cloudLeftScale + ";";
    css += "--about-cloud-right-x:" + vars.cloudRightX + ";";
    css += "--about-cloud-right-y:" + vars.cloudRightY + ";";
    css += "--about-cloud-right-scale:" + vars.cloudRightScale + ";";
    css += "--about-frame-src:url(\\"" + vars.frameSrc + "\\");";
    css += "}";
    ensureStyleById(cfg.styles.preinitStyleId).textContent = css;
  };
  var getPairIndex = function (pairEl, fallbackIndex) {
    var raw = pairEl.getAttribute("data-pair-index");
    if (!raw) return fallbackIndex;
    var parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : fallbackIndex;
  };

  var computeState = function () {
    var root = document.querySelector(cfg.selectors.root);
    var frame = document.querySelector(cfg.selectors.frame);
    var clouds = document.querySelectorAll(cfg.selectors.cloud);
    var cloudLeft = document.querySelector(cfg.selectors.cloudLeft);
    var cloudRight = document.querySelector(cfg.selectors.cloudRight);
    var pairs = document.querySelectorAll(cfg.selectors.pair);
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    var targetProgress = mapSceneProgress(scrollTop / maxScroll);
    var cloud = getCloudMotionState(targetProgress, window.innerWidth, window.innerHeight);
    var pairEntries = [];
    var pairsWithGeometry = true;
    for (var i = 0; i < pairs.length; i += 1) {
      var pair = pairs[i];
      var step = pair.closest(cfg.selectors.storyStep);
      if (!step) {
        pairsWithGeometry = false;
        continue;
      }
      var stepRect = step.getBoundingClientRect();
      var stickyTravel = Math.max(stepRect.height - window.innerHeight, 1);
      var stepTop = stepRect.top + scrollTop;
      var stepTopInViewport = stepTop - scrollTop;
      var pairYProgress = clamp(-stepTopInViewport / stickyTravel, 0, 1);
      pairEntries.push({
        index: getPairIndex(pair, i),
        progress: getPairProgress(pairYProgress).toFixed(4),
        yProgress: pairYProgress.toFixed(4),
      });
    }

    var frameVariant = getFrameVariant();
    var frameSrc =
      window.matchMedia(cfg.media.reducedMotionQuery).matches
        ? cfg.staticFrames.desktop
        : window.matchMedia(cfg.media.staticSceneQuery).matches
          ? cfg.staticFrames.mobile
          : getFrameSrc(targetProgress, frameVariant);
    writeVars({
      cloudLeftX: cloud.leftX.toFixed(3) + "px",
      cloudLeftY: cloud.leftY.toFixed(3) + "px",
      cloudLeftScale: cloud.leftScale.toFixed(6),
      cloudRightX: cloud.rightX.toFixed(3) + "px",
      cloudRightY: cloud.rightY.toFixed(3) + "px",
      cloudRightScale: cloud.rightScale.toFixed(6),
      frameSrc: frameSrc,
      pairs: pairEntries,
    });

    return {
      frame: frame,
      targetProgress: targetProgress,
      frameVariant: frameVariant,
      hasAllNodes:
        !!root &&
        !!frame &&
        !!cloudLeft &&
        !!cloudRight &&
        clouds.length >= 2 &&
        pairs.length > 0,
      pairsWithGeometry: pairsWithGeometry,
    };
  };

  var didReveal = false;
  var frameCount = 0;
  var tryReveal = function (state) {
    if (didReveal) return;
    if (!state.hasAllNodes || !state.pairsWithGeometry) return;
    var desiredSrc =
      window.matchMedia(cfg.media.reducedMotionQuery).matches
        ? cfg.staticFrames.desktop
        : window.matchMedia(cfg.media.staticSceneQuery).matches
          ? cfg.staticFrames.mobile
          : getFrameSrc(state.targetProgress, state.frameVariant);
    if (state.frame && state.frame.getAttribute("src") !== desiredSrc) {
      state.frame.setAttribute("src", desiredSrc);
    }
    ensureRevealStyle();
    didReveal = true;
  };
  var tick = function () {
    if (didReveal) return;
    var state = computeState();
    tryReveal(state);
    frameCount += 1;
    if (!didReveal && frameCount < cfg.maxFrames) requestAnimationFrame(tick);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      requestAnimationFrame(tick);
    }, { once: true });
  }
  requestAnimationFrame(tick);
})();`;
};
