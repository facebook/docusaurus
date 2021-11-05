/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import type {Props} from '@theme/DocCategoryGeneratedIndex';

export default function DocCategoryGeneratedIndex(props: Props): JSX.Element {
  return (
    <>
      <h1>{props.categoryIndex.label}</h1>
      <div>{JSON.stringify(props.categoryIndex)}</div>
    </>
  );
}
