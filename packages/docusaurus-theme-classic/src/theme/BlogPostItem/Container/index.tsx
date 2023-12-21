/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/BlogPostItem/Container';

export default function BlogPostItemContainer({
  children,
  className,
}: Props): JSX.Element {
  const {
    frontMatter,
    assets,
    metadata: {description},
  } = useBlogPost();
  const {withBaseUrl} = useBaseUrlUtils();
  const image = assets.image ?? frontMatter.image;
  const keywords = frontMatter.keywords ?? [];
  return (
    <article
      className={className}
      itemProp="blogPost"
      itemScope
      itemType="https://schema.org/BlogPosting">
      {description && <meta itemProp="description" content={description} />}
      {image && (
        <link itemProp="image" href={withBaseUrl(image, {absolute: true})} />
      )}
      {keywords.length > 0 && (
        <meta itemProp="keywords" content={keywords.join(',')} />
      )}
      {children}
    </article>
  );
}
