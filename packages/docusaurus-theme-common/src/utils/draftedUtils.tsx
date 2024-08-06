/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Translate from '@docusaurus/Translate';

export function DraftedBannerTitle(): JSX.Element {
  return (
    <Translate
      id="theme.draftedContent.title"
      description="The drafted content banner title">
      Drafted page
    </Translate>
  );
}

export function DraftedBannerMessage(): JSX.Element {
  return (
    <Translate
      id="theme.draftedContent.message"
      description="The drafted content banner message">
      This page is drafted and will be excluded from production build.
    </Translate>
  );
}
