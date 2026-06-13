/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ComponentProps, ReactNode} from 'react';
import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import CodeInline from '@theme/CodeInline';
import type {Props} from '@theme/MDXComponents/Code';

function containsNewline(node: ReactNode): boolean {
  if (typeof node === 'string') {
    return node.includes('\n');
  }
  if (React.isValidElement(node)) {
    return React.Children.toArray(
      (node as React.ReactElement<{children?: ReactNode}>).props.children,
    ).some(containsNewline);
  }
  return false;
}

function shouldBeInline(props: Props) {
  return (
    // empty code blocks have no props.children,
    // see https://github.com/facebook/docusaurus/pull/9704
    typeof props.children !== 'undefined' &&
    React.Children.toArray(props.children).every((el) => !containsNewline(el))
  );
}

export default function MDXCode(props: Props): ReactNode {
  return shouldBeInline(props) ? (
    <CodeInline {...props} />
  ) : (
    <CodeBlock {...(props as ComponentProps<typeof CodeBlock>)} />
  );
}
