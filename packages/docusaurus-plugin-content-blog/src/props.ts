/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {TagsListItem, TagModule} from '@docusaurus/utils';
import type {
  Author,
  AuthorItemProp,
  BlogPageAuthors,
  BlogPost,
  BlogSidebar,
  BlogTag,
  BlogTags,
} from '@docusaurus/plugin-content-blog';

export function toTagsProp({blogTags}: {blogTags: BlogTags}): TagsListItem[] {
  return Object.values(blogTags)
    .filter((tag) => !tag.unlisted)
    .map((tag) => ({
      label: tag.label,
      permalink: tag.permalink,
      description: tag.description,
      count: tag.items.length,
    }));
}

export function toTagProp({
  blogTagsListPath,
  tag,
}: {
  blogTagsListPath: string;
  tag: BlogTag;
}): TagModule {
  return {
    label: tag.label,
    permalink: tag.permalink,
    description: tag.description,
    allTagsPath: blogTagsListPath,
    count: tag.items.length,
    unlisted: tag.unlisted,
  };
}

export function toAuthorItemsProp({
  blogPageAuthors,
}: {
  blogPageAuthors: BlogPageAuthors;
}): AuthorItemProp[] {
  return Object.values(blogPageAuthors).map((author) => ({
    ...author,
    count: author.items.length,
  }));
}

// TODO
// export function toAuthorProp({author}: {author: Author}): AuthorItemProp {
//   return {
//     ...author,
//     // TODO
//     count: 1,
//   };
// }

export function toAuthorPageProp({
  author,
  count,
}: {
  author: Author;
  count: number;
}): AuthorItemProp {
  return {
    ...author,
    count,
  };
}

export function toBlogSidebarProp({
  blogSidebarTitle,
  blogPosts,
}: {
  blogSidebarTitle: string;
  blogPosts: BlogPost[];
}): BlogSidebar {
  return {
    title: blogSidebarTitle,
    items: blogPosts.map((blogPost) => ({
      title: blogPost.metadata.title,
      permalink: blogPost.metadata.permalink,
      unlisted: blogPost.metadata.unlisted,
      date: blogPost.metadata.date,
    })),
  };
}
