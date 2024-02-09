/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  makeImageStructuredData,
  makePersonStructuredData,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogPostPage/StructuredData';
import StructuredData from '@theme/StructuredData';
import type {BlogPosting, WithContext} from 'schema-dts';

export default function BlogPostStructuredData(props: Props): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();
  const {assets, frontMatter, metadata} = props;
  const {date, title, description} = metadata;

  const image = assets.image ?? frontMatter.image;
  const keywords = frontMatter.keywords ?? [];

  // an array of https://schema.org/Person
  const authorsStructuredData = metadata.authors.map(makePersonStructuredData);

  const url = `${siteConfig.url}${metadata.permalink}`;

  // details on structured data support: https://schema.org/BlogPosting
  // BlogPosting is one of the structured data types that Google explicitly
  // supports: https://developers.google.com/search/docs/appearance/structured-data/article#structured-data-type-definitions
  const blogPostStructuredData: WithContext<BlogPosting> = {
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
          image: makeImageStructuredData({
            imageUrl: withBaseUrl(image, {absolute: true}),
            caption: `title image for the blog post: ${title}`,
          }),
        }
      : {}),
    ...(keywords ? {keywords} : {}),
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteConfig.url}${props.blogMetadata.baseBlogPermalink}`,
      name: props.blogMetadata.blogTitle,
    },
  };

  return <StructuredData structuredData={blogPostStructuredData} />;
}
