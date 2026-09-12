import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function get(context) {
	let posts = [];
	try {
		posts = (await getCollection('blog', ({ data }) => !data.draft))
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	} catch (error) {
		posts = [];
	}
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	});
}
