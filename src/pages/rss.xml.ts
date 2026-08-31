import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL, canonicalUrl, episodePath } from "../lib/seo";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(context: APIContext) {
  const posts = await getCollection(
    "posts",
    ({ data }) => data.status === "published",
  );

  posts.sort(
    (a, b) => b.data.publicationDate.valueOf() - a.data.publicationDate.valueOf(),
  );

  const site = context.site ?? new URL(SITE_URL);
  const items = posts.map<RSSFeedItem>((post) => {
    const pageUrl = canonicalUrl(episodePath(post.id), site);
    const cover = post.data.cover;
    const coverUrl = cover ? new URL(cover.src, site).toString() : undefined;

    return {
      title: post.data.title,
      description: post.data.excerpt,
      link: pageUrl,
      pubDate: post.data.publicationDate,
      author: post.data.author,
      categories: post.data.categories,
      customData: [
        `<guid isPermaLink="true">${escapeXml(pageUrl)}</guid>`,
        coverUrl ? `<itunes:image href="${escapeXml(coverUrl)}"/>` : "",
      ].join(""),
    };
  });

  return rss({
    title: "AsyncTalk｜和我们一起，将 Web 开发带向下一个高度",
    description:
      "关注 Web 开发、前端工程化与 AI，分享前沿技术、工程实践与开发者观点。和我们一起，将 Web 开发带向下一个高度。",
    site,
    xmlns: { itunes: "http://www.itunes.com/dtds/podcast-1.0/" },
    customData: "<language>zh-CN</language>",
    items,
  });
}
