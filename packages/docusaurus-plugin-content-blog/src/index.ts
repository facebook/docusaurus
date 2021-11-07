/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import admonitions from 'remark-admonitions';
import {
  normalizeUrl,
  docuHash,
  aliasedSitePath,
  getPluginI18nPath,
  reportMessage,
  posixPath,
  addTrailingPathSeparator,
  createAbsoluteFilePathMatcher,
} from '@docusaurus/utils';
import {
  STATIC_DIR_NAME,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/core/lib/constants';
import {translateContent, getTranslationFiles} from './translations';

import {
  PluginOptions,
  BlogTags,
  BlogContent,
  BlogItemsToMetadata,
  TagsModule,
  BlogPaginated,
  BlogContentPaths,
  BlogMarkdownLoaderOptions,
  MetaData,
  Assets,
} from './types';
import {PluginOptionSchema} from './pluginOptionSchema';
import {
  LoadContext,
  ConfigureWebpackUtils,
  Props,
  Plugin,
  HtmlTags,
  OptionValidationContext,
  ValidationResult,
} from '@docusaurus/types';
import {Configuration} from 'webpack';
import {
  generateBlogPosts,
  getContentPathList,
  getSourceToPermalink,
  getBlogTags,
} from './blogUtils';
import {BlogPostFrontMatter} from './blogFrontMatter';
import {createBlogFeedFiles} from './feed';

export default function pluginContentBlog(
  context: LoadContext,
  options: PluginOptions,
): Plugin<BlogContent> {
  if (options.admonitions) {
    options.remarkPlugins = options.remarkPlugins.concat([
      [admonitions, options.admonitions],
    ]);
  }

  const {
    siteDir,
    siteConfig,
    generatedFilesDir,
    i18n: {currentLocale},
  } = context;
  const {onBrokenMarkdownLinks, baseUrl} = siteConfig;

  const contentPaths: BlogContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      siteDir,
      locale: currentLocale,
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

  return {
    name: 'docusaurus-plugin-content-blog',

    getPathsToWatch() {
      const {include, authorsMapPath} = options;
      const contentMarkdownGlobs = getContentPathList(contentPaths).flatMap(
        (contentPath) => include.map((pattern) => `${contentPath}/${pattern}`),
      );

      // TODO: we should read this path in plugin! but plugins do not support async init for now :'(
      // const authorsMapFilePath = await getAuthorsMapFilePath({authorsMapPath,contentPaths,});
      // simplified impl, better than nothing for now:
      const authorsMapFilePath = path.join(
        contentPaths.contentPath,
        authorsMapPath,
      );

      return [authorsMapFilePath, ...contentMarkdownGlobs];
    },

    async getTranslationFiles() {
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

      const blogPosts = await generateBlogPosts(contentPaths, context, options);

      if (!blogPosts.length) {
        return {
          blogSidebarTitle,
          blogPosts: [],
          blogListPaginated: [],
          blogTags: {},
          blogTagsListPath: null,
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

      // Blog pagination routes.
      // Example: `/blog`, `/blog/page/1`, `/blog/page/2`
      const totalCount = blogPosts.length;
      const postsPerPage =
        postsPerPageOption === 'ALL' ? totalCount : postsPerPageOption;
      const numberOfPages = Math.ceil(totalCount / postsPerPage);
      const baseBlogUrl = normalizeUrl([baseUrl, routeBasePath]);

      const blogListPaginated: BlogPaginated[] = [];

      function blogPaginationPermalink(page: number) {
        return page > 0
          ? normalizeUrl([baseBlogUrl, `page/${page + 1}`])
          : baseBlogUrl;
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
            blogDescription,
            blogTitle,
          },
          items: blogPosts
            .slice(page * postsPerPage, (page + 1) * postsPerPage)
            .map((item) => item.id),
        });
      }

      const blogTags: BlogTags = getBlogTags(blogPosts);

      const tagsPath = normalizeUrl([baseBlogUrl, tagsBasePath]);

      const blogTagsListPath =
        Object.keys(blogTags).length > 0 ? tagsPath : null;

      return {
        blogSidebarTitle,
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

      const blogItemsToMetadata: BlogItemsToMetadata = {};

      const sidebarBlogPosts =
        options.blogSidebarCount === 'ALL'
          ? blogPosts
          : blogPosts.slice(0, options.blogSidebarCount);

      const archiveUrl = normalizeUrl([
        baseUrl,
        routeBasePath,
        archiveBasePath,
      ]);

      // creates a blog archive route
      const archiveProp = await createData(
        `${docuHash(archiveUrl)}.json`,
        JSON.stringify({blogPosts}, null, 2),
      );
      addRoute({
        path: archiveUrl,
        component: '@theme/BlogArchivePage',
        exact: true,
        modules: {
          archive: aliasedSource(archiveProp),
        },
      });

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

          // Refactor all this, see docs implementation
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
              sidebar: aliasedSource(sidebarProp),
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
            sidebar: aliasedSource(sidebarProp),
            tags: aliasedSource(tagsListPath),
          },
        });
      }
    },

    translateContent({content, translationFiles}) {
      return translateContent(content, translationFiles);
    },

    configureWebpack(
      _config: Configuration,
      isServer: boolean,
      {getJSLoader}: ConfigureWebpackUtils,
      content,
    ) {
      const {
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
          reportMessage(
            `Blog markdown link couldn't be resolved: (${brokenMarkdownLink.link}) in ${brokenMarkdownLink.filePath}`,
            onBrokenMarkdownLinks,
          );
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
              test: /(\.mdx?)$/,
              include: contentDirs
                // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
                .map(addTrailingPathSeparator),
              use: [
                getJSLoader({isServer}),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    beforeDefaultRemarkPlugins,
                    beforeDefaultRehypePlugins,
                    staticDir: path.join(siteDir, STATIC_DIR_NAME),
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

                    // Assets allow to convert some relative images paths to require() calls
                    createAssets: ({
                      frontMatter,
                      metadata,
                    }: {
                      frontMatter: BlogPostFrontMatter;
                      metadata: MetaData;
                    }): Assets => {
                      return {
                        image: frontMatter.image,
                        authorsImageUrls: metadata.authors.map(
                          (author) => author.imageURL,
                        ),
                      };
                    },
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

    async postBuild({outDir}: Props) {
      if (!options.feedOptions.type) {
        return;
      }

      // TODO: we shouldn't need to re-read the posts here!
      // postBuild should receive loadedContent
      const blogPosts = await generateBlogPosts(contentPaths, context, options);
      if (!blogPosts.length) {
        return;
      }
      await createBlogFeedFiles({
        blogPosts,
        options,
        outDir,
        siteConfig,
      });
    },

    injectHtmlTags({content}) {
      if (!content.blogPosts.length) {
        return {};
      }

      if (!options.feedOptions?.type) {
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
}: OptionValidationContext<PluginOptions>): ValidationResult<PluginOptions> {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
