import {z, defineCollection } from 'astro:content';
const blog = defineCollection({
  schema:z.object({
    title: z.string(),
    date: z.string().transform(str => new Date(str)),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    hide: z.boolean().optional(),
    draft: z.boolean().optional(),
    sticky: z.number().optional(),
    image: z.string().optional(),
    description: z.string().optional()
  })
});

const about = defineCollection({})

export const collections = { blog, about };
