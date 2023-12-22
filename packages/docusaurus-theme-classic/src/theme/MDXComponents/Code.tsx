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
import CodeInline from '@theme/CodeInline';

export default function MDXCode(props: Props): JSX.Element {
  const shouldBeInline = React.Children.toArray(props.children).every(
    (el) => typeof el === 'string' && !el.includes('\n'),
  );

  return shouldBeInline ? (
    <CodeInline {...(props as ComponentProps<typeof CodeInline>)} />
  ) : (
    <CodeBlock {...(props as ComponentProps<typeof CodeBlock>)} />
  );
}
