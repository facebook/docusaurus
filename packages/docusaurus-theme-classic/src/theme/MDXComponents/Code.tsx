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

function shouldBeInline(props: Props) {
  return (
    typeof props.children !== 'undefined' &&
    React.Children.toArray(props.children).every(
      (el) => typeof el === 'string' && !el.includes('\n'),
    )
  );
}

export default function MDXCode(props: Props): JSX.Element {
  const inline = shouldBeInline(props);
  return inline ? (
    <code {...props} />
  ) : (
    <CodeBlock {...(props as ComponentProps<typeof CodeBlock>)} />
  );
}
