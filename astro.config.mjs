import { defineConfig } from 'astro/config'
import Unocss from '@unocss/astro'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  integrations: [
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
        }),
      ],
    }),
  ],
})
