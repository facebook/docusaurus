/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';

// Override default/agnostic SearchMetas to use Algolia-specific metadatas
export default function AlgoliaSearchMetadatas({locale, version, tag}) {
  // Seems safe to consider here the locale is the language,
  // as the existing docsearch:language filter is afaik a regular string-based filter
  const language = locale;

  return (
    <Head>
      {language && <meta name="docsearch:language" content={language} />}
      {version && <meta name="docsearch:version" content={version} />}
      {tag && <meta name="docsearch:docusaurus_tag" content={tag} />}
    </Head>
  );
}
