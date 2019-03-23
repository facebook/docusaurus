/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');

// TODO: Do not make it relative because plugins can be from node_modules.
const {encodePath, fileToPath, idx} = require('@docusaurus/utils');

const DEFAULT_OPTIONS = {
  metadataKey: 'pagesMetadata',
  metadataFileName: 'pagesMetadata.json',
  path: 'pages', // Path to data on filesystem.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx}'], // Extensions to include.
  component: '@theme/Pages',
};

class DocusaurusPluginContentPages {
  constructor(opts, context) {
    this.options = {...DEFAULT_OPTIONS, ...opts};
    this.context = context;
    this.contentPath = path.resolve(this.context.siteDir, this.options.path);
  }

  getName() {
    return 'docusaurus-plugin-content-pages';
  }

  async loadContents() {
    const {include} = this.options;
    const {env, siteConfig} = this.context;
    const pagesDir = this.contentPath;

    const {baseUrl} = siteConfig;
    const pagesFiles = await globby(include, {
      cwd: pagesDir,
    });

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

  async generateRoutes({metadata, actions}) {
    const {component} = this.options;
    const {addRoute} = actions;

    metadata.forEach(metadataItem => {
      const {permalink, source} = metadataItem;
      addRoute({
        path: permalink,
        component,
        metadata: metadataItem,
        modules: [source],
      });
    });
  }

  getPathsToWatch() {
    return [this.contentPath];
  }
}

module.exports = DocusaurusPluginContentPages;
