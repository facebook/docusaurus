/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import kebabCase from 'lodash.kebabcase';
import path from 'path';
import admonitions from 'remark-admonitions';
import {normalizeUrl, docuHash, aliasedSitePath} from '@docusaurus/utils';
import {
  STATIC_DIR_NAME,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/core/lib/constants';
import {ValidationError} from '@hapi/joi';

import {
  PluginOptions,
  BlogTags,
  BlogContent,
  BlogItemsToMetadata,
  TagsModule,
  BlogPaginated,
  BlogPost,
} from './types';
import {PluginOptionSchema} from './pluginOptionSchema';
import {
  LoadContext,
  PluginContentLoadedActions,
  ConfigureWebpackUtils,
  Props,
  Plugin,
  HtmlTags,
  OptionValidationContext,
  ValidationResult,
} from '@docusaurus/types';
import {Configuration, Loader} from 'webpack';
import {generateBlogFeed, generateBlogPosts} from './blogUtils';

export default function pluginContentBlog(
  context: LoadContext,
  options: PluginOptions,
): Plugin<BlogContent | null, typeof PluginOptionSchema> {
  if (options.admonitions) {
    options.remarkPlugins = options.remarkPlugins.concat([
      [admonitions, options.admonitions],
    ]);
  }

  const {siteDir, generatedFilesDir} = context;
  const contentPath = path.resolve(siteDir, options.path);

  const pluginGlobalDataDir = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-blog',
  );
  const dataDir = path.join(
    pluginGlobalDataDir,
    options.id ?? DEFAULT_PLUGIN_ID,
  );

  let blogPosts: BlogPost[] = [];

  return {
    name: 'docusaurus-plugin-content-blog',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map((pattern) => `${contentPath}/${pattern}`);
      return [...globPattern];
    },

    getClientModules() {
      const modules = [];

      if (options.admonitions) {
        modules.push(require.resolve('remark-admonitions/styles/infima.css'));
      }

      return modules;
    },

    // Fetches blog contents and returns metadata for the necessary routes.
    async loadContent() {
      const {postsPerPage, routeBasePath} = options;

      blogPosts = await generateBlogPosts(contentPath, context, options);
      if (!blogPosts.length) {
        return null;
      }

      // Colocate next and prev metadata.
      blogPosts.forEach((blogPost, index) => {
        const prevItem = index > 0 ? blogPosts[index - 1] : null;
        if (prevItem) {
          blogPost.metadata.prevItem = {
            title: prevItem.metadata.title,
            permalink: prevItem.metadata.permalink,
          };
        }

        const nextItem =
          index < blogPosts.length - 1 ? blogPosts[index + 1] : null;
        if (nextItem) {
          blogPost.metadata.nextItem = {
            title: nextItem.metadata.title,
            permalink: nextItem.metadata.permalink,
          };
        }
      });

      // Blog pagination routes.
      // Example: `/blog`, `/blog/page/1`, `/blog/page/2`
      const totalCount = blogPosts.length;
      const numberOfPages = Math.ceil(totalCount / postsPerPage);
      const {
        siteConfig: {baseUrl = ''},
      } = context;
      const basePageUrl = normalizeUrl([baseUrl, routeBasePath]);

      const blogListPaginated: BlogPaginated[] = [];

      function blogPaginationPermalink(page: number) {
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
            blogDescription: options.blogDescription,
          },
          items: blogPosts
            .slice(page * postsPerPage, (page + 1) * postsPerPage)
            .map((item) => item.id),
        });
      }

      const blogTags: BlogTags = {};
      const tagsPath = normalizeUrl([basePageUrl, 'tags']);
      blogPosts.forEach((blogPost) => {
        const {tags} = blogPost.metadata;
        if (!tags || tags.length === 0) {
          // TODO: Extract tags out into a separate plugin.
          // eslint-disable-next-line no-param-reassign
          blogPost.metadata.tags = [];
          return;
        }

        // eslint-disable-next-line no-param-reassign
        blogPost.metadata.tags = tags.map((tag) => {
          if (typeof tag === 'string') {
            const normalizedTag = kebabCase(tag);
            const permalink = normalizeUrl([tagsPath, normalizedTag]);
            if (!blogTags[normalizedTag]) {
              blogTags[normalizedTag] = {
                // Will only use the name of the first occurrence of the tag.
                name: tag.toLowerCase(),
                items: [],
                permalink,
              };
            }

            blogTags[normalizedTag].items.push(blogPost.id);

            return {
              label: tag,
              permalink,
            };
          }
          return tag;
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

    async contentLoaded({
      content: blogContents,
      actions,
    }: {
      content: BlogContent;
      actions: PluginContentLoadedActions;
    }) {
      if (!blogContents) {
        return;
      }

      const {
        blogListComponent,
        blogPostComponent,
        blogTagsListComponent,
        blogTagsPostsComponent,
      } = options;

      const aliasedSource = (source: string) =>
        `~blog/${path.relative(pluginGlobalDataDir, source)}`;
      const {addRoute, createData} = actions;
      const {
        blogPosts: loadedBlogPosts,
        blogListPaginated,
        blogTags,
        blogTagsListPath,
      } = blogContents;

      const blogItemsToMetadata: BlogItemsToMetadata = {};

      // Create routes for blog entries.
      await Promise.all(
        loadedBlogPosts.map(async (blogPost) => {
          const {id, metadata} = blogPost;
          await createData(
            // Note that this created data path must be in sync with
            // metadataPath provided to mdx-loader.
            `${docuHash(metadata.source)}.json`,
            JSON.stringify(metadata, null, 2),
          );

          addRoute({
            path: metadata.permalink,
            component: blogPostComponent,
            exact: true,
            modules: {
              content: metadata.source,
            },
          });

          blogItemsToMetadata[id] = metadata;
        }),
      );

      // Create routes for blog's paginated list entries.
      await Promise.all(
        blogListPaginated.map(async (listPage) => {
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
              items: items.map((postID) => {
                // To tell routes.js this is an import and not a nested object to recurse.
                return {
                  content: {
                    __import: true,
                    path: blogItemsToMetadata[postID].source,
                    query: {
                      truncated: true,
                    },
                  },
                };
              }),
              metadata: aliasedSource(pageMetadataPath),
            },
          });
        }),
      );

      // Tags.
      if (blogTagsListPath === null) {
        return;
      }

      const tagsModule: TagsModule = {};

      await Promise.all(
        Object.keys(blogTags).map(async (tag) => {
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
              items: items.map((postID) => {
                const metadata = blogItemsToMetadata[postID];
                return {
                  content: {
                    __import: true,
                    path: metadata.source,
                    query: {
                      truncated: true,
                    },
                  },
                };
              }),
              metadata: aliasedSource(tagsMetadataPath),
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
            tags: aliasedSource(tagsListPath),
          },
        });
      }
    },

    configureWebpack(
      _config: Configuration,
      isServer: boolean,
      {getBabelLoader, getCacheLoader}: ConfigureWebpackUtils,
    ) {
      const {rehypePlugins, remarkPlugins, truncateMarker} = options;
      return {
        resolve: {
          alias: {
            '~blog': pluginGlobalDataDir,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [contentPath],
              use: [
                getCacheLoader(isServer),
                getBabelLoader(isServer),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    staticDir: path.join(siteDir, STATIC_DIR_NAME),
                    // Note that metadataPath must be the same/in-sync as
                    // the path from createData for each MDX.
                    metadataPath: (mdxPath: string) => {
                      const aliasedSource = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedSource)}.json`,
                      );
                    },
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdownLoader.js'),
                  options: {
                    siteDir,
                    contentPath,
                    truncateMarker,
                    blogPosts,
                  },
                },
              ].filter(Boolean) as Loader[],
            },
          ],
        },
      };
    },

    async postBuild({outDir}: Props) {
      if (!options.feedOptions?.type) {
        return;
      }

      const feed = await generateBlogFeed(context, options);

      if (!feed) {
        return;
      }

      const feedTypes = options.feedOptions.type;

      await Promise.all(
        feedTypes.map(async (feedType) => {
          const feedPath = path.join(
            outDir,
            options.routeBasePath,
            `${feedType}.xml`,
          );
          const feedContent = feedType === 'rss' ? feed.rss2() : feed.atom1();
          try {
            await fs.outputFile(feedPath, feedContent);
          } catch (err) {
            throw new Error(`Generating ${feedType} feed failed: ${err}`);
          }
        }),
      );
    },

    injectHtmlTags() {
      if (!options.feedOptions?.type) {
        return {};
      }
      const feedTypes = options.feedOptions.type;
      const {
        siteConfig: {title},
        baseUrl,
      } = context;
      const feedsConfig = {
        rss: {
          type: 'application/rss+xml',
          path: 'rss.xml',
          title: `${title} Blog RSS Feed`,
        },
        atom: {
          type: 'application/atom+xml',
          path: 'atom.xml',
          title: `${title} Blog Atom Feed`,
        },
      };
      const headTags: HtmlTags = [];

      feedTypes.forEach((feedType) => {
        const feedConfig = feedsConfig[feedType] || {};

        if (!feedsConfig) {
          return;
        }

        const {type, path: feedConfigPath, title: feedConfigTitle} = feedConfig;

        headTags.push({
          tagName: 'link',
          attributes: {
            rel: 'alternate',
            type,
            href: normalizeUrl([
              baseUrl,
              options.routeBasePath,
              feedConfigPath,
            ]),
            title: feedConfigTitle,
          },
        });
      });

      return {
        headTags,
      };
    },
  };
}

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<PluginOptions, ValidationError>): ValidationResult<
  PluginOptions,
  ValidationError
> {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
