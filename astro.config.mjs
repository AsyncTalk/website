import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://AsyncTalk.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx({
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "dracula"
    },
    // remarkPlugins: [remarkToc],
    // rehypePlugins: [rehypeMinifyHtml],
    remarkRehype: {
      footnoteLabel: "Footnotes"
    },
    gfm: false
  }), sitemap(), react()]
});