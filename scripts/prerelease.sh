#!/bin/bash

##
# Copyright (c) 2017-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.
#

DOCS_VERSION_COMMAND="run version"

echo "Select an option for release："
echo

select VERSION in patch minor major "Specific Version"
  do
    echo
    if [[ $REPLY =~ ^[1-4]$ ]]; then
      if [[ $REPLY == 4 ]]; then
        read -p "Enter a specific version: " -r VERSION
        echo
        if [[ -z $REPLY ]]; then
          VERSION=$REPLY
        fi
      fi

      read -p "Create $VERSION commit - Are you sure ... (y/n) " -n 1 -r
      echo

      if [[ $REPLY =~ ^[Yy]$ || -z $REPLY ]]; then
        # Bump version
        cd v1
        yarn version --new-version $VERSION --no-git-tag-version
        NEW_VERSION=$(node -p "require('./package.json').version")

        # Create new branch
        git checkout -B $NEW_VERSION master
        # Cut docusaurus docs version
        cd website && yarn $DOCS_VERSION_COMMAND $NEW_VERSION

        # Create commit
        git add ../
        git commit -m "v$NEW_VERSION"
        git push -f origin $NEW_VERSION
        echo "Finished"
      else
        echo Cancelled
      fi
      break
    else
      echo Invalid \"${REPLY}\"
      echo "To continue, please enter one of the options (1-4):"
      echo
    fi
  done
