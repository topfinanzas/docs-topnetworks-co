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

const deployScriptNames = [
  "scripts/git-workflow.sh",
  "scripts/sync-branches.sh",
  "scripts/deploy_update.sh",
];

const formatExtensions = new Set([
  ".css",
  ".cjs",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".ts",
  ".tsx",
]);

function usage() {
  console.log(`TopNetworks Deployment Readiness

Usage:
  topnetworks-deploy audit-scripts [--repo <id>]
  topnetworks-deploy preflight [--repo <id>] [--dry-run|--execute] [--skip-build] [--skip-format] [--all-files]
  topnetworks-deploy deployment-plan [--repo <id>]

Safety:
  preflight is dry-run unless --execute is provided.
  This CLI never runs deploy_update.sh, sudo, PM2, branch sync, git commit, git push, or production deployment commands.
`);
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function hasFlag(flag) {
  return rest.includes(flag);
}

function optionValue(name) {
  const index = rest.indexOf(name);
  if (index === -1) return undefined;
  return rest[index + 1];
}

function dryRunMode() {
  return !hasFlag("--execute");
}

function selectedRepositories() {
  const repoId = optionValue("--repo");
  if (!repoId) return manifest.repositories;
  const repo = manifest.repositories.find((item) => item.id === repoId);
  if (!repo) fail(`Unknown repository id: ${repoId}`);
  return [repo];
}

function assertInWorkspace(repoPath) {
  const absolute = resolve(repoPath);
  const rel = relative(workspaceRoot, absolute);
  if (rel.startsWith("..") || resolve(workspaceRoot, rel) !== absolute) {
    fail(`Refusing to operate outside workspace root: ${repoPath}`);
  }
  return absolute;
}

function readRepoFile(repo, file) {
  const root = assertInWorkspace(repo.path);
  const absolute = join(root, file);
  if (!existsSync(absolute)) return null;
  return readFileSync(absolute, "utf8");
}

function packageJson(repo) {
  const text = readRepoFile(repo, "package.json");
  return text ? JSON.parse(text) : null;
}

function packageScript(repo, scriptName) {
  return packageJson(repo)?.scripts?.[scriptName];
}

function runCommand(label, commandName, commandArgs, options = {}) {
  const result = spawnSync(commandName, commandArgs, {
    cwd: options.cwd,
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });

  return {
    label,
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout:
      typeof result.stdout === "string"
        ? result.stdout.replace(/\s+$/g, "")
        : "",
    stderr:
      typeof result.stderr === "string"
        ? result.stderr.replace(/\s+$/g, "")
        : "",
  };
}

function printResult(result) {
  console.log(`${result.ok ? "PASS" : "FAIL"} ${result.label}`);
  if (!result.ok) {
    if (result.stdout) console.log(result.stdout);
    if (result.stderr) console.error(result.stderr);
  }
}

function printAgentActionRequired(repo, result) {
  console.log("");
  console.log("AGENT_ACTION_REQUIRED");
  console.log(`repo: ${repo.id} — ${repo.name}`);
  console.log(`failing_command: ${result.label}`);
  console.log(
    "required_action: Fix the validation errors in this repository before deployment can be authorized.",
  );
  console.log("deployment_status: BLOCKED");
}

function gitOutput(repo, gitArgs) {
  return runCommand(`git ${gitArgs.join(" ")}`, "git", [
    "--no-pager",
    "-C",
    repo.path,
    ...gitArgs,
  ]);
}

function gitStatusFiles(repo) {
  const result = gitOutput(repo, ["status", "--porcelain"]);
  if (!result.ok || !result.stdout) return [];
  return result.stdout
    .split("\n")
    .map((line) => line.slice(3).trim())
    .map((file) => file.replace(/^"|"$/g, ""))
    .filter(Boolean)
    .filter(
      (file) => !file.startsWith(".next/") && !file.startsWith("node_modules/"),
    );
}

function changedFormatFiles(repo) {
  return gitStatusFiles(repo).filter((file) => {
    const extension = file.match(/\.[^.]+$/)?.[0] ?? "";
    return formatExtensions.has(extension);
  });
}

function inspectScript(repo, scriptName) {
  const text = readRepoFile(repo, scriptName);
  if (text === null) {
    return {
      scriptName,
      exists: false,
      warnings: ["missing script"],
    };
  }

  const warnings = [];
  const info = [];

  if (/\bread\b|\bread\s+-p\b/.test(text)) {
    warnings.push(
      "interactive shell prompt detected; unsuitable for natural-language authorization workflows",
    );
  }
  if (/git\s+checkout\s+--ours|git\s+checkout\s+--theirs/.test(text)) {
    warnings.push(
      "automatic merge conflict resolution detected; manual review should be required",
    );
  }
  if (/\bsudo\b/.test(text)) {
    warnings.push(
      "sudo command detected; production/server-only command must not be run by local orchestrator",
    );
  }
  if (/rm\s+-rf\s+\.next/.test(text)) {
    info.push("removes .next build output during deployment");
  }
  if (/git\s+pull\s+origin\s+main/.test(text)) {
    info.push("assumes deployment branch origin/main");
  }
  if (
    /git\s+checkout\s+("|')?\$?(MAIN_BRANCH|DEV_BRANCH|BACKUP_BRANCH)|git\s+checkout\s+main|git\s+checkout\s+dev|git\s+checkout\s+backup/.test(
      text,
    )
  ) {
    info.push("performs branch checkout");
  }
  if (/git\s+push/.test(text)) {
    warnings.push(
      "push command detected; requires explicit user authorization outside preflight",
    );
  }
  if (!/(npm\s+run\s+lint|next\s+lint|npx\s+next\s+lint)/.test(text)) {
    warnings.push("no lint gate detected in script");
  }
  if (!/(prettier\s+--check|npm\s+run\s+format:check)/.test(text)) {
    warnings.push("no non-mutating formatting gate detected in script");
  }
  if (!/(npm\s+run\s+build|next\s+build|npx\s+next\s+build)/.test(text)) {
    warnings.push("no build gate detected in script");
  }

  const pm2Lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && /\bpm2\b/.test(line));
  if (pm2Lines.length) {
    info.push(`pm2 commands: ${pm2Lines.join(" | ")}`);
  }

  return {
    scriptName,
    exists: true,
    warnings,
    info,
  };
}

