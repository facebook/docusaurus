/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';

import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {useTitleFormatter} from './generalUtils';

interface PageMetadataProps {
  readonly title?: string;
  readonly description?: string;
  readonly keywords?: readonly string[] | string;
  readonly image?: string;
  readonly htmlClassNames?: string[];
  readonly children?: ReactNode;
}

// Helper component to manipulate page metadata and override site defaults
export function PageMetadata({
  title,
  description,
  keywords,
  image,
  htmlClassNames,
  children,
}: PageMetadataProps): JSX.Element {
  const pageTitle = useTitleFormatter(title);
  const {withBaseUrl} = useBaseUrlUtils();
  const pageImage = image ? withBaseUrl(image, {absolute: true}) : undefined;

  return (
    <Head>
      {title && <title>{pageTitle}</title>}
      {title && <meta property="og:title" content={pageTitle} />}

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

      {htmlClassNames && <html className={htmlClassNames.join(' ')} />}

      {children}
    </Head>
  );
}
