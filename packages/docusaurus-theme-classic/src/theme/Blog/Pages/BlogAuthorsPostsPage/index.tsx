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
  useBlogAuthorPageTitle,
  BlogAuthorsListViewAllLabel,
} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import {useBlogMetadata} from '@docusaurus/plugin-content-blog/client';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/Blog/Pages/BlogAuthorsPostsPage';
import BlogPostItems from '@theme/BlogPostItems';
import Heading from '@theme/Heading';
import Author from '@theme/Blog/Components/Author';

import styles from './styles.module.css';

function Metadata({author}: Props): JSX.Element {
  const title = useBlogAuthorPageTitle(author);
  return (
    <>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_authors_posts" />
    </>
  );
}

function ViewAllAuthorsLink() {
  const {authorsListPath} = useBlogMetadata();
  return (
    <Link href={authorsListPath}>
      <BlogAuthorsListViewAllLabel />
    </Link>
  );
}

function Content({author, items, sidebar, listMetadata}: Props): JSX.Element {
  const title = useBlogAuthorPageTitle(author);
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
        <ViewAllAuthorsLink />
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
        ThemeClassNames.page.blogAuthorsPostsPage,
      )}>
      <Metadata {...props} />
      <Content {...props} />
    </HtmlClassNameProvider>
  );
}
