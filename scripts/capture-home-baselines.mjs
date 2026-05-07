import { chromium, devices } from "playwright";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = process.cwd();
const HOME_SOURCE_PATH = "/docs/design/pages/home/source/home-mvp.html";
const BASELINES_DIR = path.join(
  REPO_ROOT,
  "docs/design/pages/home/snapshots/baselines",
);
const HOST = "127.0.0.1";
const PORT = 4173;

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
  {
    name: "default",
  },
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
    selector: "#episodes-slot .episode-card:first-child",
    pseudo: ["hover"],
  },
  {
    name: "participant-hover",
    selector: "#participants-slot .participant:nth-child(2)",
    pseudo: ["hover"],
  },
  {
    name: "social-button-hover",
    selector: "#socials-slot .social-button:first-child",
    pseudo: ["hover"],
  },
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
  const normalized = decodedPath === "/" ? HOME_SOURCE_PATH : decodedPath;
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

async function ensureHomeDataReady(page) {
  await page.waitForFunction(() => {
    return (
      document.querySelectorAll("#episodes-slot .episode-card").length >= 4 &&
      document.querySelectorAll("#participants-slot .participant").length >= 3 &&
      document.querySelectorAll("#socials-slot .social-button").length >= 3 &&
      document.querySelector("#hero-episode-slot .hero-episode")
    );
  });
}

async function waitForRenderReady(page) {
  await page.waitForLoadState("domcontentloaded");

  try {
    await page.waitForLoadState("networkidle", { timeout: 4000 });
  } catch {
    // Static HTML may never reach a perfectly quiet network state because of font requests.
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
    // Some images may fail silently; keep going if the page is otherwise stable.
  }

  await page.waitForTimeout(250);
}

async function preparePageForBaselineCapture(page) {
  await page.addStyleTag({
    content: `
      html, body {
        overflow-x: hidden !important;
      }
    `,
  });

  await page.evaluate(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
  await page.waitForTimeout(120);
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

async function captureState(browser, baseUrl, viewport, state) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...viewport.contextOptions,
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${HOME_SOURCE_PATH}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForRenderReady(page);
  await preparePageForBaselineCapture(page);

  if (state.selector && state.pseudo?.length) {
    await page.locator(state.selector).scrollIntoViewIfNeeded();
    await forcePseudoState(page, state.selector, state.pseudo);
    await page.waitForTimeout(150);
  }

  const targetPath = path.join(
    BASELINES_DIR,
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

async function warmViewport(browser, baseUrl, viewport) {
  const context = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...viewport.contextOptions,
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${HOME_SOURCE_PATH}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForRenderReady(page);
  await preparePageForBaselineCapture(page);
  await page.waitForTimeout(250);
  await context.close();
}

async function main() {
  await fs.mkdir(BASELINES_DIR, { recursive: true });

  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const baseUrl = `http://${HOST}:${PORT}`;

  try {
    const savedPaths = [];

    for (const viewport of VIEWPORTS) {
      await warmViewport(browser, baseUrl, viewport);

      for (const state of STATES) {
        const savedPath = await captureState(browser, baseUrl, viewport, state);
        savedPaths.push(path.relative(REPO_ROOT, savedPath));
      }
    }

    console.log("Saved home baselines:");
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
