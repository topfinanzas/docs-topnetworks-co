---
name: topnetworks-sync-orchestrator
description: Coordinate synchronized development across TopNetworks Next.js financial properties. Use this skill whenever a task should be propagated, compared, validated, or kept in parity across topfinanzas-us-next, uk-topfinanzas-com, topfinanzas-mx-next, and budgetbee-next, especially SEO/GEO/LLM indexing, shared components, analytics, ads, content structure, scripts, or documentation changes.
---

# TopNetworks Sync Orchestrator

Use this skill to manage multi-repo parity across the local TopNetworks Next.js properties while preserving market-specific localization, compliance, and brand requirements.

## Core resources

- The `docs-topnetworks-co` repository (`/Users/macbookpro/GitHub/docs-topnetworks-co`) is the single source of truth for TopNetworks Inc.'s technology stack, architecture, workflows, and operational standards. Its generated context files (`public/llms-full.txt` and `public/llms.txt`) should be consulted for architectural decisions, shared component patterns, and brand guidelines.
- `repositories.json` is the source of truth for repository paths, markets, domains, languages, validation commands, and adaptation rules.
- `SYNC_RUNBOOK.md` describes the propagation workflow, task classes, guardrails, and validation expectations.
- `scripts/topnetworks-sync.mjs` provides safe deterministic commands for listing repositories, checking status, auditing file parity, and running allowlisted validation scripts.
- `scripts/topnetworks-deploy.mjs` provides the synchronized deployment-readiness workflow. It audits git/deploy scripts, runs local preflight validation, and prints deployment plans without running production deployment commands.

Read `repositories.json` before changing any target repository. Read `SYNC_RUNBOOK.md` before executing a synchronized change.

## Branch policy (Local vs. Remote)

It is CRITICAL to distinguish the local development lifecycle from the remote production lifecycle:

- **Local Development**: `dev` is the local development branch for each synchronized property. All feature work must be completed on `dev`. To prepare for deployment, the approved feature state is locally merged/synchronized with `main` (and the repository backup branch) and pushed to origin. The local working tree must always be returned to `dev` after synchronization so development can continue. The local `main` branch should ONLY be touched to push deployment updates.
- **Remote Production (Ubuntu Server)**: `main` is the production branch. The server-side deployment script (`scripts/deploy_update.sh`) operates strictly on the remote server, pulling the latest `main` changes from origin, building the app, and restarting PM2. Remote scripts do NOT handle local branch synchronization (`dev` -> `main`).

## Operating model

Follow this sequence for every sync task:

1. Establish the source of truth.
   - Consult the `docs-topnetworks-co` documentation site (`public/llms-full.txt`) for authoritative guidance on the technology stack, architecture, shared components, and operational standards.
   - Identify whether the change originates from one repository, a user instruction, or a new shared standard.
   - Inspect the current implementation in all four repositories before editing.
2. Classify the change.
   - Shared architecture: can be propagated with minimal adaptation.
   - Market-localized: requires language, currency, domain, route, disclosure, or regulatory adaptation.
   - Brand-localized: requires visual identity, voice, imagery, or audience adaptation.
   - Repo-specific: should not be propagated unless the user explicitly asks.
3. Build a propagation matrix.
   - For each repository, list target files, expected adaptation, validation command, and risk level.
   - Do not blindly copy code or text across markets.
4. Apply changes incrementally.
   - Prefer small, reviewable diffs.
   - Preserve existing local conventions and app structure.
   - Keep shared patterns aligned while leaving localized constants and copy intact.
5. Validate per repository.
   - At minimum, run the commands configured in `repositories.json` when practical.
   - For documentation-only changes, validate file existence and manifest/CLI behavior.
6. Report divergence.
   - Summarize what is now aligned.
   - Call out intentional differences, skipped repositories, and validation failures.

## Deployment readiness model

Use `scripts/topnetworks-deploy.mjs` for synchronized deployment preparation. Existing repo-local `scripts/deploy_update.sh` files are low-level server commands, not the agent's default deployment interface.

Before any deployment request:

1. Run `audit-scripts` to inspect the four repositories for interactive prompts, unsafe merge handling, missing validation gates, and server-only commands.
2. Run `preflight --execute` for every repository intended for deployment.
3. If preflight prints `AGENT_ACTION_REQUIRED`, fix the affected codebase before deployment.
4. Only produce or run a deployment command after explicit user natural-language authorization.
5. Ensure the approved **local** deployment preparation process synchronizes `dev`, `main`, and the repository backup branch, pushes to origin, and then returns the working tree to `dev`.
6. Only instruct or provide the remote `deploy_update.sh` command to update the production server _after_ local synchronization is pushed to origin.
7. Never answer shell `Y/N` prompts on the user's behalf. Prefer flag-driven or orchestrator-scoped commands.

