import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');

  posts.sort((a, b) => {
    return (
      new Date(b.data.publicationDate).valueOf() -
      new Date(a.data.publicationDate).valueOf()
    );
  });

  const items = posts.map<RSSFeedItem>((post) => ({
    title: post.data.title,
    link: `${context.site}${post.slug.startsWith('/') ? post.slug.slice(1) : post.slug}`,
    pubDate: post.data.publicationDate,
  }));

  return rss({
    title: 'AsyncTalk Podcast - 和我们一起，将 Web 开发带向下一个高度',
    description: '和我们一起，将 Web 开发带向下一个高度',
    site: context.site ?? 'https://asynctalk.com',
    customData: `<language>zh-CN</language>`,
    items,
  });
}