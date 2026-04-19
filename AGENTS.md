# Repository Guidelines

## Project Structure & Module Organization

AsyncTalk is an Astro content site for a Chinese web development podcast. Source code lives in `src/`: pages in `src/pages`, layouts in `src/layouts`, shared UI in `src/components`, global styles in `src/global.css`, and content configuration in `src/content.config.ts`. Podcast episodes are MDX files in `src/content/posts` using names such as `ep59.mdx`. Episode media belongs under `src/assets/<episode>/` when imported by Astro; public static files live in `public/`.

## Build, Test, and Development Commands

Use pnpm, as pinned by `packageManager`.

- `pnpm dev`: start the Astro dev server at `http://localhost:4321`.
- `pnpm build`: run `astro check` and create the production build.
- `pnpm preview`: serve the production build locally for final inspection.
- `pnpm astro check`: type-check Astro, TypeScript, and content collection usage without building.

There is no dedicated test script; `pnpm build` is the primary verification command.

## Coding Style & Naming Conventions

The project uses Astro with TypeScript strict mode, React islands, MDX, and Tailwind CSS utilities. Follow existing formatting: two-space indentation in Astro/TS files, double quotes in most Astro imports and config files, and semicolons where nearby code uses them. Keep component filenames descriptive: preserve established PascalCase names such as `Player.astro` and `OpenGraph/OG.tsx`, and use lowercase hyphenated names where that pattern exists, such as `seo-tags.astro`.

## Content Guidelines

New podcast episodes should be added to `src/content/posts` with the next `ep<number>.mdx` filename and a matching `slug`, for example `/posts/ep60`. Keep required frontmatter aligned with `src/content.config.ts`: `title`, `author`, `publicationDate`, `categories`, and `status`. Optional platform fields include `xyzLink`, `draftLink`, `youtubeId`, and `biliUrl`. Prefer Chinese copy for user-facing content.

## Testing Guidelines

Before opening a PR, run `pnpm astro check` for quick validation and `pnpm build` for full production verification. For visual or content changes, also run `pnpm dev` and inspect the changed page, RSS-sensitive metadata, and generated Open Graph output. If a test framework is added later, document it here and in `package.json`.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit-style subjects, usually scoped: `feat(posts): add EP59 ... podcast episode` and `fix(astro): migrate to Astro 6 content collections API`. Match that style with short, imperative commit messages.

Pull requests should include a concise summary, affected pages or episodes, verification commands run, and screenshots for visible UI changes. Link related issues when available. For new episodes, confirm frontmatter completeness and embedded platform links.
