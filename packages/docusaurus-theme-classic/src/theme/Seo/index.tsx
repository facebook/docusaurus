/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useTitleFormatter} from '@docusaurus/theme-common';
import type {Props} from '@theme/Seo';

export default function Seo({
  title,
  description,
  keywords,
  image,
}: Props): JSX.Element {
  const metaTitle = useTitleFormatter(title);
  const metaImageUrl = useBaseUrl(image, {absolute: true});

  return (
    <Head>
      {title && <title>{metaTitle}</title>}
      {title && <meta property="og:title" content={metaTitle} />}

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

      {image && <meta property="og:image" content={metaImageUrl} />}
      {image && <meta name="twitter:image" content={metaImageUrl} />}
      {image && <meta name="twitter:card" content="summary_large_image" />}
    </Head>
  );
}
