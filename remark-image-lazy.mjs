// remark-lazy-image.mjs
import { visit } from 'unist-util-visit';

export default function remarkLazyImage() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      // 添加属性到图片节点
      node.data = {
        hProperties: {
          loading: 'lazy',
          decoding: 'async',
        },
      };
    });
  };
}
