/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import type {Props} from '@theme/DocCategory';

export default function DocCategory(props: Props): JSX.Element {
  return (
    <>
      <h1>Category!</h1>
      <div>{JSON.stringify(props.category)}</div>
    </>
  );
}
