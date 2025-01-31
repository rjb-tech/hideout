import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { remarkReadingTime } from "./src/remark/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
