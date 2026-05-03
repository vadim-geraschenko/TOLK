"use client";

import { useLayoutEffect } from "react";
import {
  ABOUT_BACKGROUND_PRELOAD_CONCURRENCY,
  ABOUT_LERP_FACTOR,
  ABOUT_MOTION_RENDER_EPSILON,
  ABOUT_PRELOAD_BUFFER,
  ABOUT_PRELOAD_EAGER_RADIUS,
  ABOUT_REDUCED_MOTION_QUERY,
  ABOUT_SELECTOR_PAIR,
  ABOUT_STATIC_FRAME_DESKTOP,
  ABOUT_STATIC_FRAME_MOBILE,
  ABOUT_STATIC_SCENE_QUERY,
  ABOUT_TOTAL_FRAMES,
} from "./motion/aboutMotionConstants";
import {
  clamp,
  getCloudMotionState,
  getFrameIndex,
  getFrameSrcByIndex,
  getFrameSrcByProgress,
  getPairProgress,
  mapSceneProgress,
} from "./motion/aboutMotionMath";
import {
  ensureAboutRevealStyle,
  readAboutDomNodes,
  getPairIndexFromElement,
  getStoryStepForPair,
  writeAboutMotionVarsStyle,
} from "./motion/aboutMotionDom";

type StoryPairState = {
  pair: HTMLElement;
  pairStep: HTMLElement | null;
  pairIndex: number;
  stepTop: number;
  stickyTravel: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  appliedX: number;
  appliedY: number;
};

const createFrameSources = (variant: "desktop" | "mobile") =>
  Array.from({ length: ABOUT_TOTAL_FRAMES }, (_, index) =>
    getFrameSrcByIndex(index, variant),
  );

