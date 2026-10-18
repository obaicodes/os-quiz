#!/usr/bin/env bash
# One-time publish: creates the public GitHub repo, turns on GitHub Pages (built by
# .github/workflows/deploy.yml) and pushes main. Needs the GitHub CLI: sudo dnf install gh
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${1:-os-quiz}"

command -v gh >/dev/null || { echo "Install the GitHub CLI first: sudo dnf install gh"; exit 1; }
gh auth status >/dev/null 2>&1 || gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git

OWNER="$(gh api user --jq .login)"

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin \
    --description "Practice quizzes for the Operating Systems course (Midterm 1)"
fi

# Pages must be set to "GitHub Actions" before the first workflow run deploys.
gh api -X POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null

git push -u origin main

echo "Waiting for the deploy workflow..."
sleep 5
gh run watch --exit-status "$(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
echo
echo "Live at: https://$OWNER.github.io/$REPO/"
