/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Translate from '@docusaurus/Translate';
import Head from '@docusaurus/Head';

export function UnlistedBannerTitle(): JSX.Element {
  return (
    <Translate
      id="theme.unlistedContent.title"
      description="The unlisted content banner title">
      Unlisted page
    </Translate>
  );
}

export function UnlistedBannerMessage(): JSX.Element {
  return (
    <Translate
      id="theme.unlistedContent.message"
      description="The unlisted content banner message">
      This page is unlisted. Search engines will not index it, and only users
      having a direct link can access it.
    </Translate>
  );
}

export function UnlistedMetadata(): JSX.Element {
  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
}
