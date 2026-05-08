# Coding Patterns & Standards

TopNetworks follows a unified set of coding standards across all Next.js, Astro, and React projects to ensure maintainability, performance, and cross-team collaboration.

## Language and Syntax

- **TypeScript First:** All new code must be written in TypeScript with `strict: true`. Avoid `any`; use strict typing and Zod schemas for validation.
- **ES Modules:** Use modern ES module imports (`import`/`export`).

## Next.js (App Router) Patterns

- **Server Components by Default:** Minimize client-side Javascript by using React Server Components. Only add `"use client"` when state, effects, or DOM interactivity is required.
- **Data Fetching:** Fetch data on the server when possible using Next.js `fetch` with appropriate caching strategies.
- **Routing:** Organize pages by feature or content type under the `app` directory. Use dynamic routes `[slug]` for MDX content.
- **MDX Content Pipeline:** Financial guides, articles, and reviews are written in MDX to interleave React components (e.g., comparison tables, calculators) within Markdown content.

## State Management

- **URL State:** Prefer the URL (query parameters) for filter state, search queries, and tab selections. This ensures shareability and better SEO.
- **React Context:** Use React Context sparingly, typically for global themes, user authentication state (NextAuth/Better Auth), or localization configurations.
- **Server State:** Use React Query or SWR for complex client-side data fetching and caching, though RSCs handle most initial loads.

## Performance

- **Image Optimization:** All images must use the Next.js `<Image>` component or equivalent Astro optimization. WebP is the mandated format for all production assets served from `media-topfinanzas-com`.
- **Core Web Vitals:** Keep LCP under 2.5s and CLS near zero. Load third-party ad scripts (e.g., System1) asynchronously and defer non-critical Javascript.

## Security

- **Authentication:** Use NextAuth.js or Better Auth for secure session management.
- **Environment Variables:** Never commit secrets. Access sensitive configurations exclusively on the server.

## Code Organization

```
src/
├── app/               # Next.js App Router (pages, layouts, API routes)
├── components/        # Reusable UI components
│   ├── ui/            # Base components (shadcn/ui, Radix)
│   └── shared/        # Cross-feature components
├── lib/               # Utility functions, API clients, constants
├── hooks/             # Custom React hooks
└── content/           # MDX files and structured data
```
