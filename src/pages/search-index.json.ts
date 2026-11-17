import type { APIRoute } from "astro";
import { getSearchRecords } from "../lib/search";

// Built into dist/search-index.json; scripts/algolia-index.mjs uploads it to Algolia.
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await getSearchRecords()), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
