/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import type {Props} from '@theme/CodeBlock/Token';

export default function CodeBlockToken(props: Props): ReactNode {
  // We omit the "line" information in the default rendering,
  // but its meant for devs who devs who Swizzle this component.
  const {line, ...tokenProps} = props;
  return <span {...tokenProps} />;
}
