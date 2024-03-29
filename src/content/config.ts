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
    index_img: z.string().optional(),
    description: z.string().optional()
  })
});

const about = defineCollection({})

const note = defineCollection({
  schema: z.object({
    title: z.string(),
    type: z.string(),
    date: z.string().transform(str => new Date(str))
  })
})

export const collections = { blog, about, note };
