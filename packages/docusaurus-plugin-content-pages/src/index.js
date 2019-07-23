/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');
const fs = require('fs');
const {encodePath, fileToPath} = require('@docusaurus/utils');

const DEFAULT_OPTIONS = {
  path: 'src/pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx}'], // Extensions to include.
};

module.exports = function(context, opts) {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const contentPath = path.resolve(context.siteDir, options.path);

  return {
    name: 'docusaurus-plugin-content-pages',

    contentPath,

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
      return [...globPattern];
    },

    async loadContent() {
      const {include} = options;
      const {siteConfig, siteDir} = context;
      const pagesDir = contentPath;

      if (!fs.existsSync(pagesDir)) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const pagesFiles = await globby(include, {
        cwd: pagesDir,
      });

      return pagesFiles.map(relativeSource => {
        const source = path.join(pagesDir, relativeSource);
        // Cannot use path.join() as it resolves '../' and removes the '@site'. Let webpack loader resolve it.
        const aliasedSource = `@site/${path.relative(siteDir, source)}`;
        const pathName = encodePath(fileToPath(relativeSource));
        // Default Language.
        return {
          permalink: pathName.replace(/^\//, baseUrl),
          source: aliasedSource,
        };
      });
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute} = actions;

      await Promise.all(
        content.map(async metadataItem => {
          const {permalink, source} = metadataItem;
          addRoute({
            path: permalink,
            component: source,
            exact: true,
          });
        }),
      );
    },
  };
};
