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

export default function DebugJsonView({
  src,
  collapseDepth,
}: Props): JSX.Element {
  return (
    <JsonView
      data={src as object}
      shouldExpandNode={(idx, value) => {
        if (Array.isArray(value)) {
          return value.length < 5;
        }

        return collapseDepth !== undefined && idx < collapseDepth;
      }}
      style={darkStyles}
    />
  );
}
