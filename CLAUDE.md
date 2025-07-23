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

5. **Styling**: Tailwind CSS v4 with custom configuration and Chinese font support (LXGWWenKai).

## Important Development Notes

- **No Testing Framework**: This project currently has no automated tests. When implementing features, manual testing is required.
- **Content Management**: New episodes should be added as MDX files in `src/content/posts/` following the existing naming pattern (epX.mdx).
- **Build Process**: Always run `pnpm astro check` before building to catch TypeScript errors in Astro components.
- **Episode Metadata**: Ensure all required frontmatter fields are properly filled when creating new episodes to maintain RSS feed compatibility.
- **Chinese Language**: All content and UI copy should be in Chinese. Pay attention to proper font rendering and character encoding.