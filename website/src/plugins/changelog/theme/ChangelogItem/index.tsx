/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import {MDXProvider} from '@mdx-js/react';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import MDXComponents from '@theme/MDXComponents';
import type {Props} from '@theme/BlogPostItem';

import styles from './styles.module.css';
import BlogPostAuthors from '@theme/BlogPostAuthors';

function ChangelogItem(props: Props): JSX.Element {
  const {withBaseUrl} = useBaseUrlUtils();
  const {
    children,
    frontMatter,
    assets,
    metadata,
    isBlogPostPage = false,
  } = props;
  const {date, formattedDate, permalink, title, authors} = metadata;

  const image = assets.image ?? frontMatter.image;

  const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';

    return (
      <header>
        <TitleHeading
          className={clsx(
            styles.blogPostTitle,
            isBlogPostPage && styles.blogPostPageTitle,
          )}
          itemProp="headline">
          {isBlogPostPage ? (
            title
          ) : (
            <Link itemProp="url" to={permalink}>
              {title}
            </Link>
          )}
        </TitleHeading>
        <div className={clsx(styles.blogPostData, 'margin-vert--md')}>
          <time dateTime={date} itemProp="datePublished">
            {formattedDate}
          </time>
        </div>
        {/* We only pass down the image. The name only appears in the feed */}
        <BlogPostAuthors
          authors={authors.map(({imageURL, url}) => ({imageURL, url}))}
          assets={assets}
        />
      </header>
    );
  };

  return (
    <article
      className={!isBlogPostPage ? 'margin-bottom--md' : undefined}
      itemProp="blogPost"
      itemScope
      itemType="http://schema.org/BlogPosting">
      {renderPostHeader()}

      {image && (
        <meta itemProp="image" content={withBaseUrl(image, {absolute: true})} />
      )}

      <div className="markdown" itemProp="articleBody">
        <MDXProvider components={MDXComponents}>{children}</MDXProvider>
      </div>
    </article>
  );
}

export default ChangelogItem;
