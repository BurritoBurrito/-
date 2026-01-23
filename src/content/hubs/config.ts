import { defineCollection, z } from 'astro:content';

const hubs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string()
  })
});

export const collections = { hubs };
