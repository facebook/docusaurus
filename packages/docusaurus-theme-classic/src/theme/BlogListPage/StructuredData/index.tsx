/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props} from '@theme/BlogListPage/StructuredData';
import StructuredData from '@theme/StructuredData';

export default function BlogListPageStructuredData(props: Props): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();

  const {
    metadata: {blogDescription, blogTitle, permalink},
  } = props;

  const url = `${siteConfig.url}${permalink}`;

  // details on structured data support: https://schema.org/Blog
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    mainEntityOfPage: url,
    headline: blogTitle,
    description: blogDescription,
    blogPost: props.items.map((blogItem) => {
      const {
        content: {assets, frontMatter, metadata},
      } = blogItem;
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

      const blogUrl = `${siteConfig.url}${metadata.permalink}`;
      const imageUrl = image ? withBaseUrl(image, {absolute: true}) : undefined;

      return {
        '@type': 'BlogPosting',
        '@id': blogUrl,
        mainEntityOfPage: blogUrl,
        url: blogUrl,
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
      };
    }),
  };

  return <StructuredData structuredData={blogStructuredData} />;
}
