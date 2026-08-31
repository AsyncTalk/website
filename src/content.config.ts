import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    type: z.literal('podcast-episode'),
    slug: z.string().startsWith('/posts/'),
    guid: z.number().int().nonnegative(),
    title: z.string(),
    subtitle: z.string(),
    excerpt: z.string().trim().min(40).max(160),
    author: z.string(),
    publicationDate: z.date(),
    season: z.number().int().positive(),
    episodeNumber: z.number().int().nonnegative(),
    episodeType: z.enum(['full', 'trailer']),
    url: z.url(),
    size: z.number().nonnegative(),
    duration: z.number().nonnegative(),
    explicit: z.boolean(),
    categories: z.array(z.string()),
    status: z.enum(['draft', 'pending', 'published']),
    xyzLink: z.union([z.url(), z.literal("")]).optional(),
    draftLink: z.url().optional(),
    youtubeId: z.string().optional(),
    biliUrl: z.string().optional(),
    cover: image().optional(),
    srt: z.string().startsWith('/').endsWith('.srt').optional(),
    hasSlides: z.boolean().optional(),
    slidesUrl: z.url().optional(),
  })
});

export const collections = {
  posts
};
