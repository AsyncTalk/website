import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    publicationDate: z.date(),
    categories: z.array(z.string()),
    status: z.enum(['draft', 'pending', 'published']),
    xyzLink: z.union([z.url(), z.literal("")]).optional(),
    draftLink: z.url().optional(),
    youtubeId: z.string().optional(),
    biliUrl: z.string().optional(),
    hasSlides: z.boolean().optional(),
    slidesUrl: z.url().optional(),
  })
});

export const collections = {
  posts
};
