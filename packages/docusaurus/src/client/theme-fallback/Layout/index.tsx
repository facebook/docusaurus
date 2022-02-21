/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {Props} from '@theme/Layout';

function Layout({children, title, description}: Props): JSX.Element {
  const context = useDocusaurusContext();
  const {siteConfig} = context;
  const {favicon, tagline, title: defaultTitle} = siteConfig;
  const faviconUrl = useBaseUrl(favicon);
  return (
    <>
      <Head defaultTitle={`${defaultTitle}${tagline ? ` · ${tagline}` : ''}`}>
        {title && <title>{`${title} · ${tagline}`}</title>}
        {favicon && <link rel="icon" href={faviconUrl} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
      </Head>
      {children}
    </>
  );
}

export default Layout;
