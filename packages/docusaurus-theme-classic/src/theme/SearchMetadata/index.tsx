/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import type {Props} from '@theme/SearchMetadata';

export default function SearchMetadata({
  locale,
  version,
  tag,
}: Props): JSX.Element {
  return (
    <Head>
      {/*
      Docusaurus metadata, used by third-party search plugin
      See https://github.com/cmfcmf/docusaurus-search-local/issues/99

      TODO: move this component to `docusaurus-search-local` ?
      */}
      {locale && <meta name="docusaurus_locale" content={locale} />}
      {version && <meta name="docusaurus_version" content={version} />}
      {tag && <meta name="docusaurus_tag" content={tag} />}
    </Head>
  );
}
