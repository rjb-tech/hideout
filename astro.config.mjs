import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { remarkReadingTime } from "./src/remark/remark-reading-time.mjs";
import { remarkGenerateTeaser } from "./src/remark/remark-generate-teaser.mjs";
import { remarkAlphabetizeTags } from "./src/remark/remark-alphabetize-tags.mjs";
// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      remarkGenerateTeaser,
      remarkAlphabetizeTags,
    ],
  },
});
