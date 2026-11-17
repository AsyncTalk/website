// Uploads dist/search-index.json (written by `astro build`) to Algolia.
//
//   node scripts/algolia-index.mjs            replace the index contents
//   node scripts/algolia-index.mjs --dry-run  validate the records only
//
// Env: ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, ALGOLIA_INDEX_NAME (optional).
import { readFile } from "node:fs/promises";
import path from "node:path";
import { algoliasearch } from "algoliasearch";

// Keep src/lib/search.ts (DEFAULT_SEARCH_INDEX) in sync.
const DEFAULT_INDEX_NAME = "asynctalk_posts";
// Algolia's free plan rejects records over 10 KB.
const MAX_RECORD_BYTES = 10_000;

const dryRun = process.argv.includes("--dry-run");
const projectRoot = path.resolve(import.meta.dirname, "..");
const indexFile = path.join(projectRoot, "dist/search-index.json");

function fail(message) {
  console.error(`Algolia index failed: ${message}`);
  process.exit(1);
}

let records;
try {
  records = JSON.parse(await readFile(indexFile, "utf8"));
} catch (error) {
  fail(`cannot read ${path.relative(projectRoot, indexFile)} — run \`pnpm build\` first (${error.message})`);
}

if (!Array.isArray(records) || records.length === 0) {
  // replaceAllObjects with an empty list would wipe the live index.
  fail("no records to upload");
}

const ids = new Set();
let largest = 0;
for (const record of records) {
  if (!record.objectID || !record.url || !record.title) {
    fail(`record is missing objectID, url or title: ${JSON.stringify(record).slice(0, 120)}`);
  }
  if (ids.has(record.objectID)) {
    fail(`duplicate objectID ${record.objectID}`);
  }
  ids.add(record.objectID);

  const bytes = Buffer.byteLength(JSON.stringify(record));
  largest = Math.max(largest, bytes);
  if (bytes > MAX_RECORD_BYTES) {
    fail(`${record.objectID} is ${bytes} bytes, over the ${MAX_RECORD_BYTES} byte record limit`);
  }
}

console.log(`${records.length} records, largest ${largest} bytes`);

if (dryRun) {
  console.log("Dry run: nothing uploaded.");
  process.exit(0);
}

const appId = process.env.ALGOLIA_APP_ID || process.env.PUBLIC_ALGOLIA_APP_ID;
const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName =
  process.env.ALGOLIA_INDEX_NAME ||
  process.env.PUBLIC_ALGOLIA_INDEX_NAME ||
  DEFAULT_INDEX_NAME;

if (!appId || !adminKey) {
  fail("ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY must be set");
}

const client = algoliasearch(appId, adminKey);

// Settings go first: replaceAllObjects carries them over to the new index.
const settings = await client.setSettings({
  indexName,
  indexSettings: {
    searchableAttributes: [
      "title",
      "unordered(subtitle)",
      "unordered(categories)",
      "unordered(excerpt)",
      "unordered(chapters)",
      "unordered(content)",
    ],
    customRanking: ["desc(publishedAt)"],
    attributesForFaceting: ["searchable(categories)", "season"],
    indexLanguages: ["zh", "en"],
    queryLanguages: ["zh", "en"],
    attributesToHighlight: ["title", "subtitle", "categories"],
    attributesToSnippet: ["content:30", "excerpt:30"],
    snippetEllipsisText: "…",
  },
});
await client.waitForTask({ indexName, taskID: settings.taskID });

await client.replaceAllObjects({ indexName, objects: records });

console.log(`Uploaded ${records.length} records to "${indexName}".`);
