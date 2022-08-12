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
    siteMetadata: {docusaurusVersion},
    siteConfig: {favicon, title, noIndex},
    i18n: {currentLocale, localeConfigs},
  } = useDocusaurusContext();
  const faviconUrl = useBaseUrl(favicon);
  const {htmlLang, direction: htmlDir} = localeConfigs[currentLocale]!;

  return (
    <Head>
      <html lang={htmlLang} dir={htmlDir} />
      <meta charSet="UTF-8" />
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="generator" content={`Docusaurus v${docusaurusVersion}`} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {favicon && <link rel="icon" href={faviconUrl} />}
    </Head>
  );
}
