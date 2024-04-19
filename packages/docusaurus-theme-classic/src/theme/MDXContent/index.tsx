/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import MDXComponents from '@theme/MDXComponents';
import type {Props} from '@theme/MDXContent';

// TODO temporary, need to find a solution :/
const MDXProvider = React.lazy(async () => {
  const lib = await import('@mdx-js/react');
  return {default: lib.MDXProvider};
});

export default function MDXContent({children}: Props): JSX.Element {
  return <MDXProvider components={MDXComponents}>{children}</MDXProvider>;
}
