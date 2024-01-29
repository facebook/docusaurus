/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props} from '@theme/BlogPostPage/StructuredData';

export default function BlogPostStructuredData(props: Props): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();
  const {assets, frontMatter, metadata} = props;
  const {date, title, description} = metadata;

  const image = assets.image ?? frontMatter.image;
  const keywords = frontMatter.keywords ?? [];

  // an array of https://schema.org/Person
  const authorsStructuredData = metadata.authors.map((author) => ({
    '@type': 'Person',
    ...(author.name ? {name: author.name} : {}),
    ...(author.title ? {description: author.title} : {}),
    ...(author.url ? {url: author.url} : {}),
    ...(author.email ? {email: author.email} : {}),
    ...(author.imageURL ? {image: author.imageURL} : {}),
  }));

  const url = `${siteConfig.url}${metadata.permalink}`;
  const imageUrl = image ? withBaseUrl(image, {absolute: true}) : undefined;

  // details on structured data support: https://schema.org/BlogPosting
  // BlogPosting is one of the structured data types that Google explicitly
  // supports: https://developers.google.com/search/docs/appearance/structured-data/article#structured-data-type-definitions
  const blogPostStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    mainEntityOfPage: url,
    url,
    headline: title,
    name: title,
    description,
    datePublished: date,
    author:
      authorsStructuredData.length === 1
        ? authorsStructuredData[0]
        : authorsStructuredData,
    ...(image
      ? {
          // details on structured data support: https://schema.org/ImageObject
          image: {
            '@type': 'ImageObject',
            '@id': imageUrl,
            url: imageUrl,
            contentUrl: imageUrl,
            caption: `title image for the blog post: ${title}`,
          },
        }
      : {}),
    ...(keywords ? {keywords} : {}),
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteConfig.url}${metadata.baseBlogPermalink}`,
      name: metadata.baseBlogTitle,
    },
  };

  return (
    <script
      type="application/ld+json"
      // We're using dangerouslySetInnerHTML because we want to avoid React
      // transforming quotes into &quot; which upsets parsers.
      // The entire contents is a stringified JSON object so it is safe
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(blogPostStructuredData),
      }}
    />
  );
}