## Safety rules

- Do not commit, push, deploy, or run production deployment scripts unless the user explicitly asks.
- Do not edit `.env`, `.env.local`, `.env.production`, secrets, credentials, or generated build output.
- Do not run `scripts/git-workflow.sh`, `scripts/deploy_update.sh`, or `scripts/sync-branches.sh` as part of ordinary sync implementation.
- Use repository-specific git workflow scripts only when the user explicitly requests commit/push operations.
- Always execute local git workflows using `cd /Users/macbookpro/GitHub/{top-networks-inc-site} && bash ./scripts/git-workflow.sh "$(cat lib/documents/commit-message.txt)"`. Ensure `lib/documents/commit-message.txt` is written beforehand to prevent non-forced errors, blocking prompts, or editor (VIM/Nano) popups during automated deployment.
- Keep all filesystem operations scoped to repositories listed in `repositories.json`.
- Do not run deployment scripts when validation fails. Deployment is blocked until lint, formatting checks, and build checks pass or the user explicitly narrows the requested scope.
- Do not leave a synchronized repository checked out on `main` or a backup branch after deployment; return it to `dev`.

## CLI quick reference

Run from the workspace root or from the skill directory:

```bash
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs list
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs status
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs parity
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs validate --dry-run
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-sync.mjs run lint --dry-run
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs audit-scripts
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs preflight --dry-run
node .agents/skills/topnetworks-sync-orchestrator/scripts/topnetworks-deploy.mjs deployment-plan
```

Use `--execute` only after reviewing what will run.

## Typical user requests that should trigger this skill

- “Propagate this SEO refactor to the other TopFinanzas repos.”
- “Keep BudgetBee, UK, MX, and US in sync for metadata and llms.txt.”
- “Compare the shared component architecture across all properties.”
- “Run validation across the TopNetworks Next.js sites.”
- “Create a cross-repo workflow for synchronized changes.”

## Remote Deployment & Directory Mapping

When orchestrating deployments from local environments to the production server (`topfinanzas-com` via `gcloud compute ssh`), note the directory mappings:

- **TopFinanzas US**: Local `topfinanzas-us-next` -> Remote `/var/www/html/topfinanzas-us-next`
- **TopFinanzas UK**: Local `uk-topfinanzas-com` -> Remote `/var/www/html/uk`
- **TopFinanzas MX**: Local `topfinanzas-mx-next` -> Remote `/var/www/html/topfinanzas-mx-next`
- **BudgetBee**: Local `budgetbee-next` -> Remote `/var/www/html/budgetbee-next`

_Note: Ensure remote commands use `sudo git reset --hard HEAD` and `sudo git clean -fd` if the remote directory has unsaved changes blocking `git pull` from main._

## Agentic AI Deployment Prompts

You can use the following reusable prompts to instruct the orchestrator agent:

### 1. End-to-End Deployment (All Sites)

> "@SyncOrchestrator Please execute an end-to-end deployment for all TopNetworks properties (US, UK, MX, BudgetBee). For each property: 1. Write the commit message to `lib/documents/commit-message.txt`, then push local `dev` to origin `main` via `bash ./scripts/git-workflow.sh "$(cat lib/documents/commit-message.txt)"`. 2. SSH into the remote host. 3. Navigate to the correctly mapped remote directory in `/var/www/html/`. 4. Hard reset remote changes if necessary. 5. Run `sudo bash ./scripts/deploy_update.sh`. Report the build status for each site."

### 2. Single-Site Deployment

> "@SyncOrchestrator I have made changes to the `{{project_local_name}}` codebase. Please execute an end-to-end deployment. Write the commit message to `lib/documents/commit-message.txt` first. Ensure local changes are merged to main and pushed to origin using `bash ./scripts/git-workflow.sh "$(cat lib/documents/commit-message.txt)"`. Then SSH into the remote server, navigate to `{{project_remote_path}}`, resolve any dirty working tree states, and trigger `sudo bash ./scripts/deploy_update.sh`. Verify the Next.js compilation succeeds."

### 3. Batch Deployment (Subset of Sites)

> "@SyncOrchestrator We need to deploy updates to the following subset of sites: {{site_1_local}}, {{site_2_local}}, {{site_3_local}}. For each provided site: write the commit message to `lib/documents/commit-message.txt` and synchronize the local `dev` branch to `main` by running `bash ./scripts/git-workflow.sh "$(cat lib/documents/commit-message.txt)"`, push to origin, connect to the server via SSH, map the local name to its remote `/var/www/html/` directory, clear remote changes, and execute the deploy script. Summarize the deployment outputs."
