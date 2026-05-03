import { chromium, devices } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = process.cwd();
const CURRENT_DIR = path.join(
  REPO_ROOT,
  "docs/design/pages/home/snapshots/current",
);

const VIEWPORTS = [
  {
    name: "1440",
    contextOptions: {
      viewport: { width: 1440, height: 2400 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
    },
  },
  {
    name: "390",
    contextOptions: {
      ...devices["iPhone 12"],
      viewport: { width: 390, height: 844 },
    },
  },
];

const STATES = [
  { name: "default" },
  {
    name: "hero-button-hover",
    selector: ".hero-actions .button:first-child",
    pseudo: ["hover"],
  },
  {
    name: "hero-button-active",
    selector: ".hero-actions .button:first-child",
    pseudo: ["active"],
  },
  {
    name: "episode-card-hover",
    selector: ".episodes-track .episode-card:first-child",
    pseudo: ["hover"],
  },
  {
    name: "participant-hover",
    selector: ".participants-list .participant:nth-child(2)",
    pseudo: ["hover"],
  },
  {
    name: "social-button-hover",
    selector: ".social-buttons .social-button:first-child",
    pseudo: ["hover"],
  },
];

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.CAPTURE_BASE_URL || "http://127.0.0.1:3000",
    routePath: process.env.CAPTURE_HOME_PATH || "/",
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

async function ensureHomeDataReady(page) {
  await page.waitForFunction(() => {
    return (
      document.querySelectorAll(".episodes-track .episode-card").length >= 1 &&
      document.querySelectorAll(".participants-list .participant").length >= 1 &&
      document.querySelectorAll(".social-buttons .social-button").length >= 1 &&
      document.querySelector(".hero-side .hero-episode") &&
      document.querySelector(".hero-actions .button")
    );
  });
}

async function waitForRenderReady(page) {
  await page.waitForLoadState("domcontentloaded");

  try {
    await page.waitForLoadState("networkidle", { timeout: 5000 });
  } catch {
    // Dynamic apps or font requests may keep the page busy.
  }

  await ensureHomeDataReady(page);

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
    await page.waitForFunction(() =>
      Array.from(document.images).every((image) => image.complete),
    );
  } catch {
    // Keep going if some images fail silently.
  }

  await page.waitForTimeout(250);
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

async function forcePseudoState(page, selector, pseudoClasses) {
  const client = await page.context().newCDPSession(page);
  await client.send("DOM.enable");
  await client.send("CSS.enable");
  const { root } = await client.send("DOM.getDocument", {});
  const { nodeId } = await client.send("DOM.querySelector", {
    nodeId: root.nodeId,
    selector,
  });

  if (!nodeId) {
    throw new Error(`Selector not found for pseudo state: ${selector}`);
  }

  await client.send("CSS.forcePseudoState", {
    nodeId,
    forcedPseudoClasses: pseudoClasses,
  });
}

async function captureState(browser, targetUrl, viewport, state) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...viewport.contextOptions,
  });
  const page = await context.newPage();

  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForRenderReady(page);
  await preparePageForCapture(page);

  if (state.selector && state.pseudo?.length) {
    await scrollToSelector(page, state.selector);
    await forcePseudoState(page, state.selector, state.pseudo);
    await page.waitForTimeout(150);
  }

  const targetPath = path.join(
    CURRENT_DIR,
    `home-${viewport.name}-${state.name}.png`,
  );

  await page.locator("body").screenshot({
    path: targetPath,
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });

  await context.close();
  return targetPath;
}

async function main() {
  const { baseUrl, routePath } = parseArgs(process.argv.slice(2));
  const targetUrl = new URL(routePath, baseUrl).toString();

  await fs.mkdir(CURRENT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    const savedPaths = [];

    for (const viewport of VIEWPORTS) {
      for (const state of STATES) {
        const savedPath = await captureState(browser, targetUrl, viewport, state);
        savedPaths.push(path.relative(REPO_ROOT, savedPath));
      }
    }

    console.log(`Captured home current snapshots from ${targetUrl}:`);
    for (const savedPath of savedPaths) {
      console.log(`- ${savedPath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
