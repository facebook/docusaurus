/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/MDXComponents/A';

export default function MDXA(props: Props): ReactNode {
  return <Link {...props} />;
}
