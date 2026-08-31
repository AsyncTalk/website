import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const covers = import.meta.glob<ImageMetadata>(
  "/src/assets/*/cover.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
);

/**
 * Per-episode media follows a path convention instead of frontmatter, so an
 * episode lights up as soon as the file lands and stays valid while it is
 * missing:
 *
 * - cover art:  src/assets/<episode>/cover.{jpg,jpeg,png,webp}
 * - subtitles:  public/subtitles/<episode>.srt
 */
export function getEpisodeCover(episode: string) {
  const match = Object.entries(covers).find(
    ([file]) => file.split("/").at(-2) === episode,
  );

  return match?.[1];
}

export function episodeSubtitlePath(episode: string) {
  return `/subtitles/${episode}.srt`;
}

export function readEpisodeSubtitles(episode: string) {
  const file = path.join(process.cwd(), "public", "subtitles", `${episode}.srt`);

  return existsSync(file) ? readFileSync(file, "utf8") : undefined;
}
