import rss from '@astrojs/rss';
import { getCollection } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function get(context) {
  const blogs = await getCollection('blog')
  const posts = blogs
    .filter((blog) => !blog.data.draft)
    .filter((blog) => !blog.data.hide)
    .sort((a, b) => {
      return a.data?.date > b.data?.date ? -1 : 1
    })
  return rss({
    title: 'ReaJason’s Blog',
    description: 'build for fun, build for life',
    site: context.site,
    items: posts.map(post => ({
      link: `/writing/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body)),
      title: post.data.title,
      pubDate: post.data.date,
    })),
    customData: `<language>en-us</language>`
  });
}
