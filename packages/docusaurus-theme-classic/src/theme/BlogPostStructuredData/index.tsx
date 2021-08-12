/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import type {Props} from '@theme/BlogPostStructuredData';

function BlogPostStructuredData(props: Props): JSX.Element {
  const {withBaseUrl} = useBaseUrlUtils();
  const {frontMatter, frontMatterAssets, metadata} = props;
  const {date, title, description} = metadata;

  const image = frontMatterAssets.image ?? frontMatter.image;
  const {author} = frontMatter;
  const authorURL = frontMatter.author_url || frontMatter.authorURL;

  // details on structured data support: https://developers.google.com/search/docs/data-types/article#non-amp
  // and https://schema.org/BlogPosting
  const blogPostStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    ...(image ? {image: [withBaseUrl(image, {absolute: true})]} : {}),
    datePublished: date,
    author: {
      '@type': 'Person',
      ...(author ? {name: author} : {}),
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
