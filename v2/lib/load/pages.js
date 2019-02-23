/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');
const {encodePath, fileToPath, idx} = require('./utils');

async function loadPages({pagesDir, env, siteConfig}) {
  const pagesFiles = await globby(['**/*.js'], {
    cwd: pagesDir,
  });

  const {baseUrl} = siteConfig;

  // Prepare metadata container.
  const pagesMetadatas = [];

  // Translation.
  const translationEnabled = idx(env, ['translation', 'enabled']);
  const enabledLanguages =
    translationEnabled && idx(env, ['translation', 'enabledLanguages']);
  const enabledLangTags =
    (enabledLanguages && enabledLanguages.map(lang => lang.tag)) || [];
  const defaultLangTag = idx(env, ['translation', 'defaultLanguage', 'tag']);

  await Promise.all(
    pagesFiles.map(async relativeSource => {
      const source = path.join(pagesDir, relativeSource);
      const pathName = encodePath(fileToPath(relativeSource));
      if (translationEnabled && enabledLangTags.length > 0) {
        enabledLangTags.forEach(langTag => {
          // Default lang should also be available. E.g: /en/users and /users is the same.
          if (langTag === defaultLangTag) {
            pagesMetadatas.push({
              permalink: pathName.replace(/^\//, baseUrl),
              language: langTag,
              source,
            });
          }

          const metadata = {
            permalink: pathName.replace(/^\//, `${baseUrl}${langTag}/`),
            language: langTag,
            source,
          };
          pagesMetadatas.push(metadata);
        });
      } else {
        // Default Language.
        const metadata = {
          permalink: pathName.replace(/^\//, baseUrl),
          source,
        };
        pagesMetadatas.push(metadata);
      }
    }),
  );
  return pagesMetadatas;
}

module.exports = loadPages;
