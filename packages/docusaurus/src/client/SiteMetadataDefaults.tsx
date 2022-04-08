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

export default function SiteMetadataDefaults(): JSX.Element {
  const {
    siteConfig: {favicon, tagline, title},
    i18n: {currentLocale, localeConfigs},
  } = useDocusaurusContext();
  const faviconUrl = useBaseUrl(favicon);
  const {htmlLang, direction: htmlDir} = localeConfigs[currentLocale]!;

  return (
    <Head defaultTitle={`${title}${tagline ? ` · ${tagline}` : ''}`}>
      <html lang={htmlLang} dir={htmlDir} />
      {favicon && <link rel="icon" href={faviconUrl} />}
    </Head>
  );
}
