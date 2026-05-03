import { chromium, devices } from "playwright";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = process.cwd();
const ABOUT_SOURCE_PATH = "/docs/design/pages/about/source/about.html";
const BASELINES_DIR = path.join(
  REPO_ROOT,
  "docs/design/pages/about/snapshots/baselines",
);
const HOST = "127.0.0.1";
const PORT = 4178;

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
  { name: "reading-method", kind: "selector", selector: ".story-step:not(.story-step-pair) .story-card" },
  { name: "pair-3-mid", kind: "pairProgress", pairIndex: 2, pairYProgress: 0.58 },
  { name: "voices", kind: "selector", selector: ".voice-intro-card" },
  { name: "audience", kind: "selector", selector: ".text-panel" },
];

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".mp4":
      return "video/mp4";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

function safeResolveFromRepo(urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname.split("?")[0]);
  const normalized = decodedPath === "/" ? ABOUT_SOURCE_PATH : decodedPath;
  const absolutePath = path.resolve(REPO_ROOT, `.${normalized}`);
  if (!absolutePath.startsWith(REPO_ROOT)) {
    return null;
  }
  return absolutePath;
}

function startStaticServer() {
  const server = http.createServer(async (req, res) => {
    const filePath = safeResolveFromRepo(req.url || "/");
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      const file = await fs.readFile(filePath);
      res.writeHead(200, {
        "Content-Type": contentTypeFor(filePath),
        "Cache-Control": "no-store",
      });
      res.end(file);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, () => resolve(server));
  });
}

async function ensureAboutDataReady(page) {
  await page.waitForFunction(() => {
    return (
      document.querySelectorAll("[data-pair]").length >= 3 &&
      document.querySelectorAll(".voice-card").length >= 3 &&
      document.getElementById("story-frame")
    );
  });
}

async function waitForRenderReady(page) {
  await page.waitForLoadState("domcontentloaded");

  try {
    await page.waitForLoadState("networkidle", { timeout: 5000 });
  } catch {
    // External font requests or deferred media can keep the page technically busy.
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

  await page.waitForFunction(() => {
    const frame = document.getElementById("story-frame");
    return !!frame && frame.getAttribute("src");
  });

  await page.waitForFunction(() => {
    const frame = document.getElementById("story-frame");
    return !!frame && frame.classList.contains("is-ready");
  });

  await page.waitForTimeout(350);
}

async function preparePageForBaselineCapture(page) {
  await page.addStyleTag({
    content: `
      html, body {
        overflow-x: hidden !important;
      }
    `,
  });
}

async function waitForMotionSettle(page) {
  await page.waitForTimeout(500);
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
      const pairs = Array.from(document.querySelectorAll("[data-pair]"));
      const pair = pairs[targetPairIndex];
      if (!pair) {
        throw new Error(`Pair not found at index ${targetPairIndex}`);
      }

      const step = pair.closest(".story-step");
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

async function captureDesktopBaselines(browser, baseUrl) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...VIEWPORTS.desktop.contextOptions,
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${ABOUT_SOURCE_PATH}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForRenderReady(page);
  await preparePageForBaselineCapture(page);

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

async function captureStaticDesktopBaseline(browser, baseUrl) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...VIEWPORTS.staticDesktop.contextOptions,
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${ABOUT_SOURCE_PATH}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForRenderReady(page);
  await preparePageForBaselineCapture(page);

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

async function captureMobileBaseline(browser, baseUrl) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...VIEWPORTS.mobile.contextOptions,
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${ABOUT_SOURCE_PATH}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForRenderReady(page);
  await preparePageForBaselineCapture(page);

  const savedPaths = [];

  const fullTargetPath = path.join(
    BASELINES_DIR,
    `about-${VIEWPORTS.mobile.name}-default-full.png`,
  );
  await captureBodyFull(page, fullTargetPath);
  savedPaths.push(path.relative(REPO_ROOT, fullTargetPath));

  await scrollToSelector(page, ".voice-intro-card", 40);
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
  await fs.mkdir(BASELINES_DIR, { recursive: true });

  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const baseUrl = `http://${HOST}:${PORT}`;

  try {
    const savedPaths = [];
    savedPaths.push(...(await captureDesktopBaselines(browser, baseUrl)));
    savedPaths.push(...(await captureStaticDesktopBaseline(browser, baseUrl)));
    savedPaths.push(...(await captureMobileBaseline(browser, baseUrl)));

    console.log("Saved about baselines:");
    for (const savedPath of savedPaths) {
      console.log(`- ${savedPath}`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
