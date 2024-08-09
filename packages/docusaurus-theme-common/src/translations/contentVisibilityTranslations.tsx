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
      id="theme.contentVisibility.unlistedBanner.title"
      description="The unlisted content banner title">
      Unlisted page
    </Translate>
  );
}

export function UnlistedBannerMessage(): JSX.Element {
  return (
    <Translate
      id="theme.contentVisibility.unlistedBanner.message"
      description="The unlisted content banner message">
      This page is unlisted. Search engines will not index it, and only users
      having a direct link can access it.
    </Translate>
  );
}

// TODO Docusaurus v4 breaking change (since it's v3 public theme-common API :/)
//  Move this to theme/ContentVisibility/Unlisted
export function UnlistedMetadata(): JSX.Element {
  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
}

export function DraftBannerTitle(): JSX.Element {
  return (
    <Translate
      id="theme.contentVisibility.draftBanner.title"
      description="The draft content banner title">
      Draft page
    </Translate>
  );
}

export function DraftBannerMessage(): JSX.Element {
  return (
    <Translate
      id="theme.contentVisibility.draftBanner.message"
      description="The draft content banner message">
      This page is a draft. It will only be visible in dev and be excluded from
      the production build.
    </Translate>
  );
}
