import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    publicationDate: z.date(),
    categories: z.array(z.string()),
    status: z.enum(['draft', 'pending', 'published']),
    xyzLink: z.union([z.string().url(), z.literal("")]).optional(),
    draftLink: z.string().url().optional(),
    youtubeId: z.string().optional(),
    biliUrl: z.string().optional(),
  })
});

export const collections = {
  posts
};
