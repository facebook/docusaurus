/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import {useThemeConfig, useTitleFormatter} from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

import type {Props} from '@theme/Seo';

export default function Seo({
  title,
  description,
  keywords,
  image,
}: Props): JSX.Element {
  const {image: defaultImage} = useThemeConfig();
  const pageTitle = useTitleFormatter(title);
  const pageImage = useBaseUrl(image || defaultImage, {absolute: true});

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta property="og:title" content={pageTitle} />

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}

      {keywords && (
        <meta
          name="keywords"
          content={
            (Array.isArray(keywords) ? keywords.join(',') : keywords) as string
          }
        />
      )}

      {pageImage && <meta property="og:image" content={pageImage} />}
      {pageImage && <meta name="twitter:image" content={pageImage} />}
      {pageImage && <meta name="twitter:card" content="summary_large_image" />}
    </Head>
  );
}
