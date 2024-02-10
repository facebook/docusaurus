/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {type BaseUrlOptions, useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  makeImageStructuredData,
  makePersonStructuredData,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogPostPage/StructuredData';
import StructuredData from '@theme/StructuredData';
import type {BlogPosting, WithContext} from 'schema-dts';
import type {Author} from '@docusaurus/plugin-content-blog';

function getAuthor(authors: Author[]) {
  const authorsStructuredData = authors.map(makePersonStructuredData);
  return {
    author:
      authorsStructuredData.length === 1
        ? authorsStructuredData[0]
        : authorsStructuredData,
  };
}

function getImage(
  image: string | undefined,
  withBaseUrl: (url: string, options?: BaseUrlOptions | undefined) => string,
  title: string,
) {
  return image
    ? {
        image: makeImageStructuredData({
          imageUrl: withBaseUrl(image, {absolute: true}),
          caption: `title image for the blog post: ${title}`,
        }),
      }
    : {};
}

export default function BlogPostStructuredData(props: Props): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();
  const {assets, frontMatter, metadata} = props;
  const {date, title, description} = metadata;

  const image = assets.image ?? frontMatter.image;
  const keywords = frontMatter.keywords ?? [];

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
    ...getAuthor(metadata.authors),
    ...getImage(image, withBaseUrl, title),
    ...(keywords ? {keywords} : {}),
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteConfig.url}${props.blogMetadata.baseBlogPermalink}`,
      name: props.blogMetadata.blogTitle,
    },
  };

  return <StructuredData structuredData={blogPostStructuredData} />;
}
