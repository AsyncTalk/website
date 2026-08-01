export const SITE_URL = "https://asynctalk.com/";
export const SITE_NAME = "AsyncTalk";
export const SITE_LANGUAGE = "zh-CN";
export const OG_LOCALE = "zh_CN";

export function normalizePagePath(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (path === "/" || path.endsWith("/")) {
    return path;
  }

  const lastSegment = path.split("/").at(-1) ?? "";
  return lastSegment.includes(".") ? path : `${path}/`;
}

export function canonicalUrl(pathname: string, site: URL | undefined) {
  return new URL(normalizePagePath(pathname), site ?? SITE_URL).toString();
}

export function episodePath(id: string) {
  const episodeId = id.replace(/^\/?posts\//, "").replace(/\.mdx$/, "");
  return `/posts/${episodeId}/`;
}

export function parseAuthors(author: string) {
  return author
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ "@type": "Person", name }));
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function normalizeExternalUrl(url: string | undefined) {
  if (!url) {
    return undefined;
  }

  return url.startsWith("//") ? `https:${url}` : url;
}

export function youtubeUrl(id: string | undefined) {
  return id ? `https://www.youtube.com/watch?v=${id}` : undefined;
}

export function bilibiliUrl(url: string | undefined) {
  const normalized = normalizeExternalUrl(url);
  const bvid = normalized ? new URL(normalized).searchParams.get("bvid") : null;
  return bvid ? `https://www.bilibili.com/video/${bvid}/` : undefined;
}

export function compactUrls(urls: Array<string | undefined>) {
  return [...new Set(urls.filter((url): url is string => Boolean(url)))];
}
