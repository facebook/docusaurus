/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  DraftedBannerTitle,
  DraftedBannerMessage,
} from '@docusaurus/theme-common';
import Admonition from '@theme/Admonition';
import type {Props} from '@theme/Drafted';

export default function Drafted({className}: Props): JSX.Element | null {
  return (
    <Admonition
      type="caution"
      title={<DraftedBannerTitle />}
      className={clsx(className, ThemeClassNames.common.draftedBanner)}>
      <DraftedBannerMessage />
    </Admonition>
  );
}
