import { getCollection, type CollectionEntry } from "astro:content";
import { POSTS_PAGE_SIZE } from "../constants";

export type Episode = CollectionEntry<"posts">;

/** Published episodes (everything in dev), newest first. */
export async function getEpisodes(): Promise<Episode[]> {
  const posts = await getCollection(
    "posts",
    ({ data }) => !import.meta.env.PROD || data.status === "published",
  );

  return posts.sort(
    (a, b) =>
      b.data.publicationDate.valueOf() - a.data.publicationDate.valueOf(),
  );
}

/** Splits "EP80 Personal Agent" into the code ("EP80") and the name. */
export function splitEpisodeTitle(episode: Episode) {
  const match = episode.data.title.match(/^((?:EP|SP)\d+)\s+(.+)$/i);

  return match
    ? { code: match[1].toUpperCase(), name: match[2] }
    : { code: `EP${episode.data.episodeNumber}`, name: episode.data.title };
}

export function postsPageCount(total: number) {
  return Math.max(1, Math.ceil(total / POSTS_PAGE_SIZE));
}

export function postsPagePath(page: number) {
  return page <= 1 ? "/posts/" : `/posts/page/${page}/`;
}

const longDate = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Shanghai",
});

export function formatEpisodeDate(date: Date) {
  return longDate.format(date);
}
