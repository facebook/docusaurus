/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ComponentProps} from 'react';
import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import type {Props} from '@theme/MDXComponents/Code';

export default function MDXCode(props: Props): JSX.Element {
  const shouldBeInline = React.Children.toArray(props.children).every(
    (el) => typeof el === 'string' && !el.includes('\n'),
  );

  return shouldBeInline ? (
    <code {...props} />
  ) : (
    <CodeBlock {...(props as ComponentProps<typeof CodeBlock>)} />
  );
}
