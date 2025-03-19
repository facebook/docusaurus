/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import type {Props} from '@theme/CodeBlock/Token';

export default function CodeBlockToken({output}: Props): ReactNode {
  return <span {...output} />;
}
