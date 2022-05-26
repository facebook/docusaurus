/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ComponentProps} from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Highlight from '@site/src/components/Highlight';

export default {
  ...MDXComponents,
  highlight: (props: ComponentProps<typeof Highlight>): JSX.Element => (
    <Highlight {...props} />
  ),
};
