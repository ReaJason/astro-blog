import { defineConfig } from "astro/config";
import Unocss from "@unocss/astro";
import presetUno from "@unocss/preset-uno";
import presetIcons from "@unocss/preset-icons";

export default defineConfig({
  integrations: [
    Unocss({
      presets: [presetUno(), presetIcons()],
    }),
  ],
});
