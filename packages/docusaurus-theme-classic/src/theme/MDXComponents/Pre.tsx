/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {isValidElement} from 'react';
import CodeBlock from '@theme/CodeBlock';
import type {Props} from '@theme/MDXComponents/Pre';

export default function MDXPre(props: Props): JSX.Element {
  return (
    <CodeBlock
      // If this pre is created by a ``` fenced codeblock, unwrap the children
      {...(isValidElement(props.children) &&
      (props.children.props as {originalType: string} | null)?.originalType ===
        'code'
        ? props.children.props
        : {...props})}
    />
  );
}
