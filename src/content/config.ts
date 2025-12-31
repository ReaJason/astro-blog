import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		date: z.string().transform((str) => new Date(str)),
		tags: z.array(z.string()).optional(),
		categories: z.array(z.string()).optional(),
		hide: z.boolean().optional(),
		draft: z.boolean().optional(),
		sticky: z.number().optional(),
		index_img: z.string().optional(),
		description: z.string().optional(),
	}),
});

export const collections = { blog };
