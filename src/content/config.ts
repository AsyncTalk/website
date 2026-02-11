// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';
// 2. Define your collection(s)
const posts = defineCollection({
  type: 'content',
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
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  posts
};