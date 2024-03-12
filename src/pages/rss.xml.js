import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it';
import { siteConfig } from '../configs/site'
import { sortedPost } from "../utils"
const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await sortedPost()
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
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
