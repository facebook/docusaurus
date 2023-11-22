/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {JsonView} from 'react-json-view-lite';
import type {Props} from '@theme/DebugJsonView';
import './styles.module.css';

const paraisoStyles = {
  container: 'container-paraiso',
  basicChildStyle: 'basic-element-paraiso',
  label: 'label-paraiso',
  nullValue: 'null-value-paraiso',
  undefinedValue: 'undefined-value-paraiso',
  stringValue: 'string-value-paraiso',
  booleanValue: 'boolean-value-paraiso',
  numberValue: 'number-value-paraiso',
  otherValue: 'other-value-paraiso',
  punctuation: 'punctuation-paraiso',
  collapseIcon: 'collapse-icon-paraiso',
  expandIcon: 'expand-icon-paraiso',
  collapsedContent: 'collapse-content-paraiso',
};

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
      style={paraisoStyles}
    />
  );
}
