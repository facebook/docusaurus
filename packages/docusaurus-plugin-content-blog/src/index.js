/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');
const fs = require('fs-extra');
const {parse, normalizeUrl, docuHash} = require('@docusaurus/utils');

// TODO: Use a better slugify function that doesn't rely on a specific file extension.
function fileToUrl(fileName) {
  return fileName
    .replace('-', '/')
    .replace('-', '/')
    .replace('-', '/')
    .replace(/\.mdx?$/, '');
}

const DEFAULT_OPTIONS = {
  path: 'blog', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'blog', // URL Route.
  include: ['*.md', '*.mdx'], // Extensions to include.
  pageCount: 10, // How many entries per page.
  blogListComponent: '@theme/BlogListPage',
  blogPostComponent: '@theme/BlogPostPage',
};

class DocusaurusPluginContentBlog {
  constructor(context, opts) {
    this.options = {...DEFAULT_OPTIONS, ...opts};
    this.context = context;
    this.contentPath = path.resolve(this.context.siteDir, this.options.path);
  }

  getName() {
    return 'docusaurus-plugin-content-blog';
  }

  getPathsToWatch() {
    const {include = []} = this.options;
    const globPattern = include.map(
      pattern => `${this.contentPath}/${pattern}`,
    );
    return [...globPattern];
  }

  // Fetches blog contents and returns metadata for the contents.
  async loadContent() {
    const {pageCount, include, routeBasePath} = this.options;
    const {siteConfig} = this.context;
    const blogDir = this.contentPath;

    const {baseUrl} = siteConfig;
    const blogFiles = await globby(include, {
      cwd: blogDir,
    });

    // Prepare metadata container.
    const blogMetadata = [];

    await Promise.all(
      blogFiles.map(async relativeSource => {
        const source = path.join(blogDir, relativeSource);

        const blogFileName = path.basename(relativeSource);
        // Extract, YYYY, MM, DD from the file name.
        const filePathDateArr = blogFileName.split('-');
        const date = new Date(
          `${filePathDateArr[0]}-${filePathDateArr[1]}-${
            filePathDateArr[2]
          }T06:00:00.000Z`,
        );

        const fileString = await fs.readFile(source, 'utf-8');
        const {metadata: rawMetadata, excerpt: description} = parse(fileString);

        const metadata = {
          permalink: normalizeUrl([
            baseUrl,
            routeBasePath,
            fileToUrl(blogFileName),
          ]),
          source,
          description,
          ...rawMetadata,
          date,
        };
        blogMetadata.push(metadata);
      }),
    );
    blogMetadata.sort((a, b) => b.date - a.date);

    // Blog page handling. Example: `/blog`, `/blog/page1`, `/blog/page2`
    const numOfBlog = blogMetadata.length;
    const numberOfPage = Math.ceil(numOfBlog / pageCount);
    const basePageUrl = normalizeUrl([baseUrl, routeBasePath]);

    // eslint-disable-next-line
    for (let page = 0; page < numberOfPage; page++) {
      blogMetadata.push({
        permalink:
          page > 0
            ? normalizeUrl([basePageUrl, `page/${page + 1}`])
            : basePageUrl,
        isBlogPage: true,
        posts: blogMetadata.slice(page * pageCount, (page + 1) * pageCount),
      });
    }

    return blogMetadata;
  }

  async contentLoaded({content, actions}) {
    const {blogListComponent, blogPostComponent} = this.options;
    const {addRoute, createData} = actions;
    await Promise.all(
      content.map(async metadataItem => {
        const {isBlogPage, permalink} = metadataItem;
        const metadataPath = await createData(
          `${docuHash(permalink)}.json`,
          JSON.stringify(metadataItem, null, 2),
        );
        if (isBlogPage) {
          addRoute({
            path: permalink,
            component: blogListComponent,
            exact: true,
            modules: {
              entries: metadataItem.posts.map(post => ({
                // To tell routes.js this is an import and not a nested object to recurse.
                __import: true,
                path: post.source,
                query: {
                  truncated: true,
                },
              })),
              metadata: metadataPath,
            },
          });

          return;
        }

        addRoute({
          path: permalink,
          component: blogPostComponent,
          exact: true,
          modules: {
            content: metadataItem.source,
            metadata: metadataPath,
          },
        });
      }),
    );
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
                loader: path.resolve(__dirname, './markdownLoader.js'),
              },
            ],
          },
        ],
      },
    };
  }
}

module.exports = DocusaurusPluginContentBlog;
