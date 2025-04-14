/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {LiveProvider} from 'react-live';
import {usePrismTheme} from '@docusaurus/theme-common';

import type {Props} from '@theme/Playground/Provider';

// this should rather be a stable function
// see https://github.com/facebook/docusaurus/issues/9630#issuecomment-1855682643
const DEFAULT_TRANSFORM_CODE = (code: string) => `${code};`;

export default function PlaygroundProvider({
  code,
  children,
  ...props
}: Props): ReactNode {
  const prismTheme = usePrismTheme();
  const noInline = props.metastring?.includes('noInline') ?? false;
  return (
    <LiveProvider
      noInline={noInline}
      theme={prismTheme}
      {...props}
      code={code?.replace(/\n$/, '')}
      transformCode={props.transformCode ?? DEFAULT_TRANSFORM_CODE}>
      {children}
    </LiveProvider>
  );
}
