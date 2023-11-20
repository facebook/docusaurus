/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {JsonView, darkStyles} from 'react-json-view-lite';
import type {Props} from '@theme/DebugJsonView';
import 'react-json-view-lite/dist/index.css';

// Avoids "react-json-view-lite" displaying "root"
const RootName = undefined;

export default function DebugJsonView({
  src,
  collapseDepth,
}: Props): JSX.Element {
  return (
    <JsonView
      data={src as object}
      shouldExpandNode={(idx, value, field) => {
        const hasCollapseDepth = collapseDepth !== undefined;
        const keyLength = Object.keys(value).length;

        const shouldExpandByLength = keyLength < 50 && keyLength > 0;
        const shouldExpandByDepth = hasCollapseDepth && idx < collapseDepth;
        const isRootField = field === RootName;

        return (isRootField || shouldExpandByDepth) && shouldExpandByLength;
      }}
      style={darkStyles}
    />
  );
}