function auditScriptsCommand() {
  for (const repo of selectedRepositories()) {
    console.log(`\n## ${repo.id} — ${repo.name}`);
    console.log(`path: ${repo.path}`);
    console.log(`market: ${repo.market}`);
    for (const scriptName of deployScriptNames) {
      const inspection = inspectScript(repo, scriptName);
      console.log(`\n${inspection.exists ? "FOUND" : "MISSING"} ${scriptName}`);
      for (const item of inspection.info ?? []) console.log(`  info: ${item}`);
      for (const warning of inspection.warnings)
        console.log(`  warning: ${warning}`);
      if (inspection.exists && inspection.warnings.length === 0) {
        console.log("  no deployment workflow risks detected by static scan");
      }
    }
  }
}

function printDryRunPreflight(repo, files) {
  console.log("mode: dry-run");
  console.log(
    `would run: git --no-pager -C ${repo.path} rev-parse --abbrev-ref HEAD`,
  );
  console.log(`would run: git --no-pager -C ${repo.path} status --short`);
  console.log("would run: npm run lint");
  if (!hasFlag("--skip-format")) {
    if (hasFlag("--all-files")) {
      console.log("would run: npx --no-install prettier --check .");
    } else if (files.length) {
      console.log(
        `would run: npx --no-install prettier --check ${files.join(" ")}`,
      );
    } else {
      console.log(
        "would skip: prettier --check because no changed format-target files were detected",
      );
    }
  }
  if (hasFlag("--skip-build")) {
    console.log("would skip: npm run build");
  } else {
    console.log("would run: npm run build");
  }
}

