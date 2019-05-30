/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');
const fs = require('fs');
const {encodePath, fileToPath, docuHash} = require('@docusaurus/utils');

const DEFAULT_OPTIONS = {
  path: 'pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx}'], // Extensions to include.
};

module.exports = function(context, opts) {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const contentPath = path.resolve(context.siteDir, options.path);

  return {
    name: 'docusaurus-plugin-content-pages',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
      return [...globPattern];
    },

    async loadContent() {
      const {include} = options;
      const {siteConfig} = context;
      const pagesDir = contentPath;

      if (!fs.existsSync(pagesDir)) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const pagesFiles = await globby(include, {
        cwd: pagesDir,
      });

      // Prepare metadata container.
      const pagesMetadatas = [];

      await Promise.all(
        pagesFiles.map(async relativeSource => {
          const source = path.join(pagesDir, relativeSource);
          const pathName = encodePath(fileToPath(relativeSource));
          // Default Language.
          const metadata = {
            permalink: pathName.replace(/^\//, baseUrl),
            source,
          };
          pagesMetadatas.push(metadata);
        }),
      );

      return pagesMetadatas;
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute, createData} = actions;

      await Promise.all(
        content.map(async metadataItem => {
          const {permalink, source} = metadataItem;
          const metadataPath = await createData(
            `${docuHash(permalink)}.json`,
            JSON.stringify(metadataItem, null, 2),
          );
          addRoute({
            path: permalink,
            component: source,
            exact: true,
            modules: {
              metadata: metadataPath,
            },
          });
        }),
      );
    },

    // Each of these files are the equivalent of gatsby-browser files,
    // but this is potentially cleaner because Gatsby only allows one single
    // gatsby-browser file per plugin/project and you will have to mash all
    // the logic into that file.
    // These files contain browser lifecycle hooks and it seems like we only need
    // onRouteUpdate for GA. Let's implement mounted and onRouteUpdate for now.
    // References:
    // - https://www.gatsbyjs.org/docs/browser-apis/
    // - https://v1.vuepress.vuejs.org/plugin/option-api.html#clientrootmixin
    getClientModules() {
      return [
        path.resolve(__dirname, './path/to/some/file.js'),
        path.resolve(__dirname, './path/to/another/file.js'),
      ];
    },
  };
};
