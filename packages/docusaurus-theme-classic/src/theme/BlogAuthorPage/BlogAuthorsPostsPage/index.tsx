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
  usePluralForm,
} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogAuthorsPostsPage';
import BlogPostItems from '@theme/BlogPostItems';
import Unlisted from '@theme/Unlisted';
import Heading from '@theme/Heading';

// Very simple pluralization: probably good enough for now
function useBlogPostsPlural() {
  const {selectMessage} = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.blog.post.plurals',
          description:
            'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One post|{count} posts',
        },
        {count},
      ),
    );
}

function useBlogAuthorsPostsPageTitle(author: Props['author']): string {
  const blogPostsPlural = useBlogPostsPlural();
  return translate(
    {
      id: 'theme.blog.authorTitle',
      description: 'The title of the page for a blog author',
      message: '{nPosts} contributed by "{authorName}"',
    },
    {nPosts: blogPostsPlural(author.count), authorName: author.name},
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
}: Props): JSX.Element {
  const title = useBlogAuthorsPostsPageTitle(author);
  return (
    <BlogLayout sidebar={sidebar}>
      {author.unlisted && <Unlisted />}
      <header className="margin-bottom--xl">
        <Heading as="h1">{title}</Heading>
        <ul>
          {author.title && <li>{author.title}</li>}
          {author.email && (
            <li>
              <Link href={`mailto:${author.email}`}>{author.email}</Link>
            </li>
          )}
          {author.url && (
            <li>
              <Link href={author.url}>Personnal website</Link>
            </li>
          )}
        </ul>
        <Link href={author.allAuthorsPath}>
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
