import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
// import remarkToc from "remark-toc";
// import rehypeMinifyHtml from "rehype-minify-html";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://AsyncTalk.com",
  integrations: [
    tailwind(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "dracula" },
      // remarkPlugins: [remarkToc],
      // rehypePlugins: [rehypeMinifyHtml],
      remarkRehype: { footnoteLabel: "Footnotes" },
      gfm: false,
    }),
    sitemap(),
  ],
});
