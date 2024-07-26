/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  useBlogAuthorsPostsPageTitle,
  BlogAuthorsViewAllLabel,
} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogAuthorsPostsPage';
import BlogPostItems from '@theme/BlogPostItems';
import Heading from '@theme/Heading';
import Author from '@theme/BlogPostItem/Header/Author';

import styles from './styles.module.css';

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
          <BlogAuthorsViewAllLabel />
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
