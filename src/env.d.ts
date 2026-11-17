/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ALGOLIA_APP_ID?: string;
  readonly PUBLIC_ALGOLIA_SEARCH_KEY?: string;
  readonly PUBLIC_ALGOLIA_INDEX_NAME?: string;
}
