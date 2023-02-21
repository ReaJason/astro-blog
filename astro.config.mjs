import { defineConfig } from 'astro/config'
import Unocss from '@unocss/astro'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import presetAttributify from '@unocss/preset-attributify'
import presetTypography from '@unocss/preset-typography'
export default defineConfig({
  integrations: [
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetTypography(),
        presetIcons({
          scale: 1.2,
        }),
      ],
    }),
  ],
})
