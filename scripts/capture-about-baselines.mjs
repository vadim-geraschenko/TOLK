import { chromium, devices } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = process.cwd();
const BASELINES_DIR = path.join(
  REPO_ROOT,
  "docs/design/pages/about/snapshots/baselines",
);

const VIEWPORTS = {
  desktop: {
    name: "1440",
    contextOptions: {
      viewport: { width: 1440, height: 1600 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
    },
  },
  staticDesktop: {
    name: "1100",
    contextOptions: {
      viewport: { width: 1100, height: 1400 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
    },
  },
  mobile: {
    name: "390",
    contextOptions: {
      ...devices["iPhone 12"],
      viewport: { width: 390, height: 844 },
    },
  },
};

const DESKTOP_SCROLL_STATES = [
  { name: "top-viewport", kind: "top" },
  { name: "sequence-early", kind: "scrollFraction", fraction: 0.18 },
  { name: "pair-1-mid", kind: "pairProgress", pairIndex: 0, pairYProgress: 0.55 },
  { name: "pair-2-mid", kind: "pairProgress", pairIndex: 1, pairYProgress: 0.55 },
  {
    name: "reading-method",
    kind: "selector",
    selector: '[data-story-kind="single"] [data-about-story-card]',
  },
  { name: "pair-3-mid", kind: "pairProgress", pairIndex: 2, pairYProgress: 0.58 },
  { name: "voices", kind: "selector", selector: "[data-about-voices-intro]" },
  { name: "audience", kind: "selector", selector: "[data-about-audience-panel]" },
];

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.CAPTURE_BASE_URL || "http://127.0.0.1:3000",
    routePath: process.env.CAPTURE_ABOUT_PATH || "/about/",
  };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--base-url" && argv[i + 1]) {
      args.baseUrl = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--path" && argv[i + 1]) {
      args.routePath = argv[i + 1];
      i += 1;
    }
  }

  return args;
}

async function ensureAboutDataReady(page) {
  try {
    await page.waitForFunction(() => {
      return (
        !!document.querySelector("[data-about-root]") &&
        !!document.querySelector("[data-about-frame]") &&
        document.querySelectorAll("[data-about-pair]").length >= 1 &&
        !!document.querySelector("[data-about-voices-intro]") &&
        !!document.querySelector("[data-about-audience-panel]")
      );
    }, undefined, { timeout: 60_000 });
  } catch (error) {
    const readiness = await page.evaluate(() => ({
      url: window.location.href,
      aboutRoot: Boolean(document.querySelector("[data-about-root]")),
      frame: Boolean(document.querySelector("[data-about-frame]")),
      frameSrc: document
        .querySelector("[data-about-frame]")
        ?.getAttribute("src") ?? null,
      pairs: document.querySelectorAll("[data-about-pair]").length,
      voicesIntro: Boolean(document.querySelector("[data-about-voices-intro]")),
      audiencePanel: Boolean(document.querySelector("[data-about-audience-panel]")),
      revealTargets: document.querySelectorAll("[data-about-reveal-target]").length,
      title: document.title,
      bodyStart: document.body?.innerText?.slice(0, 240) ?? "",
    }));
    console.error("About readiness diagnostics:", readiness);
    throw error;
  }
}

async function waitForRenderReady(page) {
  await page.waitForLoadState("domcontentloaded");

  try {
    await page.waitForLoadState("networkidle", { timeout: 5000 });
  } catch {
    // Dynamic apps or deferred visual layers may keep the page busy.
  }

  await ensureAboutDataReady(page);

  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Continue with fallbacks if webfonts fail.
      }
    }
  });

  try {
    await page.waitForFunction(() => {
      const frame = document.querySelector("[data-about-frame]");
      return !!frame && frame.getAttribute("src");
    }, undefined, { timeout: 10_000 });
  } catch {
    console.warn("About frame src was not ready before capture; continuing.");
  }

  try {
    await page.waitForFunction(() => {
      const frame = document.querySelector("[data-about-frame]");
      return !!frame && frame.classList.contains("is-ready");
    }, undefined, { timeout: 4000 });
  } catch {
    // Current implementation may use another readiness signal.
  }

  await page.waitForTimeout(350);
}

async function preparePageForCapture(page) {
  await page.addStyleTag({
    content: `
      html, body {
        overflow-x: hidden !important;
      }
    `,
  });
}

async function markVisualCapture(page) {
  await page.addInitScript(() => {
    window.__TOLK_VISUAL_CAPTURE__ = true;
  });
}

async function waitForMotionSettle(page) {
  await page.waitForTimeout(1200);
}

async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
}

async function scrollToFraction(page, fraction) {
  await page.evaluate((value) => {
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0,
    );
    window.scrollTo({ top: Math.round(maxScroll * value), behavior: "instant" });
  }, fraction);
}

async function scrollToSelector(page, selector, offset = 96) {
  await page.evaluate(
    ({ targetSelector, targetOffset }) => {
      const node = document.querySelector(targetSelector);
      if (!node) {
        throw new Error(`Selector not found: ${targetSelector}`);
      }

      const rect = node.getBoundingClientRect();
      const top = Math.max(window.scrollY + rect.top - targetOffset, 0);
      window.scrollTo({ top, behavior: "instant" });
    },
    { targetSelector: selector, targetOffset: offset },
  );
}

