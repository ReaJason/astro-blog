import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it';
import { sortedPost } from 'src/utils';
const parser = new MarkdownIt();

export async function get(context) {
  const blogs = await sortedPost()
  return rss({
    title: 'ReaJason’s Blog',
    description: 'build for fun, build for life',
    site: context.site,
    items: blogs.map(post => ({
      link: `/writing/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body)),
      title: post.data.title,
      pubDate: post.data.date,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss/styles.xsl',
  });
}
