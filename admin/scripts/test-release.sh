#!/usr/bin/env bash

set -euo pipefail

CUSTOM_REGISTRY_URL="http://localhost:4000"
ORIGINAL_NPM_REGISTRY_URL=`npm get registry`
ORIGINAL_YARN_REGISTRY_URL=`yarn config get registry`
NEW_VERSION="$(node -p "require('./packages/docusaurus/package.json').version").NEW"

# Clean up
rm -rf admin/tmp

# Building packages
yarn tsc

# Set registry to local registry
npm set registry "$CUSTOM_REGISTRY_URL"
yarn config set registry "$CUSTOM_REGISTRY_URL"

# Publish the monorepo
lerna publish --yes --no-verify-access --no-git-tag-version --no-push --registry "$CUSTOM_REGISTRY_URL" "$NEW_VERSION"

# Revert version changes
git diff --name-only -- '*.json' | sed 's, ,\\&,g' | xargs git checkout --

# Restore the original NPM and Yarn registry URLs
npm set registry "$ORIGINAL_NPM_REGISTRY_URL"
yarn config set registry "$ORIGINAL_YARN_REGISTRY_URL"
