/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoadContext, Plugin, AllContent} from '@docusaurus/types';
import type {BlogPost, BlogContent} from '@docusaurus/plugin-content-blog';

export type RecentBlogPost = {
  readonly title: string;
  readonly permalink: string;
  readonly date: string;
  readonly description: string;
  readonly authors: ReadonlyArray<{
    readonly name?: string;
    readonly imageURL?: string;
  }>;
};

export type RecentBlogsPluginData = {
  readonly recentPosts: RecentBlogPost[];
};

const PluginName = 'recent-blogs-plugin';

/**
 * A simple plugin that exposes the 3 most recent blog posts
 * as global data for use on the homepage.
 */
export default function recentBlogsPlugin(
  _context: LoadContext,
): Plugin<undefined> {
  return {
    name: PluginName,

    async allContentLoaded({allContent, actions}) {
      const blogContent = getBlogPluginContent(allContent);
      if (!blogContent) {
        return;
      }

      const recentPosts = getRecentBlogPosts(blogContent.blogPosts, 3);
      actions.setGlobalData({recentPosts});
    },
  };
}

function getBlogPluginContent(allContent: AllContent): BlogContent | undefined {
  // The blog plugin uses 'default' as its plugin id by default
  return allContent['docusaurus-plugin-content-blog']?.default as
    | BlogContent
    | undefined;
}

function getRecentBlogPosts(
  blogPosts: BlogPost[],
  count: number,
): RecentBlogPost[] {
  // Blog posts are already sorted by date (newest first)
  // Filter out unlisted posts and take the first `count` posts
  return blogPosts
    .filter((post) => !post.metadata.unlisted)
    .slice(0, count)
    .map((post) => ({
      title: post.metadata.title,
      permalink: post.metadata.permalink,
      date: post.metadata.date.toString(),
      description: post.metadata.description,
      authors: post.metadata.authors.map((author) => ({
        name: author.name,
        imageURL: author.imageURL,
      })),
    }));
}
