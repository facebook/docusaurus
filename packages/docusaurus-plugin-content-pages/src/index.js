/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');
const {encodePath, fileToPath, docuHash} = require('@docusaurus/utils');

const DEFAULT_OPTIONS = {
  path: 'pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx}'], // Extensions to include.
};

class DocusaurusPluginContentPages {
  constructor(context, opts) {
    this.options = {...DEFAULT_OPTIONS, ...opts};
    this.context = context;
    this.contentPath = path.resolve(this.context.siteDir, this.options.path);
  }

  getName() {
    return 'docusaurus-plugin-content-pages';
  }

  getPathsToWatch() {
    const {include = []} = this.options;
    const globPattern = include.map(
      pattern => `${this.contentPath}/${pattern}`,
    );
    return [...globPattern];
  }

  async loadContent() {
    const {include} = this.options;
    const {siteConfig} = this.context;
    const pagesDir = this.contentPath;

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
  }

  async contentLoaded({content, actions}) {
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
  }
}

module.exports = DocusaurusPluginContentPages;
