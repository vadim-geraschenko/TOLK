"use client";

import { useLayoutEffect } from "react";

type StoryPairState = {
  pair: HTMLElement;
  pairStep: HTMLElement | null;
  stepTop: number;
  stepHeight: number;
  stickyTravel: number;
  targetX: number;
  currentX: number;
  targetY: number;
  currentY: number;
  appliedX: number;
  appliedY: number;
};

const totalFrames = 60;
const preloadBuffer = 6;
const eagerPreloadRadius = 10;
const backgroundPreloadConcurrency = 4;
const mobileStaticFrame = "/about/assets/angel-sequence/mobile/frame-028.webp";
const desktopStaticFrame = "/about/assets/angel-sequence/desktop/frame-028.webp";
const renderEpsilon = 0.0008;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const mix = (from: number, to: number, t: number) => from + (to - from) * t;

const sceneProgressMap = (x: number) => {
  const clamped = clamp(x, 0, 1);

  if (clamped <= 0.84) {
    return (clamped / 0.84) * 0.9;
  }

  return 0.9 + ((clamped - 0.84) / 0.16) * 0.1;
};

export function AboutMotion() {
  useLayoutEffect(() => {
    const ensureRevealStyle = () => {
      let styleEl = document.getElementById("__about-reveal") as HTMLStyleElement | null;
      if (styleEl) return styleEl;
      styleEl = document.createElement("style");
      styleEl.id = "__about-reveal";
      styleEl.textContent =
        "[data-about-reveal-target]{visibility:visible !important;opacity:1 !important;transition:opacity 180ms ease;}";
      document.head.appendChild(styleEl);
      return styleEl;
    };

    const storyFrame = document.getElementById("story-frame") as HTMLImageElement | null;
    const leftCloud = document.getElementById("cloud-left") as HTMLElement | null;
    const rightCloud = document.getElementById("cloud-right") as HTMLElement | null;

    if (!storyFrame || !leftCloud || !rightCloud) {
      return;
    }

    const storyPairs = Array.from(document.querySelectorAll<HTMLElement>("[data-pair]"));
    const storyPairStates: StoryPairState[] = storyPairs.map((pair) => ({
      pair,
      pairStep: pair.closest("[data-story-step]"),
      stepTop: 0,
      stepHeight: 0,
      stickyTravel: 1,
      targetX: 0,
      currentX: 0,
      targetY: 0,
      currentY: 0,
      appliedX: Number.NaN,
      appliedY: Number.NaN,
    }));

    const staticSceneQuery = window.matchMedia("(max-width: 1100px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const loadedFrames = new Set<number>();
    const pendingFrameLoads = new Map<number, Promise<boolean>>();

    const useStaticScene = () =>
      staticSceneQuery.matches || reducedMotionQuery.matches;

    let frameSources: string[] = [];
    let currentVariant = "";
    let targetProgress = 0;
    let renderedProgress = 0;
    let currentFrameIndex = -1;
    let hasInitialFrame = false;
    let animationFrameId = 0;
    let targetsFrameId = 0;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let backgroundPreloadToken = 0;
    let backgroundPreloadCursor = 0;
    let backgroundPreloadInFlight = 0;
    let backgroundPreloadOrder: number[] = [];
    let initialCloudSettleFrame = 0;

    const writePreinitVarsSnapshot = (
      progress: number,
      leftX: number,
      leftY: number,
      leftScale: number,
      rightX: number,
      rightY: number,
      rightScale: number,
    ) => {
      let styleEl = document.getElementById("__about-preinit-vars") as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "__about-preinit-vars";
        document.head.appendChild(styleEl);
      }
      const frameIndex = Math.round(progress * (totalFrames - 1)) + 1;
      const frameNumber = String(frameIndex).padStart(3, "0");
      const frameSrc = `/about/assets/angel-sequence/desktop/frame-${frameNumber}.webp`;
      const css = [
        ":root{",
        `--about-cloud-left-x:${leftX.toFixed(3)}px;`,
        `--about-cloud-left-y:${leftY.toFixed(3)}px;`,
        `--about-cloud-left-scale:${leftScale.toFixed(6)};`,
        `--about-cloud-right-x:${rightX.toFixed(3)}px;`,
        `--about-cloud-right-y:${rightY.toFixed(3)}px;`,
        `--about-cloud-right-scale:${rightScale.toFixed(6)};`,
        `--about-frame-src:url("${frameSrc}");`,
        ...storyPairStates.flatMap((state, index) => [
          `--about-pair-${index}-progress:${state.currentX.toFixed(4)};`,
          `--about-pair-${index}-y:${state.currentY.toFixed(4)};`,
        ]),
        "}",
      ].join("");
      styleEl.textContent = css;
    };

    const buildFrameSources = (variant: string) =>
      Array.from({ length: totalFrames }, (_, index) => {
        const frameNumber = String(index + 1).padStart(3, "0");
        return `/about/assets/angel-sequence/${variant}/frame-${frameNumber}.webp`;
      });

    const loadFrameAtIndex = (index: number, priority: "high" | "low" = "low") => {
      if (index < 0 || index >= totalFrames) return Promise.resolve(false);
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
      const start = Math.max(centerIndex - preloadBuffer, 0);
      const end = Math.min(centerIndex + preloadBuffer, totalFrames - 1);

      for (let index = start; index <= end; index += 1) {
        const distance = Math.abs(index - centerIndex);
        loadFrameAtIndex(index, distance <= eagerPreloadRadius ? "high" : "low");
      }
    };

    const buildPreloadOrder = (centerIndex: number) => {
      const order: number[] = [];
      const seen = new Set<number>();

      for (let offset = 0; offset < totalFrames; offset += 1) {
        const leftIndex = centerIndex - offset;
        const rightIndex = centerIndex + offset;

        if (leftIndex >= 0 && !seen.has(leftIndex)) {
          seen.add(leftIndex);
          order.push(leftIndex);
        }

        if (rightIndex < totalFrames && !seen.has(rightIndex)) {
          seen.add(rightIndex);
          order.push(rightIndex);
        }
      }

      return order;
    };

    const pumpBackgroundPreload = (token: number) => {
      if (token !== backgroundPreloadToken || useStaticScene()) return;

      while (
        backgroundPreloadInFlight < backgroundPreloadConcurrency &&
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

    const setFrame = (index: number) => {
      if (index === currentFrameIndex) return;
      currentFrameIndex = index;

      if (!hasInitialFrame) {
        storyFrame.addEventListener(
          "load",
          () => {
            hasInitialFrame = true;
            storyFrame.classList.add("is-ready");
          },
          { once: true },
        );
      }

      storyFrame.src = frameSources[index] ?? "";
      loadFrameAtIndex(index, "high");
      preloadBufferWindow(index);
    };

    const syncVariant = (forceReset = false) => {
      if (useStaticScene()) return;

      const nextVariant = "desktop";
      if (!forceReset && nextVariant === currentVariant) return;

      currentVariant = nextVariant;
      frameSources = buildFrameSources(currentVariant);
      loadedFrames.clear();
      pendingFrameLoads.clear();
      currentFrameIndex = -1;
      setFrame(Math.max(Math.round(renderedProgress * (totalFrames - 1)), 0));
    };

    const setStaticFallbackFrame = () => {
      currentVariant = reducedMotionQuery.matches ? "desktop" : "mobile";
      currentFrameIndex = -1;
      backgroundPreloadToken += 1;

      if (!hasInitialFrame) {
        storyFrame.addEventListener(
          "load",
          () => {
            hasInitialFrame = true;
            storyFrame.classList.add("is-ready");
          },
          { once: true },
        );
      }

      storyFrame.src = reducedMotionQuery.matches
        ? desktopStaticFrame
        : mobileStaticFrame;
    };

    const refreshStoryPairMetrics = () => {
      storyPairStates.forEach((state) => {
        const step = state.pairStep || state.pair;
        const stepRect = step.getBoundingClientRect();
        state.stepTop = stepRect.top + (window.scrollY || window.pageYOffset);
        state.stepHeight = stepRect.height;
        state.stickyTravel = Math.max(stepRect.height - window.innerHeight, 1);
      });
    };

    const updateTargets = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

      targetProgress = sceneProgressMap(scrollTop / maxScroll);

      storyPairStates.forEach((state) => {
        const stepTopInViewport = state.stepTop - scrollTop;
        const pairYProgress = clamp(-stepTopInViewport / state.stickyTravel, 0, 1);
        const spreadStart = 0.1;
        const spreadEnd = 1;
        const pairProgress = clamp(
          (pairYProgress - spreadStart) / Math.max(spreadEnd - spreadStart, 0.001),
          0,
          1,
        );

        state.targetY = pairYProgress;
        state.targetX = pairProgress;
      });
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
      refreshStoryPairMetrics();
      updateTargets();
      ensureRenderLoop();
    };

    const applyCloudTransforms = (progress: number) => {
      const revealEnd = 0.3;
      const revealInput = clamp(progress / revealEnd, 0, 1);
      const reveal =
        revealInput < 0.5
          ? 2 * revealInput * revealInput
          : 1 - Math.pow(-2 * revealInput + 2, 2) / 2;

      const width = viewportWidth;
      const height = viewportHeight;
      const leftStartX = width * 0.28;
      const leftEndX = -width * 0.3;
      const rightStartX = width * 0.27;
      const rightEndX = width * 0.8;
      const startY = height * 0.07;
      const endY = height * 0.02;
      const startScale = 1.42;
      const endScale = 1.16;

      const leftX = mix(leftStartX, leftEndX, reveal);
      const rightX = mix(rightStartX, rightEndX, reveal);
      const leftY = mix(startY, endY, reveal);
      const rightY = mix(startY + 8, endY - 4, reveal);
      const leftScale = mix(startScale, endScale, reveal);
      const rightScale = mix(startScale * 1.03, endScale * 1.01, reveal);

      leftCloud.style.transform = `translate3d(${leftX}px, ${leftY}px, 0) scale(${leftScale})`;
      rightCloud.style.transform = `translate3d(${rightX}px, ${rightY}px, 0) scale(${rightScale})`;
    };

    const render = () => {
      animationFrameId = 0;
      renderedProgress += (targetProgress - renderedProgress) * 0.12;

      if (Math.abs(targetProgress - renderedProgress) < renderEpsilon) {
        renderedProgress = targetProgress;
      }

      const nextFrame = Math.round(renderedProgress * (totalFrames - 1));
      setFrame(nextFrame);

      storyPairStates.forEach((state) => {
        state.currentX += (state.targetX - state.currentX) * 0.12;
        state.currentY += (state.targetY - state.currentY) * 0.12;

        if (Math.abs(state.targetX - state.currentX) < renderEpsilon) {
          state.currentX = state.targetX;
        }

        if (Math.abs(state.targetY - state.currentY) < renderEpsilon) {
          state.currentY = state.targetY;
        }

        if (
          Number.isNaN(state.appliedX) ||
          Math.abs(state.currentX - state.appliedX) >= renderEpsilon
        ) {
          state.pair.style.setProperty("--pair-progress", state.currentX.toFixed(4));
          state.appliedX = state.currentX;
        }

        if (
          Number.isNaN(state.appliedY) ||
          Math.abs(state.currentY - state.appliedY) >= renderEpsilon
        ) {
          state.pair.style.setProperty("--pair-y-progress", state.currentY.toFixed(4));
          state.appliedY = state.currentY;
        }
      });

      applyCloudTransforms(renderedProgress);

      const progressSettled = Math.abs(targetProgress - renderedProgress) < renderEpsilon;
      const pairsSettled = storyPairStates.every(
        (state) =>
          Math.abs(state.targetX - state.currentX) < renderEpsilon &&
          Math.abs(state.targetY - state.currentY) < renderEpsilon,
      );

      if (!progressSettled || !pairsSettled) {
        animationFrameId = requestAnimationFrame(render);
      }
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

      // Snap initial visual state to restored scroll position before smooth lerp starts.
      storyPairStates.forEach((state) => {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        state.appliedX = state.currentX;
        state.appliedY = state.currentY;
        state.pair.style.setProperty("--pair-progress", state.currentX.toFixed(4));
        state.pair.style.setProperty("--pair-y-progress", state.currentY.toFixed(4));
      });
      applyCloudTransforms(renderedProgress);
      {
        const revealEnd = 0.3;
        const revealInput = clamp(renderedProgress / revealEnd, 0, 1);
        const reveal =
          revealInput < 0.5
            ? 2 * revealInput * revealInput
            : 1 - Math.pow(-2 * revealInput + 2, 2) / 2;
        const leftX = mix(viewportWidth * 0.28, -viewportWidth * 0.3, reveal);
        const rightX = mix(viewportWidth * 0.27, viewportWidth * 0.8, reveal);
        const leftY = mix(viewportHeight * 0.07, viewportHeight * 0.02, reveal);
        const rightY = mix(viewportHeight * 0.07 + 8, viewportHeight * 0.02 - 4, reveal);
        const leftScale = mix(1.42, 1.16, reveal);
        const rightScale = mix(1.42 * 1.03, 1.16 * 1.01, reveal);
        writePreinitVarsSnapshot(
          renderedProgress,
          leftX,
          leftY,
          leftScale,
          rightX,
          rightY,
          rightScale,
        );
      }

      if (useStaticScene()) {
        setStaticFallbackFrame();
        ensureRevealStyle();
        return;
      }

      syncVariant(true);
      const initialFrameIndex = Math.round(renderedProgress * (totalFrames - 1));
      setFrame(initialFrameIndex);
      scheduleBackgroundPreload(initialFrameIndex);
      ensureRevealStyle();
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
        if (Math.abs(scrollNow - lastScroll) < 1) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
        }
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

    staticSceneQuery.addEventListener("change", onStaticSceneChange);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    window.addEventListener("scroll", scheduleTargetsUpdate, { passive: true });
    window.addEventListener("resize", handleViewportUpdate, { passive: true });
    startSequence();
    settleInitialCloudPosition();

    const onPageShow = () => {
      settleInitialCloudPosition();
    };

    window.addEventListener("pageshow", onPageShow);

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
