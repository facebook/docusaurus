#!/usr/bin/env bash

set -euo pipefail

CUSTOM_REGISTRY_URL="http://localhost:4873"
npm_config_registry="$CUSTOM_REGISTRY_URL"
ORIGINAL_YARN_REGISTRY_URL=`yarn config get registry`
NEW_VERSION="$(node -p "require('./packages/docusaurus/package.json').version").NEW"
CONTAINER_NAME="verdaccio"

# Run Docker container with private npm registry Verdaccio
docker run -d --rm --name "$CONTAINER_NAME" -p 4873:4873 -v "$PWD/admin/verdaccio.yaml":/verdaccio/conf/config.yaml verdaccio/verdaccio:4

# Build packages
yarn tsc

# Set Yarn registry to own local registry
yarn config set registry "$CUSTOM_REGISTRY_URL"

# Publish the monorepo
npx --no-install lerna publish --yes --no-verify-access --no-git-reset --no-git-tag-version --no-push --registry "$CUSTOM_REGISTRY_URL" "$NEW_VERSION"

# Revert version changes
git diff --name-only -- '*.json' | sed 's, ,\\&,g' | xargs git checkout --

# Build skeleton website with new version
npx @docusaurus/init@latest init test-website classic

# Restore the original Yarn registry URL
yarn config set registry "$ORIGINAL_YARN_REGISTRY_URL"

# Stop Docker container
if ( $(docker container inspect "$CONTAINER_NAME" > /dev/null 2>&1) ); then
  # Remove Docker container
  docker container stop $CONTAINER_NAME
fi

echo "The website with to-be published packages was successfully build to the $(tput setaf 2)test-website$(tput sgr 0) directory."
