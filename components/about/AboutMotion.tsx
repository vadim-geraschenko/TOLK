"use client";

import { useLayoutEffect } from "react";
import {
  ABOUT_BACKGROUND_PRELOAD_CONCURRENCY,
  ABOUT_BOOT_EAGER_RADIUS,
  ABOUT_BOOT_MAX_WAIT_MS,
  ABOUT_LERP_FACTOR,
  ABOUT_MOBILE_STACK_CARD_GAP,
  ABOUT_MOBILE_STACK_EXIT_GAP,
  ABOUT_MOBILE_STACK_CARD_PEEK,
  ABOUT_MOBILE_STACK_QUERY,
  ABOUT_MOBILE_STACK_SAFE_TOP,
  ABOUT_MOTION_RENDER_EPSILON,
  ABOUT_PRELOAD_BUFFER,
  ABOUT_PRELOAD_EAGER_RADIUS,
  ABOUT_REDUCED_MOTION_QUERY,
  ABOUT_SELECTOR_MOBILE_STACK_ITEM,
  ABOUT_SELECTOR_MOBILE_STACK_SCENE,
  ABOUT_SELECTOR_PAIR,
  ABOUT_SELECTOR_ROOT,
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

type AboutMotionWindow = Window & {
  __TOLK_VISUAL_CAPTURE__?: boolean;
};

type MobileStackSceneState = {
  scene: HTMLElement;
  items: HTMLElement[];
  top: number;
  height: number;
  stageHeight: number;
  travel: number;
  appliedProgress: number;
};

const SITE_HEADER_OFFSET_CHANGE_EVENT = "tolk:site-header-offset-change";
const SITE_HEADER_STACK_SETTLE_MS = 220;

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
    const mobileStackQuery = window.matchMedia(ABOUT_MOBILE_STACK_QUERY);
    const isVisualCapture = Boolean(
      (window as AboutMotionWindow).__TOLK_VISUAL_CAPTURE__,
    );
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
    let backgroundPreloadDelayId = 0;
    let backgroundPreloadIdleId = 0;
    let bootOverlayHideId = 0;
    let mobileStackFrameId = 0;
    let mobileStackSettleFrameId = 0;
    let mobileStackSafeTop = ABOUT_MOBILE_STACK_SAFE_TOP;
    let mobileStackScenes: MobileStackSceneState[] = [];

    const useStaticScene = () => staticSceneQuery.matches || reducedMotionQuery.matches;
    const useMobileStackScenes = () =>
      mobileStackQuery.matches && !reducedMotionQuery.matches;
    const readMobileStackSafeTop = () => {
      const stackStage = document.querySelector<HTMLElement>(
        `${ABOUT_SELECTOR_MOBILE_STACK_SCENE} .mobile-stack-stage`,
      );
      const stageTop = stackStage
        ? Number.parseFloat(getComputedStyle(stackStage).top)
        : Number.NaN;
      if (Number.isFinite(stageTop)) return stageTop;

      const root = document.querySelector<HTMLElement>(ABOUT_SELECTOR_ROOT);
      if (!root) return ABOUT_MOBILE_STACK_SAFE_TOP;

      const rawValue = getComputedStyle(root).getPropertyValue(
        "--mobile-stack-safe-top",
      );
      const parsed = Number.parseFloat(rawValue);
      return Number.isFinite(parsed) ? parsed : ABOUT_MOBILE_STACK_SAFE_TOP;
    };
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

    const preloadBootFrameWindow = (centerIndex: number) => {
      const start = Math.max(centerIndex - ABOUT_BOOT_EAGER_RADIUS, 0);
      const end = Math.min(centerIndex + ABOUT_BOOT_EAGER_RADIUS, ABOUT_TOTAL_FRAMES - 1);
      const loads: Promise<boolean>[] = [];
      for (let index = start; index <= end; index += 1) {
        loads.push(loadFrameAtIndex(index, "high"));
      }
      return Promise.all(loads);
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

    const runBackgroundPreload = (token: number) => {
      if (token !== backgroundPreloadToken || useStaticScene()) return;
      pumpBackgroundPreload(token);
    };

    const scheduleBackgroundPreload = (centerIndex: number) => {
      if (useStaticScene()) return;
      backgroundPreloadToken += 1;
      backgroundPreloadCursor = 0;
      backgroundPreloadInFlight = 0;
      backgroundPreloadOrder = buildPreloadOrder(centerIndex);
      runBackgroundPreload(backgroundPreloadToken);
    };

    const waitForImageReady = (image: HTMLImageElement | null) => {
      if (!image) return Promise.resolve(false);
      if (image.complete && image.naturalWidth > 0) {
        return image.decode?.().then(
          () => true,
          () => true,
        ) ?? Promise.resolve(true);
      }

      return new Promise<boolean>((resolve) => {
        const done = () => {
          image.decode?.().then(
            () => resolve(true),
            () => resolve(true),
          ) ?? resolve(true);
        };
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", () => resolve(false), { once: true });
      });
    };

    const waitForFontsReady = () => {
      if (!("fonts" in document)) return Promise.resolve();
      return document.fonts.ready.then(
        () => undefined,
        () => undefined,
      );
    };

    const withBootTimeout = <T,>(promise: Promise<T>) =>
      Promise.race([
        promise,
        new Promise<null>((resolve) => {
          bootOverlayHideId = window.setTimeout(() => resolve(null), ABOUT_BOOT_MAX_WAIT_MS);
        }),
      ]).finally(() => {
        if (bootOverlayHideId) {
          window.clearTimeout(bootOverlayHideId);
          bootOverlayHideId = 0;
        }
      });

    const hideBootOverlay = () => {
      const overlay = document.querySelector<HTMLElement>("[data-about-boot-overlay]");
      if (!overlay) return;
      overlay.classList.add("is-hidden");
      window.setTimeout(() => overlay.remove(), 320);
    };

    const settleBootLoading = (initialFrameIndex: number) => {
      const leftCloudImage = leftCloud.querySelector<HTMLImageElement>("img");
      const rightCloudImage = rightCloud.querySelector<HTMLImageElement>("img");
      const staticScene = useStaticScene();
      const criticalFrames = staticScene
        ? Promise.resolve([])
        : isVisualCapture
          ? Promise.resolve([])
          : preloadBootFrameWindow(initialFrameIndex);
      const initialFrameReady = staticScene
        ? waitForImageReady(storyFrame)
        : loadFrameAtIndex(initialFrameIndex, "high").then(() => waitForImageReady(storyFrame));

      void withBootTimeout(
        Promise.all([
          waitForFontsReady(),
          waitForImageReady(leftCloudImage),
          waitForImageReady(rightCloudImage),
          initialFrameReady,
          criticalFrames,
        ]),
      ).then(() => {
        requestAnimationFrame(hideBootOverlay);
      });
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

    const readMobileStackScenes = () => {
      mobileStackScenes = Array.from(
        document.querySelectorAll<HTMLElement>(ABOUT_SELECTOR_MOBILE_STACK_SCENE),
      ).map((scene) => ({
        scene,
        items: Array.from(
          scene.querySelectorAll<HTMLElement>(ABOUT_SELECTOR_MOBILE_STACK_ITEM),
        ),
        top: 0,
        height: 1,
        stageHeight: 1,
        travel: 1,
        appliedProgress: Number.NaN,
      }));
    };

    const refreshMobileStackMetrics = () => {
      if (!useMobileStackScenes()) return;
      mobileStackSafeTop = readMobileStackSafeTop();
      const scrollTop = window.scrollY || window.pageYOffset;
      mobileStackScenes.forEach((state) => {
        const rect = state.scene.getBoundingClientRect();
        state.top = rect.top + scrollTop;
        let cumulativeY = 0;
        let finalStackHeight = 0;

        state.items.forEach((item, index) => {
          const card = item.firstElementChild as HTMLElement | null;
          const cardHeight = card?.getBoundingClientRect().height ?? 0;
          item.dataset.stackHeight = cardHeight.toFixed(3);
          item.dataset.stackStartY = cumulativeY.toFixed(3);
          item.dataset.stackEndY = (index * ABOUT_MOBILE_STACK_CARD_PEEK).toFixed(3);
          finalStackHeight = index * ABOUT_MOBILE_STACK_CARD_PEEK + cardHeight;
          cumulativeY += cardHeight + ABOUT_MOBILE_STACK_CARD_GAP;
        });

        state.stageHeight = Math.max(
          finalStackHeight + ABOUT_MOBILE_STACK_EXIT_GAP,
          360,
        );
        state.scene.style.setProperty(
          "--mobile-stack-stage-height",
          `${state.stageHeight}px`,
        );
        state.height = Math.max(
          state.stageHeight + cumulativeY + 80,
          state.stageHeight,
        );
        state.scene.style.setProperty("--mobile-stack-scene-height", `${state.height}px`);
        state.travel = Math.max(state.height - state.stageHeight, 1);
      });
    };

    const updateMobileStackScenes = () => {
      mobileStackFrameId = 0;
      if (!useMobileStackScenes()) return;

      const nextSafeTop = readMobileStackSafeTop();
      if (Math.abs(nextSafeTop - mobileStackSafeTop) >= 0.5) {
        refreshMobileStackMetrics();
      }

      const scrollTop = window.scrollY || window.pageYOffset;
      mobileStackScenes.forEach((state) => {
        const stickyStart = state.top - mobileStackSafeTop;
        const progress = clamp((scrollTop - stickyStart) / state.travel, 0, 1);
        const segmentCount = Math.max(state.items.length - 1, 1);
        if (
          Number.isNaN(state.appliedProgress) ||
          Math.abs(progress - state.appliedProgress) >= ABOUT_MOTION_RENDER_EPSILON
        ) {
          state.scene.style.setProperty(
            "--mobile-stack-scene-progress",
            progress.toFixed(4),
          );
          state.appliedProgress = progress;
        }
        const itemY = state.items.map((item, index) => {
          const startY = Number.parseFloat(item.dataset.stackStartY ?? "0");
          const endY = Number.parseFloat(item.dataset.stackEndY ?? "0");
          const itemProgress =
            index === 0 ? 1 : clamp(progress * segmentCount - (index - 1), 0, 1);
          return startY + (endY - startY) * itemProgress;
        });

        state.items.forEach((item, index) => {
          const y = itemY[index] ?? 0;
          const nextY = itemY[index + 1];
          const cardHeight = Number.parseFloat(item.dataset.stackHeight ?? "0");

          item.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0)`;
          if (nextY !== undefined && cardHeight > 0 && nextY - y < cardHeight) {
            const visibleHeight = Math.max(
              nextY - y,
              ABOUT_MOBILE_STACK_CARD_PEEK,
            );
            item.style.clipPath = `inset(0 0 ${Math.max(cardHeight - visibleHeight, 0).toFixed(3)}px 0)`;
          } else {
            item.style.clipPath = "";
          }
        });
      });
    };

    const scheduleMobileStackUpdate = () => {
      if (!useMobileStackScenes() || mobileStackFrameId) return;
      mobileStackFrameId = requestAnimationFrame(updateMobileStackScenes);
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
      readMobileStackScenes();
      refreshMobileStackMetrics();
      updateMobileStackScenes();
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
        settleBootLoading(getFrameIndex(renderedProgress));
        return;
      }

      syncFrameVariant(true);
      const initialFrameIndex = getFrameIndex(renderedProgress);
      setFrame(initialFrameIndex);
      if (!isVisualCapture) {
        scheduleBackgroundPreload(initialFrameIndex);
      }
      ensureAboutRevealStyle();
      settleBootLoading(initialFrameIndex);
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
    const onMobileStackChange = () => {
      readMobileStackScenes();
      refreshMobileStackMetrics();
      updateMobileStackScenes();
    };
    const onSiteHeaderOffsetChange = () => {
      if (mobileStackSettleFrameId) {
        cancelAnimationFrame(mobileStackSettleFrameId);
        mobileStackSettleFrameId = 0;
      }

      const startedAt = performance.now();
      const settleStackPosition = () => {
        refreshMobileStackMetrics();
        updateMobileStackScenes();

        if (performance.now() - startedAt < SITE_HEADER_STACK_SETTLE_MS) {
          mobileStackSettleFrameId = requestAnimationFrame(settleStackPosition);
          return;
        }

        mobileStackSettleFrameId = 0;
      };

      mobileStackSettleFrameId = requestAnimationFrame(settleStackPosition);
    };

    staticSceneQuery.addEventListener("change", onStaticSceneChange);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    mobileStackQuery.addEventListener("change", onMobileStackChange);
    window.addEventListener("scroll", scheduleTargetsUpdate, { passive: true });
    window.addEventListener("scroll", scheduleMobileStackUpdate, { passive: true });
    window.addEventListener("resize", handleViewportUpdate, { passive: true });
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener(SITE_HEADER_OFFSET_CHANGE_EVENT, onSiteHeaderOffsetChange);

    startSequence();
    settleInitialCloudPosition();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (targetsFrameId) cancelAnimationFrame(targetsFrameId);
      if (initialCloudSettleFrame) cancelAnimationFrame(initialCloudSettleFrame);
      if (backgroundPreloadDelayId) window.clearTimeout(backgroundPreloadDelayId);
      if (backgroundPreloadIdleId) window.cancelIdleCallback(backgroundPreloadIdleId);
      if (bootOverlayHideId) window.clearTimeout(bootOverlayHideId);
      if (mobileStackFrameId) cancelAnimationFrame(mobileStackFrameId);
      if (mobileStackSettleFrameId) cancelAnimationFrame(mobileStackSettleFrameId);

      staticSceneQuery.removeEventListener("change", onStaticSceneChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      mobileStackQuery.removeEventListener("change", onMobileStackChange);
      window.removeEventListener("scroll", scheduleTargetsUpdate);
      window.removeEventListener("scroll", scheduleMobileStackUpdate);
      window.removeEventListener("resize", handleViewportUpdate);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener(
        SITE_HEADER_OFFSET_CHANGE_EVENT,
        onSiteHeaderOffsetChange,
      );
    };
  }, []);

  return null;
}
