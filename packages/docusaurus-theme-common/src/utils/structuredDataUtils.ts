/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useBaseUrlUtils, type BaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props as BlogListPageStructuredDataProps} from '@theme/BlogListPage/StructuredData';
import type {Props as BlogPostPageStructuredDataProps} from '@theme/BlogPostPage/StructuredData';
import type {
  Blog,
  BlogPosting,
  WithContext,
  Person,
  ImageObject,
} from 'schema-dts';
import type {
  Author,
  PropBlogPostContent,
} from '@docusaurus/plugin-content-blog';
import type {DocusaurusConfig} from '@docusaurus/types';

function getBlogPost(
  blogPostContent: PropBlogPostContent,
  siteConfig: DocusaurusConfig,
  withBaseUrl: BaseUrlUtils['withBaseUrl'],
) {
  const {assets, frontMatter, metadata} = blogPostContent;
  const {date, title, description} = metadata;

  const image = assets.image ?? frontMatter.image;
  const keywords = frontMatter.keywords ?? [];

  const blogUrl = `${siteConfig.url}${metadata.permalink}`;

  return {
    '@type': 'BlogPosting',
    '@id': blogUrl,
    mainEntityOfPage: blogUrl,
    url: blogUrl,
    headline: title,
    name: title,
    description,
    datePublished: date,
    ...getAuthor(metadata.authors),
    ...getImage(image, withBaseUrl, title),
    ...(keywords ? {keywords} : {}),
  };
}

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
  withBaseUrl: BaseUrlUtils['withBaseUrl'],
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

export function useBlogListPageStructuredData(
  props: BlogListPageStructuredDataProps,
): WithContext<Blog> {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();

  const {
    metadata: {blogDescription, blogTitle, permalink},
  } = props;

  const url = `${siteConfig.url}${permalink}`;

  // details on structured data support: https://schema.org/Blog
  const blogStructuredData: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    mainEntityOfPage: url,
    headline: blogTitle,
    description: blogDescription,
    blogPost: props.items.map((blogItem) =>
      getBlogPost(blogItem.content, siteConfig, withBaseUrl),
    ),
  };

  return blogStructuredData;
}

export function useBlogPostStructuredData(
  props: BlogPostPageStructuredDataProps,
): WithContext<BlogPosting> {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();
  const {assets, metadata} = props;
  const {date, title, description, frontMatter} = metadata;

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
      '@id': `${siteConfig.url}${props.blogMetadata.blogBasePath}`,
      name: props.blogMetadata.blogTitle,
    },
  };

  return blogPostStructuredData;
}

/** @returns A {@link https://schema.org/Person} constructed from the {@link Author} */
export function makePersonStructuredData(author: Author): Person {
  return {
    '@type': 'Person',
    ...(author.name ? {name: author.name} : {}),
    ...(author.title ? {description: author.title} : {}),
    ...(author.url ? {url: author.url} : {}),
    ...(author.email ? {email: author.email} : {}),
    ...(author.imageURL ? {image: author.imageURL} : {}),
  };
}

/** @returns A {@link https://schema.org/ImageObject} */
export function makeImageStructuredData({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption: string;
}): ImageObject {
  return {
    '@type': 'ImageObject',
    '@id': imageUrl,
    url: imageUrl,
    contentUrl: imageUrl,
    caption,
  };
}
