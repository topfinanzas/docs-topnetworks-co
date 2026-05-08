#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(__dirname, "..");
const manifestPath = join(skillRoot, "repositories.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const workspaceRoot = resolve(manifest.workspaceRoot);

const args = process.argv.slice(2);
const command = args[0] ?? "help";
const rest = args.slice(1);

function usage() {
  console.log(`TopNetworks Sync Orchestrator

Usage:
  topnetworks-sync list [--json]
  topnetworks-sync status [--repo <id>]
  topnetworks-sync parity [--repo <id>] [--json]
  topnetworks-sync validate [--repo <id>] [--dry-run|--execute]
  topnetworks-sync run <script> [--repo <id>] [--dry-run|--execute]

Defaults:
  validate and run are dry-run unless --execute is provided.
`);
}

function hasFlag(flag) {
  return rest.includes(flag);
}

function optionValue(name) {
  const index = rest.indexOf(name);
  if (index === -1) return undefined;
  return rest[index + 1];
}

function selectedRepositories() {
  const repoId = optionValue("--repo");
  if (!repoId) return manifest.repositories;
  const repo = manifest.repositories.find((item) => item.id === repoId);
  if (!repo) {
    fail(`Unknown repository id: ${repoId}`);
  }
  return [repo];
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function assertInWorkspace(repoPath) {
  const absolute = resolve(repoPath);
  const rel = relative(workspaceRoot, absolute);
  if (rel.startsWith("..") || resolve(workspaceRoot, rel) !== absolute) {
    fail(`Refusing to operate outside workspace root: ${repoPath}`);
  }
  return absolute;
}

function packageJson(repo) {
  const path = join(assertInWorkspace(repo.path), "package.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function scriptExists(repo, scriptName) {
  const pkg = packageJson(repo);
  return Boolean(pkg?.scripts?.[scriptName]);
}

function runGitStatus(repo) {
  const result = spawnSync(
    "git",
    ["--no-pager", "-C", repo.path, "status", "--short"],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  return {
    ok: result.status === 0,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function dryRunMode() {
  if (hasFlag("--execute")) return false;
  return true;
}

function printRepo(repo) {
  console.log(`${repo.id}`);
  console.log(`  name: ${repo.name}`);
  console.log(`  path: ${repo.path}`);
  console.log(`  domain: ${repo.domain}`);
  console.log(`  market: ${repo.market}`);
  console.log(`  locale: ${repo.locale}`);
  console.log(`  port: ${repo.productionPort}`);
}

function listCommand() {
  const repos = selectedRepositories();
  if (hasFlag("--json")) {
    console.log(JSON.stringify(repos, null, 2));
    return;
  }
  repos.forEach(printRepo);
}

function statusCommand() {
  for (const repo of selectedRepositories()) {
    assertInWorkspace(repo.path);
    console.log(`\n## ${repo.id} — ${repo.name}`);
    const status = runGitStatus(repo);
    if (!status.ok) {
      console.log(status.stderr || "git status failed");
      continue;
    }
    console.log(status.stdout || "clean");
  }
}

function parityCommand() {
  const rows = [];
  for (const repo of selectedRepositories()) {
    const root = assertInWorkspace(repo.path);
    for (const file of manifest.sharedArchitectureFiles) {
      rows.push({
        repo: repo.id,
        file,
        exists: existsSync(join(root, file)),
      });
    }
  }
  if (hasFlag("--json")) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  for (const row of rows) {
    console.log(`${row.exists ? "ok" : "missing"}  ${row.repo}  ${row.file}`);
  }
}

function validateCommand() {
  const isDryRun = dryRunMode();
  for (const repo of selectedRepositories()) {
    console.log(`\n## ${repo.id} — ${repo.name}`);
    for (const commandText of repo.validationCommands) {
      const scriptName = commandText.replace(/^npm run /, "").trim();
      if (!scriptExists(repo, scriptName)) {
        console.log(`missing script: ${scriptName}`);
        continue;
      }
      if (isDryRun) {
        console.log(`[dry-run] ${commandText}`);
        continue;
      }
      console.log(`[execute] ${commandText}`);
      const result = spawnSync("npm", ["run", scriptName], {
        cwd: repo.path,
        stdio: "inherit",
      });
      if (result.status !== 0) {
        fail(
          `Validation failed in ${repo.id}: ${commandText}`,
          result.status ?? 1,
        );
      }
    }
  }
}

function runCommand() {
  const scriptName = rest.find(
    (arg) => !arg.startsWith("--") && rest[rest.indexOf(arg) - 1] !== "--repo",
  );
  if (!scriptName) {
    fail("Missing script name. Example: run lint --dry-run");
  }
  const isDryRun = dryRunMode();
  for (const repo of selectedRepositories()) {
    console.log(`\n## ${repo.id} — ${repo.name}`);
    if (!repo.allowlistedScripts.includes(scriptName)) {
      console.log(`blocked: ${scriptName} is not allowlisted for ${repo.id}`);
      continue;
    }
    if (!scriptExists(repo, scriptName)) {
      console.log(`missing script: ${scriptName}`);
      continue;
    }
    if (isDryRun) {
      console.log(`[dry-run] npm run ${scriptName}`);
      continue;
    }
    console.log(`[execute] npm run ${scriptName}`);
    const result = spawnSync("npm", ["run", scriptName], {
      cwd: repo.path,
      stdio: "inherit",
    });
    if (result.status !== 0) {
      fail(`Script failed in ${repo.id}: ${scriptName}`, result.status ?? 1);
    }
  }
}

switch (command) {
  case "list":
    listCommand();
    break;
  case "status":
    statusCommand();
    break;
  case "parity":
    parityCommand();
    break;
  case "validate":
    validateCommand();
    break;
  case "run":
    runCommand();
    break;
  case "help":
  case "--help":
  case "-h":
    usage();
    break;
  default:
    usage();
    fail(`Unknown command: ${command}`);
}
