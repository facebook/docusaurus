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
  postsPerPage: 10, // How many posts per page.
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

  // Fetches blog contents and returns metadata for the necessary routes.
  async loadContent() {
    const {postsPerPage, include, routeBasePath} = this.options;
    const {siteConfig} = this.context;
    const blogDir = this.contentPath;

    const {baseUrl} = siteConfig;
    const blogFiles = await globby(include, {
      cwd: blogDir,
    });

    const blogPosts = [];

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
        const {frontMatter, excerpt} = parse(fileString);

        blogPosts.push({
          id: blogFileName,
          metadata: {
            permalink: normalizeUrl([
              baseUrl,
              routeBasePath,
              fileToUrl(blogFileName),
            ]),
            source,
            description: frontMatter.description || excerpt,
            date,
            title: frontMatter.title || blogFileName,
          },
        });
      }),
    );
    blogPosts.sort((a, b) => b.metadata.date - a.metadata.date);

    // Blog pagination routes.
    // Example: `/blog`, `/blog/page/1`, `/blog/page/2`
    const totalCount = blogPosts.length;
    const numberOfPages = Math.ceil(totalCount / postsPerPage);
    const basePageUrl = normalizeUrl([baseUrl, routeBasePath]);

    const blogListPaginated = [];

    function blogPaginationPermalink(page) {
      return page > 0
        ? normalizeUrl([basePageUrl, `page/${page + 1}`])
        : basePageUrl;
    }

    for (let page = 0; page < numberOfPages; page += 1) {
      blogListPaginated.push({
        metadata: {
          permalink: blogPaginationPermalink(page),
          page: page + 1,
          postsPerPage,
          totalPages: numberOfPages,
          totalCount,
          previousPage: page !== 0 ? blogPaginationPermalink(page - 1) : null,
          nextPage:
            page < numberOfPages - 1 ? blogPaginationPermalink(page + 1) : null,
        },
        items: blogPosts
          .slice(page * postsPerPage, (page + 1) * postsPerPage)
          .map(item => item.id),
      });
    }

    return {
      blogPosts,
      blogListPaginated,
    };
  }

  async contentLoaded({content: blogContents, actions}) {
    const {blogListComponent, blogPostComponent} = this.options;
    const {addRoute, createData} = actions;
    const {blogPosts, blogListPaginated} = blogContents;

    const blogItemsToModules = {};
    // Create routes for blog entries.
    const blogItems = await Promise.all(
      blogPosts.map(async blogPost => {
        const {id, metadata} = blogPost;
        const {permalink} = metadata;
        const metadataPath = await createData(
          `${docuHash(permalink)}.json`,
          JSON.stringify(metadata, null, 2),
        );
        const temp = {
          metadata,
          metadataPath,
        };

        blogItemsToModules[id] = temp;
        return temp;
      }),
    );

    blogItems.forEach((blogItem, index) => {
      const prevItem = index > 0 ? blogItems[index - 1] : null;
      const nextItem =
        index < blogItems.length - 1 ? blogItems[index + 1] : null;
      const {metadata, metadataPath} = blogItem;
      const {source, permalink} = metadata;

      addRoute({
        path: permalink,
        component: blogPostComponent,
        exact: true,
        modules: {
          content: source,
          metadata: metadataPath,
          prevItem: prevItem && prevItem.metadataPath,
          nextItem: nextItem && nextItem.metadataPath,
        },
      });
    });

    // Create routes for blog's paginated list entries.
    await Promise.all(
      blogListPaginated.map(async listPage => {
        const {metadata, items} = listPage;
        const {permalink} = metadata;
        const pageMetadataPath = await createData(
          `${docuHash(permalink)}.json`,
          JSON.stringify(metadata, null, 2),
        );

        addRoute({
          path: permalink,
          component: blogListComponent,
          exact: true,
          modules: {
            items: items.map(postID => {
              const {metadata: postMetadata, metadataPath} = blogItemsToModules[
                postID
              ];
              // To tell routes.js this is an import and not a nested object to recurse.
              return {
                content: {
                  __import: true,
                  path: postMetadata.source,
                  query: {
                    truncated: true,
                  },
                },
                metadata: metadataPath,
              };
            }),
            metadata: pageMetadataPath,
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
