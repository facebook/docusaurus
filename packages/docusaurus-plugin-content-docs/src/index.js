/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const importFresh = require('import-fresh');
const path = require('path');
const {idx, normalizeUrl, docuHash} = require('@docusaurus/utils');

const createOrder = require('./order');
const loadSidebars = require('./sidebars');
const processMetadata = require('./metadata');

const DEFAULT_OPTIONS = {
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  include: ['**/*.md', '**/*.mdx'], // Extensions to include.
  // TODO: Change format to array.
  sidebarPath: '', // Path to sidebar configuration for showing a list of markdown pages.
  // TODO: Settle themeing.
  docLayoutComponent: '@theme/DocPage',
  docItemComponent: '@theme/DocItem',
};

class DocusaurusPluginContentDocs {
  constructor(context, opts) {
    this.options = {...DEFAULT_OPTIONS, ...opts};
    this.context = context;
    this.contentPath = path.resolve(this.context.siteDir, this.options.path);
    this.content = {};
  }

  getName() {
    return 'docusaurus-plugin-content-docs';
  }

  getPathsToWatch() {
    const {include = []} = this.options;
    const globPattern = include.map(
      pattern => `${this.contentPath}/${pattern}`,
    );
    return [...globPattern, this.options.sidebarPath];
  }

  // Fetches blog contents and returns metadata for the contents.
  async loadContent() {
    const {include, routeBasePath, sidebarPath} = this.options;
    const {siteDir, siteConfig} = this.context;
    const docsDir = this.contentPath;

    // We don't want sidebars to be cached because of hotreloading.
    const sidebar = importFresh(sidebarPath);
    const docsSidebars = loadSidebars({siteDir, sidebar});

    // @tested - build the docs ordering such as next, previous, category and sidebar
    const order = createOrder(docsSidebars);

    // Prepare metadata container.
    const docs = {};

    // Metadata for default docs files.
    const docsFiles = await globby(include, {
      cwd: docsDir,
    });
    await Promise.all(
      docsFiles.map(async source => {
        const metadata = await processMetadata(
          source,
          docsDir,
          order,
          siteConfig,
          routeBasePath,
        );
        docs[metadata.id] = metadata;
      }),
    );

    // Get the titles of the previous and next ids so that we can use them.
    Object.keys(docs).forEach(currentID => {
      const previousID = idx(docs, [currentID, 'previous']);
      if (previousID) {
        const previousTitle = idx(docs, [previousID, 'title']);
        docs[currentID].previous_title = previousTitle || 'Previous';
      }
      const nextID = idx(docs, [currentID, 'next']);
      if (nextID) {
        const nextTitle = idx(docs, [nextID, 'title']);
        docs[currentID].next_title = nextTitle || 'Next';
      }
    });

    const sourceToPermalink = {};
    const permalinkToId = {};
    Object.values(docs).forEach(({id, source, permalink}) => {
      sourceToPermalink[source] = permalink;
      permalinkToId[permalink] = id;
    });

    this.content = {
      docs,
      docsDir,
      docsSidebars,
      sourceToPermalink,
      permalinkToId,
    };

    return this.content;
  }

  async contentLoaded({content, actions}) {
    const {docLayoutComponent, docItemComponent, routeBasePath} = this.options;
    const {addRoute, createData} = actions;

    const routes = await Promise.all(
      Object.values(content.docs).map(async metadataItem => {
        const metadataPath = await createData(
          `${docuHash(metadataItem.permalink)}.json`,
          JSON.stringify(metadataItem, null, 2),
        );
        return {
          path: metadataItem.permalink,
          component: docItemComponent,
          exact: true,
          modules: {
            content: metadataItem.source,
            metadata: metadataPath,
          },
        };
      }),
    );

    const docsBaseRoute = normalizeUrl([
      this.context.siteConfig.baseUrl,
      routeBasePath,
    ]);
    const docsMetadataPath = await createData(
      `${docuHash(docsBaseRoute)}.json`,
      JSON.stringify(content, null, 2),
    );

    addRoute({
      path: docsBaseRoute,
      component: docLayoutComponent,
      routes,
      modules: {
        docsMetadata: docsMetadataPath,
      },
    });
  }

  getThemePath() {
    return path.resolve(__dirname, './theme');
  }

  configureWebpack(config, isServer, {getBabelLoader, getCacheLoader}) {
    return {
      module: {
        rules: [
          {
            test: /(\.mdx?)$/,
            include: [this.contentPath],
            use: [
              getCacheLoader(isServer),
              getBabelLoader(isServer),
              '@docusaurus/mdx-loader',
              {
                loader: path.resolve(__dirname, './markdown/index.js'),
                options: {
                  siteConfig: this.context.siteConfig,
                  docsDir: this.content.docsDir,
                  sourceToPermalink: this.content.sourceToPermalink,
                },
              },
            ],
          },
        ],
      },
    };
  }
}

module.exports = DocusaurusPluginContentDocs;
