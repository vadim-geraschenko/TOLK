import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "TOLK",
  description: "Библия для всех: разговоры о вечном и личном",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script id="about-preinit-motion" strategy="beforeInteractive">
          {`(function () {
  if (window.location.pathname !== "/about") return;

  var clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
  };
  var mix = function (from, to, t) {
    return from + (to - from) * t;
  };
  var sceneProgressMap = function (x) {
    var clamped = clamp(x, 0, 1);
    if (clamped <= 0.84) return (clamped / 0.84) * 0.9;
    return 0.9 + ((clamped - 0.84) / 0.16) * 0.1;
  };

  var styleId = "__about-preinit-vars";
  var revealStyleId = "__about-reveal";
  var ensureStyleEl = function () {
    var styleEl = document.getElementById(styleId);
    if (styleEl) return styleEl;
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
    return styleEl;
  };
  var ensureRevealStyleEl = function () {
    var styleEl = document.getElementById(revealStyleId);
    if (styleEl) return styleEl;
    styleEl = document.createElement("style");
    styleEl.id = revealStyleId;
    styleEl.textContent =
      "[data-about-reveal-target]{visibility:visible !important;opacity:1 !important;transition:opacity 180ms ease;}";
    document.head.appendChild(styleEl);
    return styleEl;
  };

  var pairVars = {
    "--about-pair-0-progress": "0",
    "--about-pair-0-y": "0",
    "--about-pair-1-progress": "0",
    "--about-pair-1-y": "0",
    "--about-pair-2-progress": "0",
    "--about-pair-2-y": "0",
    "--about-frame-src": 'url("/about/assets/angel-sequence/desktop/frame-028.webp")'
  };

  var computePairVars = function (pairs, scrollTop) {
    var hasGeometryForAllPairs = true;
    for (var i = 0; i < pairs.length; i += 1) {
      var pair = pairs[i];
      var step = pair.closest("[data-story-step]");
      if (!step) {
        hasGeometryForAllPairs = false;
        continue;
      }

      var stepRect = step.getBoundingClientRect();
      var stickyTravel = Math.max(stepRect.height - window.innerHeight, 1);
      var stepTop = stepRect.top + scrollTop;
      var stepTopInViewport = stepTop - scrollTop;
      var pairYProgress = clamp(-stepTopInViewport / stickyTravel, 0, 1);

      var spreadStart = 0.1;
      var spreadEnd = 1;
      var pairProgress = clamp(
        (pairYProgress - spreadStart) / Math.max(spreadEnd - spreadStart, 0.001),
        0,
        1
      );

      pairVars["--about-pair-" + i + "-y"] = pairYProgress.toFixed(4);
      pairVars["--about-pair-" + i + "-progress"] = pairProgress.toFixed(4);
    }
    return hasGeometryForAllPairs;
  };

  var computeFrameSrc = function (progress) {
    var frameIndex = Math.round(progress * 59) + 1;
    var frameNumber = String(frameIndex).padStart(3, "0");
    return '/about/assets/angel-sequence/desktop/frame-' + frameNumber + '.webp';
  };

  var apply = function () {
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    var targetProgress = sceneProgressMap(scrollTop / maxScroll);
    var revealEnd = 0.3;
    var revealInput = clamp(targetProgress / revealEnd, 0, 1);
    var reveal =
      revealInput < 0.5
        ? 2 * revealInput * revealInput
        : 1 - Math.pow(-2 * revealInput + 2, 2) / 2;

    var width = window.innerWidth;
    var height = window.innerHeight;
    var leftX = mix(width * 0.28, -width * 0.3, reveal);
    var rightX = mix(width * 0.27, width * 0.8, reveal);
    var leftY = mix(height * 0.07, height * 0.02, reveal);
    var rightY = mix(height * 0.07 + 8, height * 0.02 - 4, reveal);
    var leftScale = mix(1.42, 1.16, reveal);
    var rightScale = mix(1.42 * 1.03, 1.16 * 1.01, reveal);

    pairVars["--about-cloud-left-x"] = leftX.toFixed(3) + "px";
    pairVars["--about-cloud-left-y"] = leftY.toFixed(3) + "px";
    pairVars["--about-cloud-left-scale"] = leftScale.toFixed(6);
    pairVars["--about-cloud-right-x"] = rightX.toFixed(3) + "px";
    pairVars["--about-cloud-right-y"] = rightY.toFixed(3) + "px";
    pairVars["--about-cloud-right-scale"] = rightScale.toFixed(6);
    pairVars["--about-frame-src"] = 'url("' + computeFrameSrc(targetProgress) + '")';

    var aboutRoot = document.querySelector("[data-about-root]");
    var frame = document.querySelector("[data-about-frame]");
    var clouds = document.querySelectorAll("[data-about-cloud]");
    var pairs = document.querySelectorAll("[data-about-pair]");
    var pairsWithGeometry = false;
    if (pairs.length) {
      pairsWithGeometry = computePairVars(pairs, scrollTop);
    }

    var css = ":root{";
    for (var key in pairVars) {
      if (!Object.prototype.hasOwnProperty.call(pairVars, key)) continue;
      css += key + ":" + pairVars[key] + ";";
    }
    css += "}";
    ensureStyleEl().textContent = css;
    return {
      targetProgress: targetProgress,
      frame: frame,
      hasAllNodes:
        !!aboutRoot && !!frame && clouds.length >= 2 && pairs.length > 0,
      pairsWithGeometry: pairsWithGeometry,
    };
  };

  var frames = 0;
  var didReveal = false;
  var tryReveal = function (state) {
    if (didReveal) return;
    if (!state.hasAllNodes || !state.pairsWithGeometry) return;
    var frame = state.frame;
    if (!frame) return;

    var desiredSrc = computeFrameSrc(state.targetProgress);
    if (frame.getAttribute("src") !== desiredSrc) {
      frame.setAttribute("src", desiredSrc);
    }
    ensureRevealStyleEl();
    didReveal = true;
  };

  var runTick = function () {
    if (didReveal) return;
    var state = apply();
    tryReveal(state);
    frames += 1;
    if (!didReveal && frames < 150) requestAnimationFrame(runTick);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      requestAnimationFrame(runTick);
    }, { once: true });
  }
  var tick = function () {
    runTick();
  };
  requestAnimationFrame(tick);
})();`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Source+Sans+3:wght@500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
