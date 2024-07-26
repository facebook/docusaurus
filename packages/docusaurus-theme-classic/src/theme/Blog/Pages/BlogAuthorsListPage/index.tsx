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
import {translateBlogAuthorsListPageTitle} from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import type {Props} from '@theme/Blog/Pages/BlogAuthorsListPage';
import SearchMetadata from '@theme/SearchMetadata';
import Heading from '@theme/Heading';
import Author from '@theme/Blog/Components/Author';
import styles from './styles.module.css';

function AuthorsList({authors}: {authors: Props['authors']}): JSX.Element {
  return (
    <section className={clsx('margin-vert--lg', styles.section)}>
      {authors.map((author) => (
        <Author
          key={author.key}
          author={author}
          singleAuthor
          count={author.count}
        />
      ))}
    </section>
  );
}

export default function BlogAuthorsListPage({
  authors,
  sidebar,
}: Props): JSX.Element {
  const title: string = translateBlogAuthorsListPageTitle();
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorsListPage,
      )}>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_authors_list" />
      <BlogLayout sidebar={sidebar}>
        <Heading as="h1">{title}</Heading>
        <AuthorsList authors={authors} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
