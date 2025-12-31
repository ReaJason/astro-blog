import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import Unocss from "@unocss/astro";
import presetIcons from "@unocss/preset-icons";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkLazyImage from "./remark-image-lazy";

// https://astro.build/config
export default defineConfig({
	site: "https://reajason.eu.org",
	prefetch: true,

	markdown: {
		rehypePlugins: [
			rehypeHeadingIds,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "wrap",
					headingProperties: {
						class: "flex scroll-m-28 flex-row items-center gap-2",
					},
					properties: {
						class: "group no-underline color-inherit inline-flex items-center gap-2",
					},
					content: {
						type: "element",
						tagName: "svg",
						properties: {
							xmlns: "http://www.w3.org/2000/svg",
							width: 24,
							height: 24,
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: 2,
							strokeLinecap: "round",
							strokeLinejoin: "round",
							ariaHidden: "true",
							class: "size-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
						},
						children: [
							{
								type: "element",
								tagName: "path",
								properties: {
									d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
								},
							},
							{
								type: "element",
								tagName: "path",
								properties: {
									d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
								},
							},
						],
					},
				},
			],
		],
		remarkPlugins: [remarkLazyImage],
	},
	integrations: [
		Unocss({
			presets: [
				presetIcons({
					scale: 1,
				}),
			],
		}),
		sitemap(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
