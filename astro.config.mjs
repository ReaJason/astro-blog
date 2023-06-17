import { defineConfig } from 'astro/config'
import Unocss from '@unocss/astro'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import presetAttributify from '@unocss/preset-attributify'
import presetTypography from '@unocss/preset-typography'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://reajason.eu.org',
  integrations: [
    Unocss({
      injectReset: true,
      presets: [
        presetUno(),
        presetAttributify(),
        presetTypography(),
        presetIcons({
          scale: 1.2,
        }),
      ],
      rules: [
        ['filter-blur', { 'backdrop-filter': 'saturate(180%) blur(20px)' }],
      ],
    }),
    sitemap(),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: [
          "rss.xml.js"
      ]
      }
    }
  }
})
