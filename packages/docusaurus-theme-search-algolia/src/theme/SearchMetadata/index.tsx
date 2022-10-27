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
      {locale && <meta name="docsearch:language" content={locale} />}
      {version && <meta name="docsearch:version" content={version} />}
      {tag && <meta name="docsearch:docusaurus_tag" content={tag} />}
    </Head>
  );
}
