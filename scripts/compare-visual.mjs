import fs from "node:fs/promises";
import path from "node:path";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const REPO_ROOT = process.cwd();

const ALLOWED_MISMATCH_PERCENT = {
  home: {
    "home-1440-default.png": 1.05,
    "home-1440-episode-card-hover.png": 1.05,
    "home-1440-hero-button-active.png": 1.05,
    "home-1440-hero-button-hover.png": 1.05,
    "home-1440-participant-hover.png": 1.05,
    "home-1440-social-button-hover.png": 1.05,
    "home-390-default.png": 0.55,
    "home-390-episode-card-hover.png": 0.01,
    "home-390-hero-button-active.png": 0.01,
    "home-390-hero-button-hover.png": 0.01,
    "home-390-participant-hover.png": 0.02,
    "home-390-social-button-hover.png": 0.55,
  },
  about: {
    "about-1100-static-full.png": 0.002,
    "about-1100-static-top.png": 0.006,
    "about-1440-audience.png": 0.05,
    "about-1440-default-full.png": 0.001,
    "about-1440-pair-1-mid.png": 0.8,
    "about-1440-pair-2-mid.png": 0.35,
    "about-1440-pair-3-mid.png": 1.6,
    "about-1440-reading-method.png": 0.9,
    "about-1440-sequence-early.png": 2.2,
    "about-1440-top-viewport.png": 0.004,
    "about-1440-voices.png": 0.55,
    "about-390-default-full.png": 0.003,
    "about-390-voices.png": 0.03,
  },
};

function parseArgs(argv) {
  const args = {
    page: "all",
    threshold: 0.1,
    failOnMismatch: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--page" && argv[index + 1]) {
      args.page = argv[index + 1];
      index += 1;
    } else if (arg === "--threshold" && argv[index + 1]) {
      args.threshold = Number(argv[index + 1]);
      index += 1;
    } else if (arg === "--no-fail") {
      args.failOnMismatch = false;
    }
  }

  return args;
}

function resolvePages(page) {
  if (page === "all") {
    return ["home", "about"];
  }
  if (page === "home" || page === "about") {
    return [page];
  }
  throw new Error(`Unknown page: ${page}`);
}

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true });
}

async function readPng(filePath) {
  const buffer = await fs.readFile(filePath);
  return PNG.sync.read(buffer);
}

async function writePng(filePath, png) {
  await fs.writeFile(filePath, PNG.sync.write(png));
}

async function comparePage(page, threshold) {
  const baselinesDir = path.join(
    REPO_ROOT,
    `docs/design/pages/${page}/snapshots/baselines`,
  );
  const currentDir = path.join(
    REPO_ROOT,
    `docs/design/pages/${page}/snapshots/current`,
  );
  const diffsDir = path.join(
    REPO_ROOT,
    `docs/design/pages/${page}/snapshots/diffs`,
  );

  await ensureDir(diffsDir);

  const baselineFiles = (await fs.readdir(baselinesDir))
    .filter((entry) => entry.endsWith(".png"))
    .sort();

  const results = [];

  for (const filename of baselineFiles) {
    const baselinePath = path.join(baselinesDir, filename);
    const currentPath = path.join(currentDir, filename);
    const diffPath = path.join(diffsDir, filename);

    try {
      await fs.access(currentPath);
    } catch {
      results.push({ filename, status: "missing-current" });
      continue;
    }

    const baseline = await readPng(baselinePath);
    const current = await readPng(currentPath);

    if (
      baseline.width !== current.width ||
      baseline.height !== current.height
    ) {
      results.push({
        filename,
        status: "size-mismatch",
        baselineSize: `${baseline.width}x${baseline.height}`,
        currentSize: `${current.width}x${current.height}`,
      });
      continue;
    }

    const diff = new PNG({ width: baseline.width, height: baseline.height });
    const mismatchPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      baseline.width,
      baseline.height,
      { threshold },
    );

    const totalPixels = baseline.width * baseline.height;
    const mismatchPercent = (mismatchPixels / totalPixels) * 100;

    const allowedMismatchPercent =
      ALLOWED_MISMATCH_PERCENT[page]?.[filename] ?? 0;

    if (mismatchPixels > 0) {
      await writePng(diffPath, diff);
      results.push({
        filename,
        status:
          mismatchPercent <= allowedMismatchPercent ? "accepted-mismatch" : "mismatch",
        mismatchPixels,
        mismatchPercent,
        allowedMismatchPercent,
      });
    } else {
      try {
        await fs.unlink(diffPath);
      } catch {
        // No stale diff file to remove.
      }
      results.push({
        filename,
        status: "match",
        mismatchPixels: 0,
        mismatchPercent: 0,
      });
    }
  }

  return results;
}

function printResults(page, results) {
  console.log(`\n[${page}]`);
  for (const result of results) {
    if (result.status === "match") {
      console.log(`PASS ${result.filename} (${result.mismatchPercent.toFixed(6)}%)`);
    } else if (result.status === "accepted-mismatch") {
      console.log(
        `TOLR ${result.filename} (${result.mismatchPercent.toFixed(6)}% <= ${result.allowedMismatchPercent.toFixed(6)}%)`,
      );
    } else if (result.status === "mismatch") {
      console.log(
        `FAIL ${result.filename} (${result.mismatchPercent.toFixed(6)}%, ${result.mismatchPixels} px)`,
      );
    } else if (result.status === "missing-current") {
      console.log(`MISS ${result.filename} (no current snapshot)`);
    } else if (result.status === "size-mismatch") {
      console.log(
        `SIZE ${result.filename} (${result.baselineSize} vs ${result.currentSize})`,
      );
    }
  }
}

async function main() {
  const { page, threshold, failOnMismatch } = parseArgs(process.argv.slice(2));
  const pages = resolvePages(page);
  let hasFailures = false;

  for (const targetPage of pages) {
    const results = await comparePage(targetPage, threshold);
    printResults(targetPage, results);

    if (
      results.some((result) =>
        ["mismatch", "missing-current", "size-mismatch"].includes(
          result.status,
        ),
      )
    ) {
      hasFailures = true;
    }
  }

  if (hasFailures && failOnMismatch) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
