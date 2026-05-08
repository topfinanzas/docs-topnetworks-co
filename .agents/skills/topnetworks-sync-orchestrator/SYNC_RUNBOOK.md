# TopNetworks Sync Runbook

## Purpose

Use this runbook to propagate shared improvements across `topfinanzas-us-next`, `uk-topfinanzas-com`, `topfinanzas-mx-next`, and `budgetbee-next` without flattening the differences that make each market and brand correct.

## Branch model (Local vs. Remote)

- **Local Development**: `dev` is the local development branch for every synchronized property. All feature work must be completed on `dev`. When a feature is approved for deployment, local changes on `dev` are merged/synchronized with the local `main` branch (and the repository backup branch) and pushed to origin. The local working tree must always be returned to `dev` after synchronization so development can continue.
- **Remote Production**: The remote server (Ubuntu/Apache2) uses `main` as its production branch. The `deploy_update.sh` script runs directly on the remote server, pulls the `main` branch from origin, and restarts the application. It does NOT do branch synchronization.

## Standard workflow

1. Inventory the target repos and establish standards.
   - Always treat the `docs-topnetworks-co` repository (`/Users/macbookpro/GitHub/docs-topnetworks-co`) as the single source of truth for the technology stack, architecture, workflows, and operational standards. Use its generated context files (like `public/llms-full.txt`) for LLM context retrieval.
   - Run `node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs list`.
   - Run `node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs status`.
   - Inspect relevant files in all repos before editing.
2. Define the source pattern.
   - If a source repo is named, inspect its implementation and related docs.
   - If no source repo is named, use the strongest current implementation as baseline after comparing all repos.
3. Create a propagation matrix.
   - Columns: repository, files, shared change, localized adaptation, validation command, risk.
   - Treat the matrix as the implementation checklist.
4. Implement carefully.
   - Preserve imports, formatting, routing, analytics, ad behavior, and component boundaries.
   - Avoid broad rewrites when a surgical patch is enough.
5. Validate.
   - For code changes, run `npm run lint` and `npm run build` per changed repo when practical.
   - For documentation-only changes, validate files exist and run CLI dry-run checks.
6. Summarize.
   - Report aligned files, intentional differences, validation results, and follow-ups.

## Task classes

### SEO, GEO, and LLM indexing

Usually shared:
- JSON-LD rendering pattern.
- Metadata helper shape.
- Robots and sitemap strategy.
- `llms.txt` manifest structure.
- Noindex handling for quiz, recommender, invite, test, and API routes.

Always localize:
- Canonical domain.
- Locale and OpenGraph locale.
- Language alternates.
- Currency and schema offers.
- Market-specific compliance copy.
- Route names for Mexico.
- BudgetBee brand voice and positioning.

### Shared components and layouts

Usually shared:
- Server/client component split pattern.
- Shadcn/Radix component architecture.
- Accessibility fixes.
- Logger migration patterns.
- Image optimization patterns.

Always localize:
- Header and footer navigation labels.
- CTA copy.
- Product/category naming.
- Brand colors and imagery.
- Market disclosures.

### Analytics, ads, and conversion tracking

Usually shared:
- UTM persistence architecture.
- GTM loading order.
- AdZep/TopAds SPA activation pattern.
- No manual ad activation outside approved handler components.

Always localize:
- Domain/network codes.
- Campaign naming prefixes.
- Email provider lists and sender identity.
- Market-specific conversion routes.

### Content and listing synchronization

Usually shared:
- Blog/category listing data shape.
- Related article/sidebar patterns.
- Search index update procedure.
- Article semantic markup.

Always localize:
- Language and tone.
- Slugs and route families.
- Product availability.
- Regulatory disclaimers.
- BudgetBee youth-oriented framing.

### Dependency and script updates

Usually shared:
- Next.js, React, Tailwind, Radix, and TypeScript conventions.
- Lint/build command expectations.
- PM2 deployment script pattern.

Always verify:
- `package.json` script names before invoking commands.
- Lockfile state before dependency changes.
- Whether a repository intentionally pins a different package version.

### Synchronized deployment readiness

Use the deployment-readiness CLI instead of invoking repo-local deployment scripts directly:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs audit-scripts
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs preflight --dry-run
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs preflight --execute
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs deployment-plan
```

The workflow is:

1. Audit script risk first with `audit-scripts`.
2. Run `preflight --execute` for the deployment target repos.
3. Fix every `AGENT_ACTION_REQUIRED` item before deployment.
4. Generate a `deployment-plan` only after validation passes.
5. Confirm the **local** deployment preparation flow will synchronize `dev`, `main`, and the repository backup branch, push changes to origin, and then return the local codebase to `dev`.
6. Use the server-side `sudo bash ./scripts/deploy_update.sh` command on the remote server only after explicit user authorization and local branch pushes are complete.

The deployment-readiness CLI never runs `sudo`, PM2, branch synchronization, git commits, git pushes, or `deploy_update.sh`. It only reports the sequence that a human or authorized deployment agent can run after successful preflight.

## Guardrails

- Do not copy `.env*`, credentials, generated files, `node_modules`, `.next`, logs, or deployment artifacts.
- Do not run deployment scripts during sync implementation.
- Do not commit or push unless explicitly requested.
- Do not overwrite localized copy with another market’s language.
- Do not normalize BudgetBee into TopFinanzas branding.
- Do not assume US is always correct; compare all repos and inspect validation reports.
- Do not answer interactive `Y/N` shell prompts as part of deployment or branch synchronization. Use orchestrator-scoped dry-run and execute flags instead.
- Do not deploy when lint, formatting checks, or builds fail. Ask the coding agent to fix the affected codebase first.
- Do not leave the local checkout on `main` or a backup branch after deployment; `dev` is the required post-deployment branch.

## CLI examples

List configured repositories:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs list
```

Show git status for all configured repositories:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs status
```

Check expected shared architecture file presence:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs parity
```

Show validation commands without running them:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs validate --dry-run
```

Run an allowlisted script after review:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs run lint --execute
```

Audit deployment scripts:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs audit-scripts
```

Run deployment readiness preflight:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs preflight --execute
```

Print the post-validation deployment plan:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs deployment-plan
```
