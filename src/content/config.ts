import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		draft: z.boolean().optional(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
		excerpt: z.string().optional(),
	}),
});

const photography = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		draft: z.boolean().optional(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		// 摄影作品特有字段
		images: z.array(z.object({
			src: z.string(),
			alt: z.string(),
			width: z.number().optional(),
			height: z.number().optional(),
			caption: z.string().optional(),
		})),
		location: z.string().optional(),
		camera: z.string().optional(),
		lens: z.string().optional(),
		settings: z.object({
			iso: z.number().optional(),
			aperture: z.string().optional(),
			shutterSpeed: z.string().optional(),
			focalLength: z.string().optional(),
		}).optional(),
		category: z.enum(['风景', '人像', '街拍', '建筑', '微距', '其他']).optional(),
		tags: z.array(z.string()).optional(),
		featured: z.boolean().optional(),
	}),
});

export const collections = { blog, photography };
