# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AsyncTalk is a Chinese-language web development podcast website built with Astro 5.11.0, a modern static site generator. The site serves podcast episodes with RSS feed support and is distributed on platforms like 小宇宙 and Apple Podcasts.

## Key Commands

```bash
# Development
pnpm dev          # Start development server at http://localhost:4321
pnpm build        # Type-check and build for production
pnpm preview      # Preview production build locally

# Code Quality
pnpm astro check  # Type-check Astro components
```

## Architecture Overview

This is a content-driven static site using Astro's content collections system:

1. **Podcast Episodes** (`src/content/posts/`): Each episode is an MDX file (ep0.mdx - ep47.mdx) with structured frontmatter containing metadata like title, author, date, duration, and podcast links.

2. **Component Structure**:
   - Astro components for layout and static content
   - React components for interactive features (player, dynamic elements)
   - Custom markdown components in `src/components/markdown/`
   - SEO components including Open Graph image generation with Satori

3. **Content Schema** (`src/content/config.ts`): Defines the structure for podcast episodes with fields for title, author, categories, status (draft/pending/published), and podcast-specific metadata like xyzLink and duration.

4. **Dynamic Routing**: Episodes are served through dynamic routes at `/posts/[...slug]` with automatic RSS feed generation at `/rss.xml`.

5. **Styling**: Tailwind CSS v4. Theme tokens live in `src/global.css` as CSS variables exposed through `@theme inline` (`bg-page`, `text-ink`, `text-soft`, `text-mute`, `border-line`, `text-primary`, `font-display`…). Light is the default and dark applies only via the system setting (`prefers-color-scheme`, same as Tailwind's `dark:` variant) — there is no theme toggle and none should be added. Use the semantic utilities instead of hard-coded `text-white`/`bg-black`. Headings use LXGW WenKai, self-hosted from the `lxgw-wenkai-webfont` package.

6. **Episode list pagination**: `/posts/` is page 1 and `/posts/page/<n>/` the rest, both rendered by `src/components/EpisodeIndexPage.astro`. Page size is `POSTS_PAGE_SIZE` in `src/constants.ts`; `scripts/check-seo.mjs` carries the same number to compute the expected page count, so change both together.

7. **Search (Algolia)**: `src/lib/search.ts` turns each published episode into one Algolia record, served at build time as `/search-index.json`. `pnpm search:index` (`scripts/algolia-index.mjs`) uploads `dist/search-index.json`, replacing the whole index and its settings; `--dry-run` only validates. `.github/workflows/algolia-index.yml` runs the dry run on pull requests and the upload on pushes to `main` (repo variable `ALGOLIA_APP_ID`, secret `ALGOLIA_ADMIN_API_KEY`). The header search dialog (`src/components/Search.tsx`) only renders when `PUBLIC_ALGOLIA_APP_ID` and `PUBLIC_ALGOLIA_SEARCH_KEY` are set at build time. The default index name `asynctalk_posts` lives in both `src/lib/search.ts` and the script, so change both together.

## Important Development Notes

- **No Testing Framework**: This project currently has no automated tests. When implementing features, manual testing is required.
- **Content Management**: New episodes should be added as MDX files in `src/content/posts/` following the existing naming pattern (epX.mdx).
- **Episode Media**: Cover art and subtitles are declared in frontmatter, both optional. `cover` is a path relative to the MDX file (e.g. `../../assets/ep73/cover.png`), resolved by the schema's `image()` helper; it renders beside the title at its natural aspect ratio and feeds JSON-LD `image` plus the RSS `<itunes:image>`. `srt` is a path under `public/` (e.g. `/subtitles/ep73.srt`), parsed at build time into an on-page 文字稿 section, a download link, and JSON-LD `transcript` — a declared file that is missing fails the build.
- **Episode Timeline**: Chapters live in frontmatter as `timeline: [{ time: "MM:SS", title }]`, not in the MDX body. `src/components/EpisodeTimeline.astro` renders them as a card beside the shownotes (below them on narrow screens). Reference links go in their own `### 🔗 参考链接` / `相关链接` section as a list.
- **Episode Credit**: The BGM or similar attribution line goes in frontmatter as `credit: "BGM by …"`, not in the body. The page prints it last in the shownotes column, small and muted.
- **Homepage logos and avatars**: Each 收听渠道 card shows its brand logo from `src/components/ChannelLogo.astro`, picked by the `type` on `listenChannels` in `src/constants.ts`. Each 主播 card shows `src/assets/avatars/<author id>.{jpg,png,webp}` when that file exists, otherwise the host's initial on their `color`.
- **Build Process**: Always run `pnpm astro check` before building to catch TypeScript errors in Astro components.
- **Episode Metadata**: Ensure all required frontmatter fields are properly filled when creating new episodes to maintain RSS feed compatibility.
- **Chinese Language**: All content and UI copy should be in Chinese. Pay attention to proper font rendering and character encoding.