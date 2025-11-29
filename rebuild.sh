#!/usr/bin/env bash
set -euo pipefail

# Force a clean rebuild on Vercel via a trivial commit

echo "rebuild: $(date '+%Y-%m-%d %H:%M:%S')" > .vercel-rebuild
git add -f .vercel-rebuild
git commit -m "chore: force clean rebuild"
git push

echo "Done. Vercel should trigger a fresh build for this commit."