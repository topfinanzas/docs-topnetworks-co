# Processes & Workflows

## Local Development Lifecycle

1. **Branching:** `dev` is the local development branch for each synchronized property. All feature work must be completed on `dev`.
2. **Sync Orchestration:** The `topnetworks-sync-orchestrator` skill manages multi-repo parity (SEO/GEO, shared components) across the four main properties without compromising market-specific localization.
3. **Deployment Prep:** The approved feature state is locally merged/synchronized with `main` and pushed to origin. The local working tree must always be returned to `dev` after synchronization.

## Deployment Workflow

1. **Local Preflight:** Run `scripts/topnetworks-deploy.mjs preflight --execute` to audit git/deploy scripts and run validation.
2. **Git Workflow:** Run `bash ./scripts/git-workflow.sh "$(cat lib/documents/commit-message.txt)"` locally to push changes to `main`.
3. **Remote Update:** The server-side deployment script (`scripts/deploy_update.sh`) operates strictly on the remote server (`34.45.27.247`), pulling the latest `main` changes from origin, building the app, and restarting PM2.
   - Remote directories map to local projects:
     - `topfinanzas-us-next` -> `/var/www/html/topfinanzas-us-next`
     - `uk-topfinanzas-com` -> `/var/www/html/uk`
     - `topfinanzas-mx-next` -> `/var/www/html/topfinanzas-mx-next`
     - `budgetbee-next` -> `/var/www/html/budgetbee-next`

## Arbitrage Campaign Management

1. **Campaign Launch:** Paid traffic campaigns are launched targeting specific verticals (e.g., credit cards) with strict CPA limits.
2. **Spread Monitoring:** The Arbitrage Manager Dashboard constantly evaluates the Spread (`Revenue per Session - Cost per Session`) hourly.
3. **Optimization Actions:** If spreads compress, traffic routing is dynamically adjusted or campaigns are automatically paused to prevent negative ROI.

## Content & Email Generation

1. **Content Briefs:** Defined using the TopNetworks playbook.
2. **Generation:** Vertex AI generates the first draft via `EmailGenius` or `SocialMediaGenius`.
3. **Review & Dispatch:** The content is reviewed, approved, and dispatched (e.g., via ActiveCampaign or ConvertKit).
