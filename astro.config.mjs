import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://asynctalk.com/",
  trailingSlash: "always",
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "dracula",
      },
      processor: satteri({
        features: { gfm: false },
      }),
    }),
    sitemap(),
    react(),
  ],
});
