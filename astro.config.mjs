import { defineConfig } from 'astro/config'
import Unocss from '@unocss/astro'
import presetIcons from '@unocss/preset-icons'
import presetAttributify from '@unocss/preset-attributify'
import presetTypography from '@unocss/preset-typography'
import presetWind4 from '@unocss/preset-wind4'
import sitemap from '@astrojs/sitemap'
import remarkLazyImage from './remark-image-lazy'

// https://astro.build/config
export default defineConfig({
  site: 'https://reajason.eu.org',
  prefetch: true,
  markdown: {
    gfm: true,
    remarkPlugins: [remarkLazyImage]
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
        ['filter-blur', { 'backdrop-filter': 'saturate(180%) blur(20px)' }],
      ],
    }),
    sitemap(),
  ],
})
