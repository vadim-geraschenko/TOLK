#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const OUTPUT_PATH = path.resolve("content/episodes.base.json");

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function chunk(values, size) {
  const result = [];
  for (let i = 0; i < values.length; i += size) {
    result.push(values.slice(i, i + size));
  }
  return result;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API ${response.status}: ${body}`);
  }
  return response.json();
}

async function resolveUploadsPlaylistId(apiKey) {
  const explicit = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID;
  if (explicit) return explicit;

  const channelId = requiredEnv("YOUTUBE_CHANNEL_ID");
  const url = new URL(`${API_BASE}/channels`);
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  const json = await fetchJson(url);
  const item = json.items?.[0];
  const playlistId = item?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) {
    throw new Error("Cannot resolve uploads playlist from YOUTUBE_CHANNEL_ID");
  }
  return playlistId;
}

async function fetchPlaylistVideoIds(apiKey, playlistId) {
  const ids = [];
  let pageToken = "";

  while (true) {
    const url = new URL(`${API_BASE}/playlistItems`);
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const json = await fetchJson(url);
    for (const item of json.items ?? []) {
      const id = item?.contentDetails?.videoId;
      if (id) ids.push(id);
    }

    pageToken = json.nextPageToken ?? "";
    if (!pageToken) break;
  }

  return ids;
}

async function fetchVideoDetails(apiKey, ids) {
  const records = [];

  for (const idChunk of chunk(ids, 50)) {
    const url = new URL(`${API_BASE}/videos`);
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("id", idChunk.join(","));
    url.searchParams.set("key", apiKey);

    const json = await fetchJson(url);
    for (const item of json.items ?? []) {
      const snippet = item.snippet ?? {};
      const thumbs = snippet.thumbnails ?? {};
      const bestThumb =
        thumbs.maxres?.url ??
        thumbs.standard?.url ??
        thumbs.high?.url ??
        thumbs.medium?.url ??
        thumbs.default?.url ??
        "";

      records.push({
        youtubeId: item.id,
        title: snippet.title ?? "",
        description: snippet.description ?? "",
        publishedAt: snippet.publishedAt ?? "",
        durationIso: item.contentDetails?.duration ?? "PT0S",
        thumbnailUrl: bestThumb,
      });
    }
  }

  return records
    .filter((item) => item.youtubeId && item.title && item.publishedAt)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function main() {
  const apiKey = requiredEnv("YOUTUBE_API_KEY");
  const playlistId = await resolveUploadsPlaylistId(apiKey);
  const videoIds = await fetchPlaylistVideoIds(apiKey, playlistId);
  const details = await fetchVideoDetails(apiKey, videoIds);

  await writeFile(OUTPUT_PATH, `${JSON.stringify(details, null, 2)}\n`, "utf8");
  // eslint-disable-next-line no-console
  console.log(`Synced ${details.length} videos -> ${OUTPUT_PATH}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
