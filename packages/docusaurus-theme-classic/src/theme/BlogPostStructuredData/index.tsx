/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import type {Props} from '@theme/BlogPostStructuredData';

function BlogPostStructuredData(props: Props): JSX.Element {
  const {frontMatter, frontMatterAssets, metadata} = props;
  const {date, title, description} = metadata;

  const image = frontMatterAssets.image ?? frontMatter.image;

  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorTitle = frontMatter.author_title || frontMatter.authorTitle;

  // details on structured data support: https://developers.google.com/search/docs/data-types/article#non-amp
  // and https://schema.org/BlogPosting
  const blogPostStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    ...(image ? {image: [image]} : {}),
    datePublished: date,
    author: {
      '@type': 'Person',
      name: authorTitle,
      url: authorURL,
    },
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(blogPostStructuredData)}
      </script>
    </Head>
  );
}

export default BlogPostStructuredData;
