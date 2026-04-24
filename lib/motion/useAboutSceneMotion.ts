"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

const TOTAL_FRAMES = 60;
const DESKTOP_STATIC_FRAME = "/about/angel-sequence/desktop/frame-028.webp";
const MOBILE_STATIC_FRAME = "/about/angel-sequence/mobile/frame-028.webp";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const mix = (from: number, to: number, t: number) => from + (to - from) * t;

const sceneProgressMap = (x: number) => {
  const clamped = clamp(x, 0, 1);
  if (clamped <= 0.84) return (clamped / 0.84) * 0.9;
  return 0.9 + ((clamped - 0.84) / 0.16) * 0.1;
};

const buildFramePath = (variant: "desktop" | "mobile", index: number) => {
  const frameNumber = String(index + 1).padStart(3, "0");
  return `/about/angel-sequence/${variant}/frame-${frameNumber}.webp`;
};

export function useAboutSceneMotion(pairCount: number) {
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLImageElement | null>(null);
  const leftCloudRef = useRef<HTMLDivElement | null>(null);
  const rightCloudRef = useRef<HTMLDivElement | null>(null);
  const pairRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pairStepRefs = useRef<Array<HTMLElement | null>>([]);
  const [frameReady, setFrameReady] = useState(false);

  const setPairRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      pairRefs.current[index] = node;
    },
    [],
  );

  const setPairStepRef = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      pairStepRefs.current[index] = node;
    },
    [],
  );

  useEffect(() => {
    const frameNode = frameRef.current;
    const leftCloud = leftCloudRef.current;
    const rightCloud = rightCloudRef.current;
    if (!frameNode || !leftCloud || !rightCloud) return;

    const isStaticScene = reducedMotion || window.innerWidth <= 1100;
    const staticFrame = reducedMotion
      ? DESKTOP_STATIC_FRAME
      : MOBILE_STATIC_FRAME;

    let animationFrameId = 0;
    let targetsFrameId = 0;
    let targetProgress = 0;
    let renderedProgress = 0;
    let currentFrameIndex = -1;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const pairStates = pairRefs.current.slice(0, pairCount).map((pair, index) => ({
      pair,
      step: pairStepRefs.current[index],
      targetX: 0,
      currentX: 0,
      targetY: 0,
      currentY: 0,
      appliedX: Number.NaN,
      appliedY: Number.NaN,
      stepTop: 0,
      stickyTravel: 1,
    }));

    const refreshMetrics = () => {
      pairStates.forEach((state) => {
        const step = state.step;
        if (!step) return;
        const rect = step.getBoundingClientRect();
        state.stepTop = rect.top + window.scrollY;
        state.stickyTravel = Math.max(rect.height - window.innerHeight, 1);
      });
    };

    const setFrame = (index: number) => {
      if (index === currentFrameIndex) return;
      currentFrameIndex = index;
      frameNode.src = buildFramePath("desktop", index);
    };

    const updateTargets = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );

      targetProgress = sceneProgressMap(scrollTop / maxScroll);

      pairStates.forEach((state) => {
        const stepTopInViewport = state.stepTop - scrollTop;
        const pairYProgress = clamp(
          -stepTopInViewport / state.stickyTravel,
          0,
          1,
        );
        const pairProgress = clamp((pairYProgress - 0.1) / 0.9, 0, 1);
        state.targetX = pairProgress;
        state.targetY = pairYProgress;
      });
    };

    const ensureRenderLoop = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const scheduleTargetsUpdate = () => {
      if (targetsFrameId) return;
      targetsFrameId = requestAnimationFrame(() => {
        targetsFrameId = 0;
        updateTargets();
        ensureRenderLoop();
      });
    };

    const render = () => {
      animationFrameId = 0;
      renderedProgress += (targetProgress - renderedProgress) * 0.12;
      if (Math.abs(targetProgress - renderedProgress) < 0.0008) {
        renderedProgress = targetProgress;
      }

      const nextFrame = Math.round(renderedProgress * (TOTAL_FRAMES - 1));
      setFrame(nextFrame);

      const revealEnd = 0.3;
      const revealInput = clamp(renderedProgress / revealEnd, 0, 1);
      const reveal =
        revealInput < 0.5
          ? 2 * revealInput * revealInput
          : 1 - Math.pow(-2 * revealInput + 2, 2) / 2;

      pairStates.forEach((state) => {
        if (!state.pair) return;
        state.currentX += (state.targetX - state.currentX) * 0.12;
        state.currentY += (state.targetY - state.currentY) * 0.12;

        if (Math.abs(state.targetX - state.currentX) < 0.0008) {
          state.currentX = state.targetX;
        }
        if (Math.abs(state.targetY - state.currentY) < 0.0008) {
          state.currentY = state.targetY;
        }

        if (
          Number.isNaN(state.appliedX) ||
          Math.abs(state.currentX - state.appliedX) >= 0.0008
        ) {
          state.pair.style.setProperty(
            "--pair-progress",
            state.currentX.toFixed(4),
          );
          state.appliedX = state.currentX;
        }

        if (
          Number.isNaN(state.appliedY) ||
          Math.abs(state.currentY - state.appliedY) >= 0.0008
        ) {
          state.pair.style.setProperty(
            "--pair-y-progress",
            state.currentY.toFixed(4),
          );
          state.appliedY = state.currentY;
        }
      });

      const leftX = mix(viewportWidth * 0.28, -viewportWidth * 0.3, reveal);
      const rightX = mix(viewportWidth * 0.27, viewportWidth * 0.8, reveal);
      const leftY = mix(viewportHeight * 0.07, viewportHeight * 0.02, reveal);
      const rightY = mix(viewportHeight * 0.07 + 8, viewportHeight * 0.02 - 4, reveal);
      const leftScale = mix(1.42, 1.16, reveal);
      const rightScale = mix(1.4626, 1.1716, reveal);

      leftCloud.style.transform = `translate3d(${leftX}px, ${leftY}px, 0) scale(${leftScale})`;
      rightCloud.style.transform = `translate3d(${rightX}px, ${rightY}px, 0) scale(${rightScale})`;

      const progressSettled =
        Math.abs(targetProgress - renderedProgress) < 0.0008;
      const pairsSettled = pairStates.every(
        (state) =>
          Math.abs(state.targetX - state.currentX) < 0.0008 &&
          Math.abs(state.targetY - state.currentY) < 0.0008,
      );

      if (!progressSettled || !pairsSettled) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleViewportUpdate = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      refreshMetrics();
      updateTargets();
      ensureRenderLoop();
    };

    setFrameReady(false);

    if (isStaticScene) {
      frameNode.src = staticFrame;
      setFrameReady(true);
      pairStates.forEach((state) => {
        state.pair?.style.setProperty("--pair-progress", "0");
        state.pair?.style.setProperty("--pair-y-progress", "0");
      });
      leftCloud.style.transform = "";
      rightCloud.style.transform = "";
      return;
    }

    const handleFrameLoad = () => {
      setFrameReady(true);
    };

    frameNode.addEventListener("load", handleFrameLoad);
    refreshMetrics();
    updateTargets();
    setFrame(Math.round(targetProgress * (TOTAL_FRAMES - 1)));
    ensureRenderLoop();

    window.addEventListener("scroll", scheduleTargetsUpdate, { passive: true });
    window.addEventListener("resize", handleViewportUpdate, { passive: true });

    return () => {
      frameNode.removeEventListener("load", handleFrameLoad);
      window.removeEventListener("scroll", scheduleTargetsUpdate);
      window.removeEventListener("resize", handleViewportUpdate);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (targetsFrameId) cancelAnimationFrame(targetsFrameId);
    };
  }, [pairCount, reducedMotion]);

  return {
    frameRef,
    leftCloudRef,
    rightCloudRef,
    setPairRef,
    setPairStepRef,
    frameReady,
    reducedMotion,
  };
}
