/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import logger from '@docusaurus/logger';
import {
  normalizeUrl,
  docuHash,
  aliasedSitePath,
  getPluginI18nPath,
  posixPath,
  addTrailingPathSeparator,
  createAbsoluteFilePathMatcher,
  getContentPathList,
  getDataFilePath,
  DEFAULT_PLUGIN_ID,
  type TagsListItem,
  type TagModule,
} from '@docusaurus/utils';
import {
  generateBlogPosts,
  getSourceToPermalink,
  getBlogTags,
  paginateBlogPosts,
} from './blogUtils';
import footnoteIDFixer from './remark/footnoteIDFixer';
import {translateContent, getTranslationFiles} from './translations';
import {createBlogFeedFiles} from './feed';

import type {BlogContentPaths, BlogMarkdownLoaderOptions} from './types';
import type {LoadContext, Plugin, HtmlTags} from '@docusaurus/types';
import type {
  PluginOptions,
  BlogPostFrontMatter,
  BlogPostMetadata,
  Assets,
  BlogTag,
  BlogTags,
  BlogContent,
  BlogPaginated,
} from '@docusaurus/plugin-content-blog';

export default async function pluginContentBlog(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin<BlogContent>> {
  const {
    siteDir,
    siteConfig,
    generatedFilesDir,
    localizationDir,
    i18n: {currentLocale},
  } = context;
  const {onBrokenMarkdownLinks, baseUrl} = siteConfig;

  const contentPaths: BlogContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      localizationDir,
      pluginName: 'docusaurus-plugin-content-blog',
      pluginId: options.id,
    }),
  };
  const pluginId = options.id ?? DEFAULT_PLUGIN_ID;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-blog',
  );
  const dataDir = path.join(pluginDataDirRoot, pluginId);
  const aliasedSource = (source: string) =>
    `~blog/${posixPath(path.relative(pluginDataDirRoot, source))}`;

  const authorsMapFilePath = await getDataFilePath({
    filePath: options.authorsMapPath,
    contentPaths,
  });

  return {
    name: 'docusaurus-plugin-content-blog',

    getPathsToWatch() {
      const {include} = options;
      const contentMarkdownGlobs = getContentPathList(contentPaths).flatMap(
        (contentPath) => include.map((pattern) => `${contentPath}/${pattern}`),
      );

      return [authorsMapFilePath, ...contentMarkdownGlobs].filter(
        Boolean,
      ) as string[];
    },

    getTranslationFiles() {
      return getTranslationFiles(options);
    },

    // Fetches blog contents and returns metadata for the necessary routes.
    async loadContent() {
      const {
        postsPerPage: postsPerPageOption,
        routeBasePath,
        tagsBasePath,
        blogDescription,
        blogTitle,
        blogSidebarTitle,
      } = options;

      const baseBlogUrl = normalizeUrl([baseUrl, routeBasePath]);
      const blogTagsListPath = normalizeUrl([baseBlogUrl, tagsBasePath]);
      const blogPosts = await generateBlogPosts(contentPaths, context, options);

      if (!blogPosts.length) {
        return {
          blogSidebarTitle,
          blogPosts: [],
          blogListPaginated: [],
          blogTags: {},
          blogTagsListPath,
          blogTagsPaginated: [],
        };
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

      const blogListPaginated: BlogPaginated[] = paginateBlogPosts({
        blogPosts,
        blogTitle,
        blogDescription,
        postsPerPageOption,
        basePageUrl: baseBlogUrl,
      });

      const blogTags: BlogTags = getBlogTags({
        blogPosts,
        postsPerPageOption,
        blogDescription,
        blogTitle,
      });

      return {
        blogSidebarTitle,
        blogPosts,
        blogListPaginated,
        blogTags,
        blogTagsListPath,
      };
    },

    async contentLoaded({content: blogContents, actions}) {
      const {
        blogListComponent,
        blogPostComponent,
        blogTagsListComponent,
        blogTagsPostsComponent,
        blogArchiveComponent,
        routeBasePath,
        archiveBasePath,
      } = options;

      const {addRoute, createData} = actions;
      const {
        blogSidebarTitle,
        blogPosts,
        blogListPaginated,
        blogTags,
        blogTagsListPath,
      } = blogContents;

      const blogItemsToMetadata: {[postId: string]: BlogPostMetadata} = {};

      const sidebarBlogPosts =
        options.blogSidebarCount === 'ALL'
          ? blogPosts
          : blogPosts.slice(0, options.blogSidebarCount);

      function blogPostItemsModule(items: string[]) {
        return items.map((postId) => {
          const blogPostMetadata = blogItemsToMetadata[postId]!;
          return {
            content: {
              __import: true,
              path: blogPostMetadata.source,
              query: {
                truncated: true,
              },
            },
          };
        });
      }

      if (archiveBasePath && blogPosts.length) {
        const archiveUrl = normalizeUrl([
          baseUrl,
          routeBasePath,
          archiveBasePath,
        ]);
        // Create a blog archive route
        const archiveProp = await createData(
          `${docuHash(archiveUrl)}.json`,
          JSON.stringify({blogPosts}, null, 2),
        );
        addRoute({
          path: archiveUrl,
          component: blogArchiveComponent,
          exact: true,
          modules: {
            archive: aliasedSource(archiveProp),
          },
        });
      }

      // This prop is useful to provide the blog list sidebar
      const sidebarProp = await createData(
        // Note that this created data path must be in sync with
        // metadataPath provided to mdx-loader.
        `blog-post-list-prop-${pluginId}.json`,
        JSON.stringify(
          {
            title: blogSidebarTitle,
            items: sidebarBlogPosts.map((blogPost) => ({
              title: blogPost.metadata.title,
              permalink: blogPost.metadata.permalink,
            })),
          },
          null,
          2,
        ),
      );

      // Create routes for blog entries.
      await Promise.all(
        blogPosts.map(async (blogPost) => {
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
              sidebar: aliasedSource(sidebarProp),
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
              sidebar: aliasedSource(sidebarProp),
              items: blogPostItemsModule(items),
              metadata: aliasedSource(pageMetadataPath),
            },
          });
        }),
      );

      // Tags. This is the last part so we early-return if there are no tags.
      if (Object.keys(blogTags).length === 0) {
        return;
      }

      async function createTagsListPage() {
        const tagsProp: TagsListItem[] = Object.values(blogTags).map((tag) => ({
          label: tag.label,
          permalink: tag.permalink,
          count: tag.items.length,
        }));

        const tagsPropPath = await createData(
          `${docuHash(`${blogTagsListPath}-tags`)}.json`,
          JSON.stringify(tagsProp, null, 2),
        );

        addRoute({
          path: blogTagsListPath,
          component: blogTagsListComponent,
          exact: true,
          modules: {
            sidebar: aliasedSource(sidebarProp),
            tags: aliasedSource(tagsPropPath),
          },
        });
      }

      async function createTagPostsListPage(tag: BlogTag): Promise<void> {
        await Promise.all(
          tag.pages.map(async (blogPaginated) => {
            const {metadata, items} = blogPaginated;
            const tagProp: TagModule = {
              label: tag.label,
              permalink: tag.permalink,
              allTagsPath: blogTagsListPath,
              count: tag.items.length,
            };
            const tagPropPath = await createData(
              `${docuHash(metadata.permalink)}.json`,
              JSON.stringify(tagProp, null, 2),
            );

            const listMetadataPath = await createData(
              `${docuHash(metadata.permalink)}-list.json`,
              JSON.stringify(metadata, null, 2),
            );

            addRoute({
              path: metadata.permalink,
              component: blogTagsPostsComponent,
              exact: true,
              modules: {
                sidebar: aliasedSource(sidebarProp),
                items: blogPostItemsModule(items),
                tag: aliasedSource(tagPropPath),
                listMetadata: aliasedSource(listMetadataPath),
              },
            });
          }),
        );
      }

      await createTagsListPage();
      await Promise.all(Object.values(blogTags).map(createTagPostsListPage));
    },

    translateContent({content, translationFiles}) {
      return translateContent(content, translationFiles);
    },

    configureWebpack(_config, isServer, {getJSLoader}, content) {
      const {
        admonitions,
        rehypePlugins,
        remarkPlugins,
        truncateMarker,
        beforeDefaultRemarkPlugins,
        beforeDefaultRehypePlugins,
      } = options;

      const markdownLoaderOptions: BlogMarkdownLoaderOptions = {
        siteDir,
        contentPaths,
        truncateMarker,
        sourceToPermalink: getSourceToPermalink(content.blogPosts),
        onBrokenMarkdownLink: (brokenMarkdownLink) => {
          if (onBrokenMarkdownLinks === 'ignore') {
            return;
          }
          logger.report(
            onBrokenMarkdownLinks,
          )`Blog markdown link couldn't be resolved: (url=${brokenMarkdownLink.link}) in path=${brokenMarkdownLink.filePath}`;
        },
      };

      const contentDirs = getContentPathList(contentPaths);
      return {
        resolve: {
          alias: {
            '~blog': pluginDataDirRoot,
          },
        },
        module: {
          rules: [
            {
              test: /\.mdx?$/i,
              include: contentDirs
                // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
                .map(addTrailingPathSeparator),
              use: [
                getJSLoader({isServer}),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    admonitions,
                    remarkPlugins,
                    rehypePlugins,
                    beforeDefaultRemarkPlugins: [
                      footnoteIDFixer,
                      ...beforeDefaultRemarkPlugins,
                    ],
                    beforeDefaultRehypePlugins,
                    staticDirs: siteConfig.staticDirectories.map((dir) =>
                      path.resolve(siteDir, dir),
                    ),
                    siteDir,
                    isMDXPartial: createAbsoluteFilePathMatcher(
                      options.exclude,
                      contentDirs,
                    ),
                    metadataPath: (mdxPath: string) => {
                      // Note that metadataPath must be the same/in-sync as
                      // the path from createData for each MDX.
                      const aliasedPath = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedPath)}.json`,
                      );
                    },
                    // For blog posts a title in markdown is always removed
                    // Blog posts title are rendered separately
                    removeContentTitle: true,

                    // Assets allow to convert some relative images paths to
                    // require() calls
                    createAssets: ({
                      frontMatter,
                      metadata,
                    }: {
                      frontMatter: BlogPostFrontMatter;
                      metadata: BlogPostMetadata;
                    }): Assets => ({
                      image: frontMatter.image,
                      authorsImageUrls: metadata.authors.map(
                        (author) => author.imageURL,
                      ),
                    }),
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdownLoader.js'),
                  options: markdownLoaderOptions,
                },
              ].filter(Boolean),
            },
          ],
        },
      };
    },

    async postBuild({outDir, content}) {
      if (!options.feedOptions.type) {
        return;
      }
      const {blogPosts} = content;
      if (!blogPosts.length) {
        return;
      }
      await createBlogFeedFiles({
        blogPosts,
        options,
        outDir,
        siteConfig,
        locale: currentLocale,
      });
    },

    injectHtmlTags({content}) {
      if (!content.blogPosts.length || !options.feedOptions.type) {
        return {};
      }

      const feedTypes = options.feedOptions.type;
      const feedTitle = options.feedOptions.title ?? context.siteConfig.title;
      const feedsConfig = {
        rss: {
          type: 'application/rss+xml',
          path: 'rss.xml',
          title: `${feedTitle} RSS Feed`,
        },
        atom: {
          type: 'application/atom+xml',
          path: 'atom.xml',
          title: `${feedTitle} Atom Feed`,
        },
        json: {
          type: 'application/json',
          path: 'feed.json',
          title: `${feedTitle} JSON Feed`,
        },
      };
      const headTags: HtmlTags = [];

      feedTypes.forEach((feedType) => {
        const {
          type,
          path: feedConfigPath,
          title: feedConfigTitle,
        } = feedsConfig[feedType];

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

export {validateOptions} from './options';