export function AboutMotion() {
  useLayoutEffect(() => {
    const { frame: storyFrame, leftCloud, rightCloud } = readAboutDomNodes();

    if (!storyFrame || !leftCloud || !rightCloud) return;

    const storyPairStates: StoryPairState[] = Array.from(
      document.querySelectorAll<HTMLElement>(ABOUT_SELECTOR_PAIR),
    ).map((pair, fallbackIndex) => ({
      pair,
      pairStep: getStoryStepForPair(pair),
      pairIndex: getPairIndexFromElement(pair, fallbackIndex),
      stepTop: 0,
      stickyTravel: 1,
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      appliedX: Number.NaN,
      appliedY: Number.NaN,
    }));

    const staticSceneQuery = window.matchMedia(ABOUT_STATIC_SCENE_QUERY);
    const reducedMotionQuery = window.matchMedia(ABOUT_REDUCED_MOTION_QUERY);
    const loadedFrames = new Set<number>();
    const pendingFrameLoads = new Map<number, Promise<boolean>>();

    let frameSources: string[] = [];
    let currentVariant: "desktop" | "mobile" | "" = "";
    let targetProgress = 0;
    let renderedProgress = 0;
    let currentFrameIndex = -1;
    let hasInitialFrame = false;
    let animationFrameId = 0;
    let targetsFrameId = 0;
    let initialCloudSettleFrame = 0;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let backgroundPreloadToken = 0;
    let backgroundPreloadCursor = 0;
    let backgroundPreloadInFlight = 0;
    let backgroundPreloadOrder: number[] = [];

    const useStaticScene = () => staticSceneQuery.matches || reducedMotionQuery.matches;
    const getCurrentFrameVariant = (): "desktop" | "mobile" => {
      if (reducedMotionQuery.matches) return "desktop";
      return staticSceneQuery.matches ? "mobile" : "desktop";
    };

    const ensureFirstFrameReadyClass = () => {
      if (hasInitialFrame) return;
      storyFrame.addEventListener(
        "load",
        () => {
          hasInitialFrame = true;
          storyFrame.classList.add("is-ready");
        },
        { once: true },
      );
    };

    const loadFrameAtIndex = (index: number, priority: "high" | "low" = "low") => {
      if (index < 0 || index >= ABOUT_TOTAL_FRAMES) return Promise.resolve(false);
      if (loadedFrames.has(index)) return Promise.resolve(true);

      const pending = pendingFrameLoads.get(index);
      if (pending) return pending;

      const image = new Image() as HTMLImageElement & { fetchPriority?: string };
      image.decoding = "async";
      image.fetchPriority = priority;
      image.loading = "eager";

      const loadPromise = new Promise<boolean>((resolve) => {
        image.addEventListener(
          "load",
          () => {
            loadedFrames.add(index);
            pendingFrameLoads.delete(index);
            resolve(true);
          },
          { once: true },
        );
        image.addEventListener(
          "error",
          () => {
            pendingFrameLoads.delete(index);
            resolve(false);
          },
          { once: true },
        );
      });

      image.src = frameSources[index] ?? "";
      pendingFrameLoads.set(index, loadPromise);
      return loadPromise;
    };

    const preloadBufferWindow = (centerIndex: number) => {
      const start = Math.max(centerIndex - ABOUT_PRELOAD_BUFFER, 0);
      const end = Math.min(centerIndex + ABOUT_PRELOAD_BUFFER, ABOUT_TOTAL_FRAMES - 1);
      for (let index = start; index <= end; index += 1) {
        const distance = Math.abs(index - centerIndex);
        loadFrameAtIndex(index, distance <= ABOUT_PRELOAD_EAGER_RADIUS ? "high" : "low");
      }
    };

    const setFrame = (index: number) => {
      if (index === currentFrameIndex) return;
      currentFrameIndex = index;
      ensureFirstFrameReadyClass();
      storyFrame.src = frameSources[index] ?? "";
      loadFrameAtIndex(index, "high");
      preloadBufferWindow(index);
    };

    const setStaticFallbackFrame = () => {
      currentVariant = reducedMotionQuery.matches ? "desktop" : "mobile";
      currentFrameIndex = -1;
      backgroundPreloadToken += 1;
      ensureFirstFrameReadyClass();
      storyFrame.src = reducedMotionQuery.matches
        ? ABOUT_STATIC_FRAME_DESKTOP
        : ABOUT_STATIC_FRAME_MOBILE;
    };

    const buildPreloadOrder = (centerIndex: number) => {
      const order: number[] = [];
      const seen = new Set<number>();
      for (let offset = 0; offset < ABOUT_TOTAL_FRAMES; offset += 1) {
        const leftIndex = centerIndex - offset;
        const rightIndex = centerIndex + offset;
        if (leftIndex >= 0 && !seen.has(leftIndex)) {
          seen.add(leftIndex);
          order.push(leftIndex);
        }
        if (rightIndex < ABOUT_TOTAL_FRAMES && !seen.has(rightIndex)) {
          seen.add(rightIndex);
          order.push(rightIndex);
        }
      }
      return order;
    };

    const pumpBackgroundPreload = (token: number) => {
      if (token !== backgroundPreloadToken || useStaticScene()) return;

      while (
        backgroundPreloadInFlight < ABOUT_BACKGROUND_PRELOAD_CONCURRENCY &&
        backgroundPreloadCursor < backgroundPreloadOrder.length
      ) {
        const nextIndex = backgroundPreloadOrder[backgroundPreloadCursor];
        backgroundPreloadCursor += 1;

        if (loadedFrames.has(nextIndex) || pendingFrameLoads.has(nextIndex)) {
          continue;
        }

        backgroundPreloadInFlight += 1;
        loadFrameAtIndex(nextIndex, "low").finally(() => {
          if (token !== backgroundPreloadToken) return;
          backgroundPreloadInFlight -= 1;
          pumpBackgroundPreload(token);
        });
      }
    };

    const scheduleBackgroundPreload = (centerIndex: number) => {
      if (useStaticScene()) return;
      backgroundPreloadToken += 1;
      backgroundPreloadCursor = 0;
      backgroundPreloadInFlight = 0;
      backgroundPreloadOrder = buildPreloadOrder(centerIndex);
      pumpBackgroundPreload(backgroundPreloadToken);
    };

    const syncFrameVariant = (forceReset = false) => {
      if (useStaticScene()) return;
      const nextVariant: "desktop" = "desktop";
      if (!forceReset && currentVariant === nextVariant) return;
      currentVariant = nextVariant;
      frameSources = createFrameSources(nextVariant);
      loadedFrames.clear();
      pendingFrameLoads.clear();
      currentFrameIndex = -1;
      setFrame(getFrameIndex(renderedProgress));
    };

    const refreshPairMetrics = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      storyPairStates.forEach((state) => {
        const step = state.pairStep || state.pair;
        const stepRect = step.getBoundingClientRect();
        state.stepTop = stepRect.top + scrollTop;
        state.stickyTravel = Math.max(stepRect.height - window.innerHeight, 1);
      });
    };

    const updateTargets = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      targetProgress = mapSceneProgress(scrollTop / maxScroll);

      storyPairStates.forEach((state) => {
        const stepTopInViewport = state.stepTop - scrollTop;
        const pairYProgress = clamp(-stepTopInViewport / state.stickyTravel, 0, 1);
        state.targetY = pairYProgress;
        state.targetX = getPairProgress(pairYProgress);
      });
    };

    const applyCloudTransforms = (progress: number) => {
      const cloud = getCloudMotionState(progress, viewportWidth, viewportHeight);
      leftCloud.style.transform = `translate3d(${cloud.leftX}px, ${cloud.leftY}px, 0) scale(${cloud.leftScale})`;
      rightCloud.style.transform = `translate3d(${cloud.rightX}px, ${cloud.rightY}px, 0) scale(${cloud.rightScale})`;
    };

    const writeMotionVarsSnapshot = (progress: number) => {
      const cloud = getCloudMotionState(progress, viewportWidth, viewportHeight);
      const frameSrc =
        reducedMotionQuery.matches
          ? ABOUT_STATIC_FRAME_DESKTOP
          : staticSceneQuery.matches
            ? ABOUT_STATIC_FRAME_MOBILE
            : getFrameSrcByProgress(progress, getCurrentFrameVariant());
      writeAboutMotionVarsStyle({
        cloudLeftX: `${cloud.leftX.toFixed(3)}px`,
        cloudLeftY: `${cloud.leftY.toFixed(3)}px`,
        cloudLeftScale: cloud.leftScale.toFixed(6),
        cloudRightX: `${cloud.rightX.toFixed(3)}px`,
        cloudRightY: `${cloud.rightY.toFixed(3)}px`,
        cloudRightScale: cloud.rightScale.toFixed(6),
        frameSrc,
        pairs: storyPairStates.map((state) => ({
          index: state.pairIndex,
          progress: state.currentX.toFixed(4),
          yProgress: state.currentY.toFixed(4),
        })),
      });
    };

    const render = () => {
      animationFrameId = 0;
      renderedProgress += (targetProgress - renderedProgress) * ABOUT_LERP_FACTOR;
      if (
        Math.abs(targetProgress - renderedProgress) < ABOUT_MOTION_RENDER_EPSILON
      ) {
        renderedProgress = targetProgress;
      }

      setFrame(getFrameIndex(renderedProgress));

      storyPairStates.forEach((state) => {
        state.currentX += (state.targetX - state.currentX) * ABOUT_LERP_FACTOR;
        state.currentY += (state.targetY - state.currentY) * ABOUT_LERP_FACTOR;

        if (Math.abs(state.targetX - state.currentX) < ABOUT_MOTION_RENDER_EPSILON) {
          state.currentX = state.targetX;
        }
        if (Math.abs(state.targetY - state.currentY) < ABOUT_MOTION_RENDER_EPSILON) {
          state.currentY = state.targetY;
        }

        if (
          Number.isNaN(state.appliedX) ||
          Math.abs(state.currentX - state.appliedX) >= ABOUT_MOTION_RENDER_EPSILON
        ) {
          state.pair.style.setProperty("--pair-progress", state.currentX.toFixed(4));
          state.appliedX = state.currentX;
        }
        if (
          Number.isNaN(state.appliedY) ||
          Math.abs(state.currentY - state.appliedY) >= ABOUT_MOTION_RENDER_EPSILON
        ) {
          state.pair.style.setProperty("--pair-y-progress", state.currentY.toFixed(4));
          state.appliedY = state.currentY;
        }
      });

      applyCloudTransforms(renderedProgress);

      const progressSettled =
        Math.abs(targetProgress - renderedProgress) < ABOUT_MOTION_RENDER_EPSILON;
      const pairsSettled = storyPairStates.every(
        (state) =>
          Math.abs(state.targetX - state.currentX) < ABOUT_MOTION_RENDER_EPSILON &&
          Math.abs(state.targetY - state.currentY) < ABOUT_MOTION_RENDER_EPSILON,
      );

      if (!progressSettled || !pairsSettled) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const ensureRenderLoop = () => {
      if (useStaticScene() || animationFrameId) return;
      animationFrameId = requestAnimationFrame(render);
    };

    const scheduleTargetsUpdate = () => {
      if (targetsFrameId) return;
      targetsFrameId = requestAnimationFrame(() => {
        targetsFrameId = 0;
        updateTargets();
        ensureRenderLoop();
      });
    };

    const handleViewportUpdate = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      refreshPairMetrics();
      updateTargets();
      ensureRenderLoop();
    };

    const startSequence = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      if (targetsFrameId) {
        cancelAnimationFrame(targetsFrameId);
        targetsFrameId = 0;
      }

      handleViewportUpdate();
      renderedProgress = targetProgress;

      storyPairStates.forEach((state) => {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        state.appliedX = state.currentX;
        state.appliedY = state.currentY;
        state.pair.style.setProperty("--pair-progress", state.currentX.toFixed(4));
        state.pair.style.setProperty("--pair-y-progress", state.currentY.toFixed(4));
      });

      applyCloudTransforms(renderedProgress);
      writeMotionVarsSnapshot(renderedProgress);

      if (useStaticScene()) {
        setStaticFallbackFrame();
        ensureAboutRevealStyle();
        return;
      }

      syncFrameVariant(true);
      const initialFrameIndex = getFrameIndex(renderedProgress);
      setFrame(initialFrameIndex);
      scheduleBackgroundPreload(initialFrameIndex);
      ensureAboutRevealStyle();
    };

    const settleInitialCloudPosition = () => {
      if (initialCloudSettleFrame) {
        cancelAnimationFrame(initialCloudSettleFrame);
        initialCloudSettleFrame = 0;
      }

      let frames = 0;
      let stableFrames = 0;
      let lastScroll = -1;
      const needsCompleteLoad = document.readyState !== "complete";

      const tick = () => {
        handleViewportUpdate();
        renderedProgress = targetProgress;

        storyPairStates.forEach((state) => {
          state.currentX = state.targetX;
          state.currentY = state.targetY;
          state.appliedX = state.currentX;
          state.appliedY = state.currentY;
          state.pair.style.setProperty("--pair-progress", state.currentX.toFixed(4));
          state.pair.style.setProperty("--pair-y-progress", state.currentY.toFixed(4));
        });

        applyCloudTransforms(renderedProgress);

        const scrollNow = window.scrollY || window.pageYOffset;
        if (Math.abs(scrollNow - lastScroll) < 1) stableFrames += 1;
        else stableFrames = 0;

        lastScroll = scrollNow;
        frames += 1;

        const loadSettled = !needsCompleteLoad || document.readyState === "complete";
        const enoughFrames = frames >= 90;
        const stableEnough = stableFrames >= 8;

        if (!(loadSettled && stableEnough) && !enoughFrames) {
          initialCloudSettleFrame = requestAnimationFrame(tick);
          return;
        }

        initialCloudSettleFrame = 0;
        ensureRenderLoop();
      };

      initialCloudSettleFrame = requestAnimationFrame(tick);
    };

    const onStaticSceneChange = () => startSequence();
    const onReducedMotionChange = () => startSequence();
    const onPageShow = () => settleInitialCloudPosition();

    staticSceneQuery.addEventListener("change", onStaticSceneChange);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    window.addEventListener("scroll", scheduleTargetsUpdate, { passive: true });
    window.addEventListener("resize", handleViewportUpdate, { passive: true });
    window.addEventListener("pageshow", onPageShow);

    startSequence();
    settleInitialCloudPosition();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (targetsFrameId) cancelAnimationFrame(targetsFrameId);
      if (initialCloudSettleFrame) cancelAnimationFrame(initialCloudSettleFrame);

      staticSceneQuery.removeEventListener("change", onStaticSceneChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      window.removeEventListener("scroll", scheduleTargetsUpdate);
      window.removeEventListener("resize", handleViewportUpdate);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
