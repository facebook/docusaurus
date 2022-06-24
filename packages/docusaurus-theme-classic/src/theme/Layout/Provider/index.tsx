/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {ThemeCommonProvider} from '@docusaurus/theme-common';
import type {Props} from '@theme/Layout/Provider';

export default function LayoutProvider({children}: Props): JSX.Element {
  return <ThemeCommonProvider>{children}</ThemeCommonProvider>;
}
