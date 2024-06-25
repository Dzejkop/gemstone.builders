import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const docs = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		summary: z.string(),
	}),
});

export const collections = { blog, docs };
