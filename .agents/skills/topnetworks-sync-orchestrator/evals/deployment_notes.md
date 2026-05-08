# Deployment Standardization Notes

To prevent non-forced errors, blocking prompts, and editor popups (VIM/Nano) that disrupt automated deployment workflows, all TopNetworks Inc. repositories have standardized the local git-workflow process.

The commit message must be written to a temporary file (`lib/documents/commit-message.txt`) prior to calling the script.

**Standardized local git-workflow command:**

```bash
cd /Users/macbookpro/GitHub/{top-networks-inc-site} && bash ./scripts/git-workflow.sh "$(cat lib/documents/commit-message.txt)"
```

Agents must enforce this standard, utilizing double quotes `"` around the `$()` command substitution to properly pass the entire multi-line commit message as a single argument to the script.