function preflightCommand() {
  const isDryRun = dryRunMode();
  let failed = false;

  for (const repo of selectedRepositories()) {
    assertInWorkspace(repo.path);
    console.log(`\n## ${repo.id} — ${repo.name}`);
    console.log(`domain: ${repo.domain}`);
    console.log(`path: ${repo.path}`);

    const branch = gitOutput(repo, ["rev-parse", "--abbrev-ref", "HEAD"]);
    printResult(branch);
    if (branch.ok && branch.stdout)
      console.log(`current_branch: ${branch.stdout}`);

    const status = gitOutput(repo, ["status", "--short"]);
    printResult(status);
    console.log(status.stdout ? status.stdout : "working_tree: clean");

    const files = changedFormatFiles(repo);
    console.log(`changed_format_targets: ${files.length}`);
    for (const file of files) console.log(`  - ${file}`);

    const lintScript = packageScript(repo, "lint");
    const buildScript = packageScript(repo, "build");
    if (!lintScript) {
      failed = true;
      const result = { label: "npm run lint", ok: false };
      printResult(result);
      printAgentActionRequired(repo, result);
      continue;
    }
    if (!buildScript && !hasFlag("--skip-build")) {
      failed = true;
      const result = { label: "npm run build", ok: false };
      printResult(result);
      printAgentActionRequired(repo, result);
      continue;
    }

    if (isDryRun) {
      printDryRunPreflight(repo, files);
      continue;
    }

    const lint = runCommand("npm run lint", "npm", ["run", "lint"], {
      cwd: repo.path,
      inherit: true,
    });
    if (!lint.ok) {
      failed = true;
      printAgentActionRequired(repo, lint);
      continue;
    }

    if (!hasFlag("--skip-format")) {
      const prettierArgs = hasFlag("--all-files")
        ? ["prettier", "--check", "."]
        : files.length
          ? ["prettier", "--check", ...files]
          : null;
      if (prettierArgs) {
        const prettier = runCommand(
          `npx --no-install ${prettierArgs.join(" ")}`,
          "npx",
          ["--no-install", ...prettierArgs],
          { cwd: repo.path, inherit: true },
        );
        if (!prettier.ok) {
          failed = true;
          printAgentActionRequired(repo, prettier);
          continue;
        }
      } else {
        console.log(
          "SKIP prettier --check: no changed format-target files detected",
        );
      }
    }

    if (!hasFlag("--skip-build")) {
      const build = runCommand("npm run build", "npm", ["run", "build"], {
        cwd: repo.path,
        inherit: true,
      });
      if (!build.ok) {
        failed = true;
        printAgentActionRequired(repo, build);
        continue;
      }
    } else {
      console.log("SKIP npm run build: --skip-build supplied");
    }

    console.log("deployment_status: READY_FOR_USER_AUTHORIZATION");
  }

  if (failed) process.exit(1);
}

function pm2Summary(repo) {
  const text = readRepoFile(repo, repo.deploymentScript);
  if (!text) return "unknown";
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && /\bpm2\b/.test(line));
  return lines.length ? lines.join(" | ") : "no pm2 command detected";
}

function deploymentPlanCommand() {
  for (const repo of selectedRepositories()) {
    console.log(`\n## ${repo.id} — ${repo.name}`);
    console.log("deployment_status: NOT_EXECUTED");
    console.log(
      "authorization_required: explicit user natural-language deployment approval",
    );
    console.log(
      "required_preflight: topnetworks-deploy preflight --repo " +
        repo.id +
        " --execute",
    );
    console.log("local_validation:");
    for (const commandText of repo.validationCommands)
      console.log(`  - ${commandText}`);
    console.log("server_deployment_command:");
    console.log(
      `  cd /var/www/html/${relative(workspaceRoot, repo.path)} && sudo bash ./${repo.deploymentScript}`,
    );
    console.log("pm2_behavior:");
    console.log(`  ${pm2Summary(repo)}`);
    console.log(
      "guardrail: do not run this command from the local orchestrator; use it only after successful preflight and explicit deployment authorization.",
    );
  }
}

switch (command) {
  case "audit-scripts":
    auditScriptsCommand();
    break;
  case "preflight":
    preflightCommand();
    break;
  case "deployment-plan":
    deploymentPlanCommand();
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
