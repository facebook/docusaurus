/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {
  normalizeUrl,
  docuHash,
  aliasedSitePathToRelativePath,
} from '@docusaurus/utils';
import {shouldBeListed} from './blogUtils';

import {toTagProp, toTagsProp} from './props';
import type {
  PluginContentLoadedActions,
  RouteConfig,
  RouteMetadata,
} from '@docusaurus/types';
import type {
  BlogPostMetadata,
  BlogTag,
  BlogMetadata,
  BlogContent,
  PluginOptions,
  BlogPost,
  BlogSidebar,
} from '@docusaurus/plugin-content-blog';

type CreateAllRoutesParam = {
  baseUrl: string;
  content: BlogContent;
  options: PluginOptions;
  actions: PluginContentLoadedActions;
  aliasedSource: (str: string) => string;
};

export async function createAllRoutes(
  param: CreateAllRoutesParam,
): Promise<void> {
  const routes = await buildAllRoutes(param);
  routes.forEach(param.actions.addRoute);
}

export async function buildAllRoutes({
  baseUrl,
  content,
  actions,
  options,
  aliasedSource,
}: CreateAllRoutesParam): Promise<RouteConfig[]> {
  const {
    blogListComponent,
    blogPostComponent,
    blogTagsListComponent,
    blogTagsPostsComponent,
    blogArchiveComponent,
    routeBasePath,
    archiveBasePath,
    blogTitle,
  } = options;
  const pluginId = options.id!;
  const {createData} = actions;
  const {
    blogSidebarTitle,
    blogPosts,
    blogListPaginated,
    blogTags,
    blogTagsListPath,
  } = content;

  const listedBlogPosts = blogPosts.filter(shouldBeListed);

  const blogPostsById = _.keyBy(blogPosts, (post) => post.id);
  function getBlogPostById(id: string): BlogPost {
    const blogPost = blogPostsById[id];
    if (!blogPost) {
      throw new Error(`unexpected, can't find blog post id=${id}`);
    }
    return blogPost;
  }

  const sidebarBlogPosts =
    options.blogSidebarCount === 'ALL'
      ? blogPosts
      : blogPosts.slice(0, options.blogSidebarCount);

  async function createSidebarModule() {
    const sidebar: BlogSidebar = {
      title: blogSidebarTitle,
      items: sidebarBlogPosts.map((blogPost) => ({
        title: blogPost.metadata.title,
        permalink: blogPost.metadata.permalink,
        unlisted: blogPost.metadata.unlisted,
      })),
    };
    const modulePath = await createData(
      `blog-post-list-prop-${pluginId}.json`,
      sidebar,
    );
    return aliasedSource(modulePath);
  }

  async function createBlogMetadataModule() {
    const blogMetadata: BlogMetadata = {
      blogBasePath: normalizeUrl([baseUrl, routeBasePath]),
      blogTitle,
    };
    const modulePath = await createData(
      `blogMetadata-${pluginId}.json`,
      blogMetadata,
    );
    return aliasedSource(modulePath);
  }

  // TODO we should have a parent blog route,
  //  and inject blog metadata + sidebar as a parent context
  //  unfortunately we can't have a parent route for blog yet
  //  because if both blog/docs are using routeBasePath /,
  //  React router config rendering doesn't support that well
  const sidebarModulePath = await createSidebarModule();
  const blogMetadataModulePath = await createBlogMetadataModule();

  function blogPostItemsModule(ids: string[]) {
    return ids.map((id) => {
      return {
        content: {
          __import: true,
          path: getBlogPostById(id).metadata.source,
          query: {
            truncated: true,
          },
        },
      };
    });
  }

  function createArchiveRoute(): RouteConfig[] {
    if (archiveBasePath && listedBlogPosts.length) {
      return [
        {
          path: normalizeUrl([baseUrl, routeBasePath, archiveBasePath]),
          component: blogArchiveComponent,
          exact: true,
          props: {
            archive: {blogPosts: listedBlogPosts},
          },
        },
      ];
    }
    return [];
  }

  function createBlogPostRouteMetadata(
    blogPostMeta: BlogPostMetadata,
  ): RouteMetadata {
    return {
      sourceFilePath: aliasedSitePathToRelativePath(blogPostMeta.source),
      lastUpdatedAt: blogPostMeta.lastUpdatedAt,
    };
  }

  await Promise.all(
    blogPosts.map(async (blogPost) => {
      const {metadata} = blogPost;
      await createData(
        // Note that this created data path must be in sync with
        // metadataPath provided to mdx-loader.
        `${docuHash(metadata.source)}.json`,
        metadata,
      );
    }),
  );

  function createBlogPostRoute(blogPost: BlogPost): RouteConfig {
    return {
      path: blogPost.metadata.permalink,
      component: blogPostComponent,
      exact: true,
      modules: {
        sidebar: sidebarModulePath,
        content: blogPost.metadata.source,
      },
      metadata: createBlogPostRouteMetadata(blogPost.metadata),
      context: {
        blogMetadata: blogMetadataModulePath,
      },
    };
  }

  function createBlogPostRoutes(): RouteConfig[] {
    return blogPosts.map(createBlogPostRoute);
  }

  function createBlogPostsPaginatedRoutes(): RouteConfig[] {
    return blogListPaginated.map((paginated) => {
      return {
        path: paginated.metadata.permalink,
        component: blogListComponent,
        exact: true,
        modules: {
          sidebar: sidebarModulePath,
          items: blogPostItemsModule(paginated.items),
        },
        props: {
          metadata: paginated.metadata,
        },
      };
    });
  }

  function createTagsRoutes(): RouteConfig[] {
    // Tags. This is the last part so we early-return if there are no tags.
    if (Object.keys(blogTags).length === 0) {
      return [];
    }

    const tagsListRoute: RouteConfig = {
      path: blogTagsListPath,
      component: blogTagsListComponent,
      exact: true,
      modules: {
        sidebar: sidebarModulePath,
      },
      props: {
        tags: toTagsProp({blogTags}),
      },
    };

    function createTagPaginatedRoutes(tag: BlogTag): RouteConfig[] {
      return tag.pages.map((paginated) => {
        return {
          path: paginated.metadata.permalink,
          component: blogTagsPostsComponent,
          exact: true,
          modules: {
            sidebar: sidebarModulePath,
            items: blogPostItemsModule(paginated.items),
          },
          props: {
            tag: toTagProp({tag, blogTagsListPath}),
            listMetadata: paginated.metadata,
          },
        };
      });
    }

    const tagsPaginatedRoutes: RouteConfig[] = Object.values(blogTags).flatMap(
      createTagPaginatedRoutes,
    );

    return [tagsListRoute, ...tagsPaginatedRoutes];
  }

  return [
    ...createBlogPostRoutes(),
    ...createBlogPostsPaginatedRoutes(),
    ...createTagsRoutes(),
    ...createArchiveRoute(),
  ];
}
