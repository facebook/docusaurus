#!/bin/bash

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

      read -p "Submit a PR for a bump in $VERSION version - Are you sure ... (y/n) " -n 1 -r
      echo

      if [[ $REPLY =~ ^[Yy]$ || -z $REPLY ]]; then
        # bump version
        yarn version --new-version $VERSION --no-git-tag-version
        NEW_VERSION=$(node -p "require('./package.json').version")

        # create new branch
        git checkout -b $NEW_VERSION master

        # cut docusaurus docs version
        cd website && yarn run version $NEW_VERSION
        
        # Create PR
        echo "Creating Pull Request for Release ${NEW_VERSION}"
        git add .
        git commit -m "v$NEW_VERSION"
        git push origin $NEW_VERSION
        echo "✅ Release PR created"
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
