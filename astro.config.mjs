import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import Unocss from "@unocss/astro";
import presetAttributify from "@unocss/preset-attributify";
import presetIcons from "@unocss/preset-icons";
import presetTypography from "@unocss/preset-typography";
import presetWind4 from "@unocss/preset-wind4";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkLazyImage from "./remark-image-lazy";

// https://astro.build/config
export default defineConfig({
	site: "https://reajason.eu.org",
	prefetch: true,
	markdown: {
		rehypePlugins: [
			[rehypeHeadingIds, { headingIdCompat: true }],
			[
				rehypeAutolinkHeadings,
				{
					behavior: "wrap",
					properties: {
						class: "heading-link"
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
							class: "heading-link-icon",
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
			injectReset: true,
			presets: [
				presetWind4(),
				presetAttributify(),
				presetTypography(),
				presetIcons({
					scale: 1,
				}),
			],
			rules: [
				["filter-blur", { "backdrop-filter": "saturate(180%) blur(20px)" }],
			],
		}),
		sitemap(),
	],
});
