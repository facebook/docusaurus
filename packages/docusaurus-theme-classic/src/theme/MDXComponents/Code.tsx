/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ComponentProps} from 'react';
import React, {isValidElement} from 'react';
import CodeBlock from '@theme/CodeBlock';
import type {Props} from '@theme/MDXComponents/Code';

// Keep this component for now, might be useful to swizzle it?
export default function MDXCode(props: Props): JSX.Element {
  return <CodeBlock {...(props as ComponentProps<typeof CodeBlock>)} />;
}
