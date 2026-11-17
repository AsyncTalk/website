import {
  getEpisodes,
  splitEpisodeTitle,
  type Episode,
} from "./episodes";
import { episodePath } from "./seo";

// Keep scripts/algolia-index.mjs (DEFAULT_INDEX_NAME) in sync.
export const DEFAULT_SEARCH_INDEX = "asynctalk_posts";

/** One Algolia record per episode. */
export type SearchRecord = {
  objectID: string;
  url: string;
  title: string;
  code: string;
  name: string;
  subtitle: string;
  excerpt: string;
  author: string;
  categories: string[];
  chapters: string[];
  content: string;
  season: number;
  episodeNumber: number;
  /** Unix seconds, used as the tie-breaker so newer episodes rank first. */
  publishedAt: number;
};

export type SearchConfig = {
  appId: string;
  searchKey: string;
  indexName: string;
};

/**
 * Browser-side Algolia settings. The search-only key is meant to be public;
 * the admin key never goes here. Returns null when search is not configured,
 * in which case the site simply renders without the search entry.
 */
export function getSearchConfig(): SearchConfig | null {
  const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID?.trim();
  const searchKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY?.trim();

  if (!appId || !searchKey) {
    return null;
  }

  return {
    appId,
    searchKey,
    indexName:
      import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME?.trim() || DEFAULT_SEARCH_INDEX,
  };
}

// Algolia's free plan rejects records over 10 KB, so the shownotes text is cut
// to keep every record comfortably below that.
const MAX_RECORD_BYTES = 9000;
const encoder = new TextEncoder();

function byteLength(value: unknown) {
  return encoder.encode(JSON.stringify(value)).length;
}

/** Reduces MDX shownotes to plain searchable text. */
export function mdxToPlainText(source: string) {
  return source
    .replace(/^(import|export)\s.*$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/[*_`~]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    // Every episode opens with the same "📕 Shownotes" heading.
    .replace(/^📕\s*Shownotes\s*/i, "");
}

function toRecord(episode: Episode): SearchRecord {
  const { data } = episode;
  const { code, name } = splitEpisodeTitle(episode);
  const url = episodePath(episode.id);

  const record: SearchRecord = {
    objectID: url.replace(/^\/posts\/|\/$/g, ""),
    url,
    title: data.title,
    code,
    name,
    subtitle: data.subtitle,
    excerpt: data.excerpt,
    author: data.author,
    categories: data.categories,
    chapters: (data.timeline ?? []).map((chapter) => chapter.title),
    content: mdxToPlainText(episode.body ?? ""),
    season: data.season,
    episodeNumber: data.episodeNumber,
    publishedAt: Math.floor(data.publicationDate.valueOf() / 1000),
  };

  let chars = [...record.content];
  while (chars.length > 0 && byteLength(record) > MAX_RECORD_BYTES) {
    chars = chars.slice(0, Math.floor(chars.length * 0.9));
    record.content = chars.join("");
  }

  return record;
}

export async function getSearchRecords(): Promise<SearchRecord[]> {
  return (await getEpisodes()).map(toRecord);
}
