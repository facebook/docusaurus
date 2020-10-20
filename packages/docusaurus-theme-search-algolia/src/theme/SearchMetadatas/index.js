/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';

// Override default/agnostic SearchMetas to use Algolia-specific metadatas
export default function AlgoliaSearchMetadatas({language, version, tag}) {
  return (
    <Head>
      {language && <meta name="docsearch:language" content={`${language}`} />}
      {version && <meta name="docsearch:version" content={version} />}
      {tag && <meta name="docsearch:docusaurus_tag" content={tag} />}
    </Head>
  );
}
