/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import {MDXProvider} from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents';
import type {Props} from '@theme/MDXContent';

export default function MDXContent({children}: Props): JSX.Element {
  return <MDXProvider components={MDXComponents}>{children}</MDXProvider>;
}
