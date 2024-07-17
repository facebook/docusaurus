/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  useBlogPostsPlural,
} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogAuthorsPostsPage';
import BlogPostItems from '@theme/BlogPostItems';
import Heading from '@theme/Heading';
import Author from '@theme/BlogPostItem/Header/Author';

import styles from './styles.module.css';

function useBlogAuthorsPostsPageTitle(author: Props['author']): string {
  const blogPostsPlural = useBlogPostsPlural();
  return translate(
    {
      id: 'theme.blog.authorTitle',
      description: 'The title of the page for a blog author',
      message: '{nPosts} contributed by "{authorName}"',
    },
    {
      nPosts: blogPostsPlural(author.count),
      authorName: author.name || author.imageURL || '',
    },
  );
}

function BlogAuthorsPostsPageMetadata({author}: Props): JSX.Element {
  const title = useBlogAuthorsPostsPageTitle(author);
  return (
    <>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_authors_posts" />
    </>
  );
}

function BlogAuthorsPostsPageContent({
  author,
  items,
  sidebar,
  listMetadata,
  authorsPageLink,
}: Props): JSX.Element {
  const title = useBlogAuthorsPostsPageTitle(author);
  return (
    <BlogLayout sidebar={sidebar}>
      <header className="margin-bottom--xl">
        <Heading as="h1">{title}</Heading>
        <Author
          author={author}
          singleAuthor
          className={clsx(styles.postsPageAuthor)}
        />
        {author.description && <p>{author.description}</p>}
        <Link href={authorsPageLink}>
          <Translate
            id="theme.authors.authorsPageLink"
            description="The label of the link targeting the author list page">
            View All Authors
          </Translate>
        </Link>
      </header>
      <BlogPostItems items={items} />
      <BlogListPaginator metadata={listMetadata} />
    </BlogLayout>
  );
}
export default function BlogAuthorsPostsPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorPostListPage,
      )}>
      <BlogAuthorsPostsPageMetadata {...props} />
      <BlogAuthorsPostsPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
