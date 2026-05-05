#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const EPISODES_PATH = path.resolve("content/episodes.base.json");
const OUTPUT_DIR = path.resolve("public/episodes/thumbnails");
const MANIFEST_PATH = path.resolve("content/episode-thumbnails.generated.json");

async function download(url, outputPath) {
  const result = spawnSync(
    "curl",
    ["--fail", "--location", "--silent", "--show-error", "--max-time", "30", "--output", outputPath, url],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || `Failed to download ${url}`);
  }
}

function convertToWebp(inputPath, outputPath) {
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      inputPath,
      "-vf",
      "scale=w='min(960,iw)':h=-2",
      "-c:v",
      "libwebp",
      "-quality",
      "82",
      "-compression_level",
      "6",
      outputPath,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || `ffmpeg failed for ${inputPath}`);
  }
}

function getFallbackThumbnailUrl(youtubeId) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

async function main() {
  const episodes = JSON.parse(await readFile(EPISODES_PATH, "utf8"));
  const tempDir = path.join(os.tmpdir(), `tolk-thumbnails-${Date.now()}`);

  try {
    await mkdir(tempDir, { recursive: true });
    await mkdir(OUTPUT_DIR, { recursive: true });

    const manifest = {};

    for (const episode of episodes) {
      const youtubeId = episode.youtubeId;
      if (!youtubeId) continue;

      const sourcePath = path.join(tempDir, `${youtubeId}.jpg`);
      const outputPath = path.join(OUTPUT_DIR, `${youtubeId}.webp`);
      const urls = [episode.thumbnailUrl, getFallbackThumbnailUrl(youtubeId)].filter(Boolean);

      let downloaded = false;
      for (const url of urls) {
        try {
          await download(url, sourcePath);
          downloaded = true;
          break;
        } catch (error) {
          // Try the fallback thumbnail before failing the whole sync.
          if (url === urls.at(-1)) throw error;
        }
      }

      if (!downloaded) continue;

      convertToWebp(sourcePath, outputPath);
      manifest[youtubeId] = `/episodes/thumbnails/${youtubeId}.webp`;
    }

    await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

    // eslint-disable-next-line no-console
    console.log(`Synced ${Object.keys(manifest).length} thumbnails -> ${OUTPUT_DIR}`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
