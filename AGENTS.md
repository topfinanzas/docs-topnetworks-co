# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commonly Used Commands

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`
- **Fetch Media Assets**: `./fetch-media.sh` (Downloads logos and assets from the CDN and sibling repositories into `public/media/`)
- **Analyze Sibling Packages**: `./analyze.sh` (Helper script that scans dependencies of other TopNetworks projects on the local machine)

*Note: There is currently no testing framework (e.g., Vitest or Jest) installed in this repository.*

## High-Level Architecture & Structure

This repository is a static documentation site built using **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS v4**, deployed as a Single Page Application (SPA) on Vercel.

### Dynamic Markdown Content System
The core mechanism of this site is how it handles content, effectively acting as a bespoke static site generator during runtime:
- **Storage**: All documentation pages are authored and stored as Markdown files in `src/pages/*.md`.
- **Loading**: `src/pages/DocPage.tsx` uses Vite's `import.meta.glob` to pre-load and dynamically import the raw markdown content based on the React Router `:pageId` parameter. For example, the route `/architecture` loads `architecture.md`.
- **Rendering**: Markdown is parsed by `react-markdown`. It utilizes `remark-gfm` for GitHub Flavored Markdown features (like tables), `rehype-raw` for inline HTML, and `rehype-highlight` for syntax highlighting.
- **Styling**: `DocPage.tsx` customizes the markdown rendering by mapping standard HTML tags (like `h1`, `p`, `a`, `code`) to React components with specific Tailwind CSS utility classes to match the brand identity.

### Routing & Navigation
- **Routes**: Client-side routing is managed by `react-router` in `src/App.tsx`. 
- **Layout**: `src/components/Layout.tsx` defines the persistent application shell (sidebar, navigation links, and mobile menu) and wraps the `Outlet` where `DocPage` is rendered. The navigation structure is hardcoded within this file.
- **SPA Fallback**: `vercel.json` provides the rewrite rule to route all requests to `index.html`, ensuring React Router can handle direct URL access without 404 errors.