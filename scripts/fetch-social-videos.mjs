import { execFile } from "node:child_process";
import { mkdir, readdir, writeFile, rm, access } from "node:fs/promises";
import { join, basename, extname } from "node:path";

const PUBLIC_VIDEOS = new URL("../public/videos/", import.meta.url).pathname;
const YT_DLP = process.env.YT_DLP || "/opt/homebrew/bin/yt-dlp";

const SOURCES = [
  { url: "https://www.tiktok.com/@azraltar", platform: "tiktok" },
  { url: "https://www.instagram.com/lichnostno_ovlastyavane", platform: "instagram" },
];

const LIMIT = 6;

async function runYtdlp({ url, platform }) {
  await mkdir(PUBLIC_VIDEOS, { recursive: true });

  return new Promise((resolve, reject) => {
    const output = join(PUBLIC_VIDEOS, `${platform}_%(id)s.%(ext)s`);

    console.log(`Fetching ${platform} videos from ${url}...`);

    const proc = execFile(
      YT_DLP,
      [
        "--playlist-end",
        String(LIMIT),
        "--remux-video",
        "mp4",
        "--write-thumbnail",
        "--convert-thumbnails",
        "jpg",
        "--no-mtime",
        "--output",
        output,
        "--ignore-errors",
        "--no-warnings",
        "--no-abort-on-error",
        url,
      ],
      { timeout: 240_000 },
      (error, stdout, stderr) => {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (error) {
          console.error(`yt-dlp failed for ${url}:`, error.message);
          reject(error);
        } else {
          console.log(`yt-dlp finished for ${url}`);
          resolve();
        }
      }
    );
  });
}

async function buildManifest() {
  const files = await readdir(PUBLIC_VIDEOS);
  const mp4s = files.filter((f) => f.endsWith(".mp4"));

  const items = mp4s
    .map((mp4) => {
      const base = basename(mp4, ".mp4");
      const thumbName = `${base}.jpg`;
      const poster = files.includes(thumbName) ? `/videos/${thumbName}` : undefined;
      const firstUnderscore = base.indexOf("_");
      const platform = firstUnderscore > 0 ? base.slice(0, firstUnderscore) : "unknown";
      const id = firstUnderscore > 0 ? base.slice(firstUnderscore + 1) : base;
      const date = new Date().toISOString().split("T")[0];

      return {
        id,
        platform,
        src: `/videos/${mp4}`,
        poster,
        caption: { bg: "", en: "" },
        date,
      };
    })
    .sort((a, b) => a.src.localeCompare(b.src));

  await writeFile(
    join(PUBLIC_VIDEOS, "manifest.json"),
    JSON.stringify(items, null, 2)
  );
  console.log(`Wrote manifest with ${items.length} videos`);
}

async function main() {
  await rm(PUBLIC_VIDEOS, { recursive: true, force: true });
  await mkdir(PUBLIC_VIDEOS, { recursive: true });

  for (const source of SOURCES) {
    try {
      await runYtdlp(source);
    } catch (e) {
      console.error(`Skipping ${source.url}:`, e.message);
    }
  }

  await buildManifest();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
