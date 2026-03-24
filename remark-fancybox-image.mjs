// Wrap markdown images for Fancybox (declarative usage) + native lazy-loading on <img>.
// https://fancyapps.com/fancybox/get-started/usage/
import { visit } from "unist-util-visit";

export default function remarkFancyboxImage() {
	return (tree) => {
		visit(tree, "image", (node, index, parent) => {
			if (!parent || typeof index !== "number" || !Array.isArray(parent.children)) {
				return;
			}
			// Already a linked image, e.g. [![alt](img)](url)
			if (parent.type === "link") {
				return;
			}

			const prevProps = node.data?.hProperties ?? {};

			const innerImage = {
				type: "image",
				url: node.url,
				alt: node.alt,
				title: node.title ?? null,
				data: {
					...node.data,
					hProperties: {
						...prevProps,
						loading: "lazy",
						decoding: "async",
					},
				},
			};

			const linkNode = {
				type: "link",
				url: node.url,
				title: node.title ?? null,
				children: [innerImage],
				data: {
					hProperties: {
						"data-fancybox": "gallery",
						...(node.alt ? { "data-caption": node.alt } : {}),
					},
				},
			};

			parent.children[index] = linkNode;
		});
	};
}
