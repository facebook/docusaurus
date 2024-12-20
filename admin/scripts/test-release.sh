#!/usr/bin/env bash

# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

set -xeuo pipefail

rm -rf ../test-website

CUSTOM_REGISTRY_URL="http://localhost:4873"
NEW_VERSION="$(node -p "require('./packages/docusaurus/package.json').version")-NEW"
CONTAINER_NAME="verdaccio"
EXTRA_OPTS=""

usage() { echo "Usage: $0 [-s] [-t]" 1>&2; exit 1; }

while getopts ":st" o; do
  case "${o}" in
    s)
      EXTRA_OPTS="${EXTRA_OPTS} --skip-install"
      ;;
    t)
      EXTRA_OPTS="${EXTRA_OPTS} --typescript"
      ;;
    *)
      usage
      ;;
  esac
done
shift $((OPTIND-1))


if [ ! -z $EXTRA_OPTS ]
then
  echo create-docusaurus extra options = ${EXTRA_OPTS}
fi

# Run Docker container with private npm registry Verdaccio
docker run -d --rm --name "$CONTAINER_NAME" -p 4873:4873 -v "$PWD/admin/verdaccio.yaml":/verdaccio/conf/config.yaml verdaccio/verdaccio:latest

# Build packages
yarn build:packages

# Publish the monorepo
npx --no-install lerna publish --exact --yes --no-verify-access --no-git-reset --no-git-tag-version --no-push --registry "$CUSTOM_REGISTRY_URL" "$NEW_VERSION"

# Revert version changes
git diff --name-only -- '*.json' | sed 's, ,\\&,g' | xargs git checkout --


# The website is generated outside the repo to minimize chances of yarn resolving the wrong version
cd ..

# Build skeleton website with new version
npm_config_registry="$CUSTOM_REGISTRY_URL" npx --yes --loglevel silly create-docusaurus@"$NEW_VERSION" test-website classic --javascript $EXTRA_OPTS


# Stop Docker container
if [[ -z "${KEEP_CONTAINER:-true}" ]] && ( $(docker container inspect "$CONTAINER_NAME" > /dev/null 2>&1) ); then
  # Remove Docker container
  docker container stop $CONTAINER_NAME > /dev/null
fi

echo "The website with to-be published packages was successfully build to the $(tput setaf 2)test-website$(tput sgr 0) directory."