async function scrollToPairState(page, pairIndex, pairYProgress) {
  await page.evaluate(
    ({ targetPairIndex, targetPairYProgress }) => {
      const pairs = Array.from(document.querySelectorAll("[data-about-pair]"));
      const safePairIndex = Math.min(targetPairIndex, Math.max(pairs.length - 1, 0));
      const pair = pairs[safePairIndex];
      if (!pair) {
        throw new Error(`Pair not found at index ${targetPairIndex}`);
      }

      const step = pair.closest("[data-story-step]");
      if (!step) {
        throw new Error(`Pair step not found at index ${targetPairIndex}`);
      }

      const rect = step.getBoundingClientRect();
      const stepTop = rect.top + window.scrollY;
      const stickyTravel = Math.max(rect.height - window.innerHeight, 1);
      const top = Math.round(stepTop + stickyTravel * targetPairYProgress);
      window.scrollTo({ top, behavior: "instant" });
    },
    {
      targetPairIndex: pairIndex,
      targetPairYProgress: pairYProgress,
    },
  );
}

async function applyDesktopState(page, state) {
  if (state.kind === "top") {
    await scrollToTop(page);
  } else if (state.kind === "scrollFraction") {
    await scrollToFraction(page, state.fraction);
  } else if (state.kind === "pairProgress") {
    await scrollToPairState(page, state.pairIndex, state.pairYProgress);
  } else if (state.kind === "selector") {
    await scrollToSelector(page, state.selector);
  } else {
    throw new Error(`Unknown state kind: ${state.kind}`);
  }

  await waitForMotionSettle(page);
}

async function captureBodyFull(page, targetPath) {
  await page.locator("body").screenshot({
    path: targetPath,
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });
}

async function captureViewport(page, targetPath) {
  await page.screenshot({
    path: targetPath,
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });
}

async function captureDesktopBaselines(browser, targetUrl) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...VIEWPORTS.desktop.contextOptions,
  });
  const page = await context.newPage();

  await markVisualCapture(page);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForRenderReady(page);
  await preparePageForCapture(page);

  const savedPaths = [];

  const fullTargetPath = path.join(
    BASELINES_DIR,
    `about-${VIEWPORTS.desktop.name}-default-full.png`,
  );
  await captureBodyFull(page, fullTargetPath);
  savedPaths.push(path.relative(REPO_ROOT, fullTargetPath));

  for (const state of DESKTOP_SCROLL_STATES) {
    await applyDesktopState(page, state);
    const targetPath = path.join(
      BASELINES_DIR,
      `about-${VIEWPORTS.desktop.name}-${state.name}.png`,
    );
    await captureViewport(page, targetPath);
    savedPaths.push(path.relative(REPO_ROOT, targetPath));
  }

  await context.close();
  return savedPaths;
}

async function captureStaticDesktopBaseline(browser, targetUrl) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...VIEWPORTS.staticDesktop.contextOptions,
  });
  const page = await context.newPage();

  await markVisualCapture(page);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForRenderReady(page);
  await preparePageForCapture(page);

  const savedPaths = [];

  const fullTargetPath = path.join(
    BASELINES_DIR,
    `about-${VIEWPORTS.staticDesktop.name}-static-full.png`,
  );
  await captureBodyFull(page, fullTargetPath);
  savedPaths.push(path.relative(REPO_ROOT, fullTargetPath));

  const topTargetPath = path.join(
    BASELINES_DIR,
    `about-${VIEWPORTS.staticDesktop.name}-static-top.png`,
  );
  await captureViewport(page, topTargetPath);
  savedPaths.push(path.relative(REPO_ROOT, topTargetPath));

  await context.close();
  return savedPaths;
}

async function captureMobileBaseline(browser, targetUrl) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...VIEWPORTS.mobile.contextOptions,
  });
  const page = await context.newPage();

  await markVisualCapture(page);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForRenderReady(page);
  await preparePageForCapture(page);

  const savedPaths = [];

  const fullTargetPath = path.join(
    BASELINES_DIR,
    `about-${VIEWPORTS.mobile.name}-default-full.png`,
  );
  await captureBodyFull(page, fullTargetPath);
  savedPaths.push(path.relative(REPO_ROOT, fullTargetPath));

  await scrollToSelector(page, "[data-about-voices-intro]", 40);
  await waitForMotionSettle(page);
  const voicesTargetPath = path.join(
    BASELINES_DIR,
    `about-${VIEWPORTS.mobile.name}-voices.png`,
  );
  await captureViewport(page, voicesTargetPath);
  savedPaths.push(path.relative(REPO_ROOT, voicesTargetPath));

  await context.close();
  return savedPaths;
}

async function main() {
  const { baseUrl, routePath } = parseArgs(process.argv.slice(2));
  const targetUrl = new URL(routePath, baseUrl).toString();

  await fs.mkdir(BASELINES_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    const savedPaths = [];
    savedPaths.push(...(await captureDesktopBaselines(browser, targetUrl)));
    savedPaths.push(...(await captureStaticDesktopBaseline(browser, targetUrl)));
    savedPaths.push(...(await captureMobileBaseline(browser, targetUrl)));

    console.log(`Captured about baselines from ${targetUrl}:`);
    for (const savedPath of savedPaths) {
      console.log(`- ${savedPath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("capture-about-baselines failed:", error);
  process.exitCode = 1;
});
