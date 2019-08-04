/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const globby = require('globby');
const _ = require('lodash');
const path = require('path');
const {parse, normalizeUrl, docuHash} = require('@docusaurus/utils');

// YYYY-MM-DD-{name}.mdx?
// prefer named capture, but old node version do not support
const FILENAME_PATTERN = /^(\d{4}-\d{1,2}-\d{1,2})-?(.*?).mdx?$/;

function toUrl({date, link}) {
  return `${date
    .toISOString()
    .substring(0, '2019-01-01'.length)
    .replace(/-/g, '/')}/${link}`;
}

const DEFAULT_OPTIONS = {
  path: 'blog', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'blog', // URL Route.
  include: ['*.md', '*.mdx'], // Extensions to include.
  postsPerPage: 10, // How many posts per page.
  blogListComponent: '@theme/BlogListPage',
  blogPostComponent: '@theme/BlogPostPage',
  blogTagsListComponent: '@theme/BlogTagsListPage',
  blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
  remarkPlugins: [],
  rehypePlugins: [],
  truncateMarker: /<!--\s*(truncate)\s*-->/, // string or regex
};

module.exports = function(context, opts) {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const contentPath = path.resolve(context.siteDir, options.path);

  return {
    name: 'docusaurus-plugin-content-blog',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
      return [...globPattern];
    },

    // Fetches blog contents and returns metadata for the necessary routes.
    async loadContent() {
      const {postsPerPage, include, routeBasePath} = options;
      const {siteConfig, siteDir} = context;
      const blogDir = contentPath;

      if (!fs.existsSync(blogDir)) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const blogFiles = await globby(include, {
        cwd: blogDir,
      });

      const blogPosts = [];

      await Promise.all(
        blogFiles.map(async relativeSource => {
          // Cannot use path.join() as it resolves '../' and removes the '@site'. Let webpack loader resolve it.
          const source = path.join(blogDir, relativeSource);
          const aliasedSource = `@site/${path.relative(siteDir, source)}`;
          const blogFileName = path.basename(relativeSource);

          const fileString = await fs.readFile(source, 'utf-8');
          const {frontMatter, excerpt} = parse(fileString);

          let date;
          // extract date and title from filename
          const match = blogFileName.match(FILENAME_PATTERN);
          let linkName = blogFileName.replace(/\.mdx?$/, '');
          if (match) {
            const [, dateString, name] = match;
            date = new Date(dateString);
            linkName = name;
          }
          // prefer usedefined date
          if (frontMatter.date) {
            date = new Date(frontMatter.date);
          }
          // use file create time for blog
          date = date || (await fs.stat(source)).birthtime;
          frontMatter.title = frontMatter.title || linkName;

          blogPosts.push({
            id: frontMatter.id || frontMatter.title,
            metadata: {
              permalink: normalizeUrl([
                baseUrl,
                routeBasePath,
                frontMatter.id || toUrl({date, link: linkName}),
              ]),
              source: aliasedSource,
              description: frontMatter.description || excerpt,
              date,
              tags: frontMatter.tags,
              title: frontMatter.title,
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
              page < numberOfPages - 1
                ? blogPaginationPermalink(page + 1)
                : null,
          },
          items: blogPosts
            .slice(page * postsPerPage, (page + 1) * postsPerPage)
            .map(item => item.id),
        });
      }

      const blogTags = {};
      const tagsPath = normalizeUrl([basePageUrl, 'tags']);
      blogPosts.forEach(blogPost => {
        const {tags} = blogPost.metadata;
        if (!tags || tags.length === 0) {
          // TODO: Extract tags out into a separate plugin.
          // eslint-disable-next-line no-param-reassign
          blogPost.metadata.tags = [];
          return;
        }

        // eslint-disable-next-line no-param-reassign
        blogPost.metadata.tags = tags.map(tag => {
          const normalizedTag = _.kebabCase(tag);
          const permalink = normalizeUrl([tagsPath, normalizedTag]);
          if (!blogTags[normalizedTag]) {
            blogTags[normalizedTag] = {
              name: tag.toLowerCase(), // Will only use the name of the first occurrence of the tag.
              items: [],
              permalink,
            };
          }

          blogTags[normalizedTag].items.push(blogPost.id);

          return {
            label: tag,
            permalink,
          };
        });
      });

      const blogTagsListPath =
        Object.keys(blogTags).length > 0 ? tagsPath : null;

      return {
        blogPosts,
        blogListPaginated,
        blogTags,
        blogTagsListPath,
      };
    },

    async contentLoaded({content: blogContents, actions}) {
      if (!blogContents) {
        return;
      }

      const {
        blogListComponent,
        blogPostComponent,
        blogTagsListComponent,
        blogTagsPostsComponent,
      } = options;

      const {addRoute, createData} = actions;
      const {
        blogPosts,
        blogListPaginated,
        blogTags,
        blogTagsListPath,
      } = blogContents;

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
                const {
                  metadata: postMetadata,
                  metadataPath,
                } = blogItemsToModules[postID];
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

      // Tags.
      const tagsModule = {};

      await Promise.all(
        Object.keys(blogTags).map(async tag => {
          const {name, items, permalink} = blogTags[tag];

          tagsModule[tag] = {
            allTagsPath: blogTagsListPath,
            slug: tag,
            name,
            count: items.length,
            permalink,
          };

          const tagsMetadataPath = await createData(
            `${docuHash(permalink)}.json`,
            JSON.stringify(tagsModule[tag], null, 2),
          );

          addRoute({
            path: permalink,
            component: blogTagsPostsComponent,
            exact: true,
            modules: {
              items: items.map(postID => {
                const {
                  metadata: postMetadata,
                  metadataPath,
                } = blogItemsToModules[postID];
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
              metadata: tagsMetadataPath,
            },
          });
        }),
      );

      // Only create /tags page if there are tags.
      if (Object.keys(blogTags).length > 0) {
        const tagsListPath = await createData(
          `${docuHash(`${blogTagsListPath}-tags`)}.json`,
          JSON.stringify(tagsModule, null, 2),
        );

        addRoute({
          path: blogTagsListPath,
          component: blogTagsListComponent,
          exact: true,
          modules: {
            tags: tagsListPath,
          },
        });
      }
    },

    configureWebpack(config, isServer, {getBabelLoader, getCacheLoader}) {
      const {rehypePlugins, remarkPlugins, truncateMarker} = options;
      return {
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [contentPath],
              use: [
                getCacheLoader(isServer),
                getBabelLoader(isServer),
                {
                  loader: '@docusaurus/mdx-loader',
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdownLoader.js'),
                  options: {
                    truncateMarker,
                  },
                },
              ].filter(Boolean),
            },
          ],
        },
      };
    },
  };
};
