import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		heroImage: z.string().optional().nullable(),
		heroAltText: z.string().optional().nullable(),
		excerpt: z.string().optional().nullable(),
		author: z.string().optional().nullable(), 
		authorSlug: z.string().optional().nullable(),
		postCategory: z.string().optional().nullable(),
		categorySlug: z.string().optional().nullable(),
	}),
});

const books = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		coverImage: z.string().optional(),
		amazonLink: z.string().optional().nullable(),
		gumroadLink: z.string().optional().nullable(),
		weightlessLink: z.string().optional().nullable(),
		koboLink: z.string().optional().nullable(),
		kindleLink: z.string().optional().nullable(),
		goodreadsLink: z.string().optional().nullable(),
		isbn10: z.string().optional().nullable(),
		isbn13: z.string().optional().nullable(),
		payhipLink: z.string().optional().nullable(),
		itchLink: z.string().optional().nullable(),
		pageCount: z.number().optional().nullable(),
		genre: z.string().optional().nullable(),
		category: z.string().optional().nullable(),
		tag: z.string().optional().nullable(),
	}),
});


export const collections = { blog, books };
