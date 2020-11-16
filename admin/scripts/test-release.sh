#!/usr/bin/env bash

# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

set -euo pipefail

CUSTOM_REGISTRY_URL="http://localhost:4873"
NEW_VERSION="$(node -p "require('./packages/docusaurus/package.json').version").NEW"
CONTAINER_NAME="verdaccio"
EXTRA_OPTS=""

if getopts ":n" arg; then
  EXTRA_OPTS="--use-npm"
fi

# Run Docker container with private npm registry Verdaccio
docker run -d --rm --name "$CONTAINER_NAME" -p 4873:4873 -v "$PWD/admin/verdaccio.yaml":/verdaccio/conf/config.yaml verdaccio/verdaccio:latest

# Build packages
yarn build:packages

# Publish the monorepo
npx --no-install lerna publish --yes --no-verify-access --no-git-reset --no-git-tag-version --no-push --registry "$CUSTOM_REGISTRY_URL" "$NEW_VERSION"

# Revert version changes
git diff --name-only -- '*.json' | sed 's, ,\\&,g' | xargs git checkout --

# Build skeleton website with new version
npm_config_registry="$CUSTOM_REGISTRY_URL" npx @docusaurus/init@"$NEW_VERSION" init test-website classic $EXTRA_OPTS

# Stop Docker container
if [[ -z "${KEEP_CONTAINER:-}" ]] && ( $(docker container inspect "$CONTAINER_NAME" > /dev/null 2>&1) ); then
  # Remove Docker container
  docker container stop $CONTAINER_NAME > /dev/null
fi

echo "The website with to-be published packages was successfully build to the $(tput setaf 2)test-website$(tput sgr 0) directory."
