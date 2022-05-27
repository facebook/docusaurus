/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Mermaid from '@theme/Mermaid';
import type {Props} from '@theme/MDXComponents/Mermaid';
import useMermaid from '@theme/useMermaid';

export default function MDXMermaid(props: Props): JSX.Element {
  useMermaid();
  return <Mermaid {...props} />;
}
