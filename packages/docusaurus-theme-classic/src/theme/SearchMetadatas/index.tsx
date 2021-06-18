/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import type {Props} from '@theme/SearchMetadatas';

// Note: we don't couple this to Algolia/DocSearch on purpose
// We may want to support other search engine plugins too
// Search plugins should swizzle/override this comp to add their behavior
export default function SearchMetadatas({
  locale,
  version,
  tag,
}: Props): JSX.Element {
  return (
    <Head>
      {locale && <meta name="docusaurus_locale" content={locale} />}
      {version && <meta name="docusaurus_version" content={version} />}
      {tag && <meta name="docusaurus_tag" content={tag} />}
    </Head>
  );
}
