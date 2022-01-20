/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import type {Props} from '@theme/BlogListPage';
import {ThemeClassNames} from '@docusaurus/theme-common';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import type {Props as PostProps} from '@theme/BlogPostItem';
// eslint-disable-next-line import/no-extraneous-dependencies
import {MDXProvider} from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents';

import styles from './styles.module.css';
import BlogPostAuthors from '@theme/BlogPostAuthors';

function BlogPostItem(props: PostProps): JSX.Element {
  const {withBaseUrl} = useBaseUrlUtils();
  const {frontMatter, assets, metadata, children} = props;
  const {date, formattedDate, permalink, title, authors} = metadata;

  const image = assets.image ?? frontMatter.image;

  return (
    <article
      className="margin-bottom--md"
      itemProp="blogPost"
      itemScope
      itemType="http://schema.org/BlogPosting">
      <header>
        <h2 className={styles.blogPostTitle} itemProp="headline">
          <Link itemProp="url" to={permalink}>
            {title}
          </Link>
        </h2>
        <div className={clsx(styles.blogPostData, 'margin-vert--md')}>
          <time dateTime={date} itemProp="datePublished">
            {formattedDate}
          </time>
        </div>
        <BlogPostAuthors authors={authors} assets={assets} />
      </header>
      {image && (
        <meta itemProp="image" content={withBaseUrl(image, {absolute: true})} />
      )}
      <div className="markdown" itemProp="articleBody">
        <MDXProvider components={MDXComponents}>{children}</MDXProvider>
      </div>
    </article>
  );
}

function BlogListPage(props: Props): JSX.Element {
  const {metadata, items, sidebar} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  return (
    <BlogLayout
      title={title}
      description={blogDescription}
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogListPage}
      searchMetadata={{
        // assign unique search tag to exclude this page from search results!
        tag: 'blog_posts_list',
      }}
      sidebar={sidebar}>
      {items.map(({content: BlogPostContent}) => (
        <BlogPostItem
          key={BlogPostContent.metadata.permalink}
          frontMatter={BlogPostContent.frontMatter}
          assets={BlogPostContent.assets}
          metadata={BlogPostContent.metadata}
          truncated={BlogPostContent.metadata.truncated}>
          <BlogPostContent />
        </BlogPostItem>
      ))}
      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default BlogListPage;
