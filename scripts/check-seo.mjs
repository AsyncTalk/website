import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const distDir = path.join(projectRoot, "dist");
const contentDir = path.join(projectRoot, "src/content/posts");
const failures = [];

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function matches(value, pattern) {
  return [...value.matchAll(pattern)];
}

function attribute(tag, name) {
  return tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(target) : [target];
    }),
  );
  return nested.flat();
}

const contentFiles = (await readdir(contentDir))
  .filter((file) => file.endsWith(".mdx"))
  .sort();
const publishedEpisodes = [];
const excerpts = [];

for (const file of contentFiles) {
  const source = await readFile(path.join(contentDir, file), "utf8");
  const status = source.match(/^status:\s*(.+)$/m)?.[1]?.trim();
  const excerpt = source
    .match(/^excerpt:\s*(.+)$/m)?.[1]
    ?.trim()
    .replace(/^"|"$/g, "");

  if (status === "published") {
    publishedEpisodes.push(file.replace(/\.mdx$/, ""));
  }

  expect(Boolean(excerpt), `${file}: missing excerpt`);
  if (excerpt) {
    const length = [...excerpt].length;
    expect(length >= 40 && length <= 160, `${file}: excerpt length is ${length}`);
    excerpts.push(excerpt);
  }
}

expect(
  new Set(excerpts).size === excerpts.length,
  "Episode excerpts must be unique",
);

const htmlFiles = (await listFiles(distDir)).filter((file) => file.endsWith(".html"));
expect(
  htmlFiles.length === publishedEpisodes.length + 2,
  `Expected ${publishedEpisodes.length + 2} public HTML pages, found ${htmlFiles.length}`,
);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const label = path.relative(distDir, file);
  const titles = matches(html, /<title>[^<]+<\/title>/gi);
  const descriptions = matches(
    html,
    /<meta\s+name=["']description["'][^>]*>/gi,
  );
  const canonicals = matches(html, /<link\s+rel=["']canonical["'][^>]*>/gi);
  const h1s = matches(html, /<h1(?:\s|>)/gi);
  const ogUrls = matches(html, /<meta\s+property=["']og:url["'][^>]*>/gi);
  const ogImages = matches(html, /<meta\s+property=["']og:image["'][^>]*>/gi);

  expect(/<html\s+lang=["']zh-CN["']/i.test(html), `${label}: incorrect html lang`);
  expect(titles.length === 1, `${label}: expected one title, found ${titles.length}`);
  expect(
    descriptions.length === 1,
    `${label}: expected one description, found ${descriptions.length}`,
  );
  expect(
    canonicals.length === 1,
    `${label}: expected one canonical, found ${canonicals.length}`,
  );
  expect(h1s.length === 1, `${label}: expected one h1, found ${h1s.length}`);
  expect(ogUrls.length === 1, `${label}: expected one og:url`);
  expect(ogImages.length === 1, `${label}: expected one og:image`);
  expect(!/Astro description/.test(html), `${label}: placeholder description remains`);
  expect(
    !/<meta\s+name=["']keywords?["']/i.test(html),
    `${label}: obsolete meta keywords remains`,
  );

  const canonical = canonicals[0] ? attribute(canonicals[0][0], "href") : undefined;
  const ogUrl = ogUrls[0] ? attribute(ogUrls[0][0], "content") : undefined;
  const ogImage = ogImages[0] ? attribute(ogImages[0][0], "content") : undefined;
  expect(
    canonical?.startsWith("https://asynctalk.com/") && canonical.endsWith("/"),
    `${label}: canonical must be an absolute trailing-slash URL`,
  );
  expect(ogUrl === canonical, `${label}: og:url must equal canonical`);
  expect(
    ogImage?.startsWith("https://asynctalk.com/"),
    `${label}: og:image must be absolute`,
  );

  const jsonLdBlocks = matches(
    html,
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  const isHome = label === "index.html";
  const isEpisode = label.startsWith(`posts${path.sep}`) && label !== path.join("posts", "index.html");

  if (isHome || isEpisode) {
    expect(jsonLdBlocks.length === 1, `${label}: expected one JSON-LD block`);
    if (jsonLdBlocks[0]) {
      try {
        const data = JSON.parse(jsonLdBlocks[0][1]);
        expect(data["@context"] === "https://schema.org", `${label}: invalid JSON-LD context`);
        if (isHome) {
          const types = new Set(data["@graph"]?.map((node) => node["@type"]));
          expect(types.has("WebSite"), `${label}: missing WebSite data`);
          expect(types.has("PodcastSeries"), `${label}: missing PodcastSeries data`);
          expect(types.has("Organization"), `${label}: missing Organization data`);
        } else {
          expect(data["@type"] === "PodcastEpisode", `${label}: missing PodcastEpisode data`);
          expect(Boolean(data.description), `${label}: PodcastEpisode description missing`);
          expect(Boolean(data.datePublished), `${label}: PodcastEpisode date missing`);
        }
      } catch (error) {
        failures.push(`${label}: invalid JSON-LD (${error.message})`);
      }
    }
  }
}

const sitemap = await readFile(path.join(distDir, "sitemap-0.xml"), "utf8");
const sitemapUrls = matches(sitemap, /<loc>([^<]+)<\/loc>/g).map((match) => match[1]);
expect(
  sitemapUrls.length === publishedEpisodes.length + 2,
  `Expected ${publishedEpisodes.length + 2} sitemap URLs, found ${sitemapUrls.length}`,
);
expect(
  sitemapUrls.every((url) => url.startsWith("https://asynctalk.com/") && url.endsWith("/")),
  "Sitemap URLs must be absolute and use trailing slashes",
);
expect(!sitemap.includes("index-legacy"), "Legacy page must not appear in sitemap");
expect(!sitemap.includes("og-preview"), "OG preview must not appear in sitemap");

const rss = await readFile(path.join(distDir, "rss.xml"), "utf8");
const rssItems = matches(rss, /<item>[\s\S]*?<\/item>/g);
expect(
  rssItems.length === publishedEpisodes.length,
  `Expected ${publishedEpisodes.length} RSS items, found ${rssItems.length}`,
);
for (const [index, item] of rssItems.entries()) {
  expect(/<description>/.test(item[0]), `RSS item ${index + 1}: description missing`);
  expect(/<guid\s+isPermaLink="true">/.test(item[0]), `RSS item ${index + 1}: guid missing`);
  expect(/<author>/.test(item[0]), `RSS item ${index + 1}: author missing`);
}

const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
expect(!/Disallow:\s*\/posts\/\*-og\.png/.test(robots), "robots.txt blocks OG images");
expect(
  robots.includes("Sitemap: https://asynctalk.com/sitemap-index.xml"),
  "robots.txt sitemap URL is missing",
);

if (failures.length > 0) {
  console.error(`SEO validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `SEO validation passed: ${htmlFiles.length} HTML pages, ${sitemapUrls.length} sitemap URLs, ${rssItems.length} RSS items.`,
  );
}
