import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Cover art is a `cover` frontmatter field resolved by the content schema's
 * `image()` helper, so Astro optimizes it like any other asset.
 *
 * Subtitles live under `public/` so the browser can download the raw .srt, and
 * the `srt` frontmatter field holds that public path (e.g. `/subtitles/ep73.srt`).
 * A declared file that is missing fails the build instead of silently dropping
 * the transcript.
 */
export function readEpisodeSubtitles(publicPath: string) {
  const file = path.join(process.cwd(), "public", publicPath);

  if (!existsSync(file)) {
    throw new Error(
      `Subtitle file not found: ${publicPath} (looked in ${file}). Fix the "srt" frontmatter field or add the file.`,
    );
  }

  return readFileSync(file, "utf8");
}
