/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import type {Props as CodeBlockProps} from '@theme/CodeBlock';
import OriginalCodeBlock from '@theme-init/CodeBlock';
import LiveCodeBlock from '@theme/LiveCodeBlock';

// TODO Docusaurus v4: remove special case
//  see packages/docusaurus-mdx-loader/src/remark/mdx1Compat/codeCompatPlugin.ts
//  we can just use the metastring instead
declare module '@theme/CodeBlock' {
  interface Props {
    live?: boolean;
  }
}

function isLiveCodeBlock(
  props: CodeBlockProps,
): props is {live: true; children: string | undefined} {
  return (
    !!props.live &&
    (typeof props.children === 'undefined' ||
      typeof props.children === 'string')
  );
}

export default function CodeBlockEnhancer(props: CodeBlockProps): ReactNode {
  return isLiveCodeBlock(props) ? (
    <LiveCodeBlock {...props} />
  ) : (
    <OriginalCodeBlock {...props} />
  );
}
