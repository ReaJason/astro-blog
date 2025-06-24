import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it';
import { siteConfig } from '../configs/site'
import { sortPost } from "../utils"
import { getCollection } from "astro:content"
const parser = new MarkdownIt();

export async function GET(context) {
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: sortPost(await getCollection("blog")).map(post => ({
      link: `/writing/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body)),
      title: post.data.title,
      pubDate: post.data.date,
    })),
    customData: `<language>en-us</language>`
  });
}
