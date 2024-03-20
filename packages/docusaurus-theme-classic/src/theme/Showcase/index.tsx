/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/Showcase';

export default function Showcase(props: Props): JSX.Element {
  return <div>{props.author}</div>;
}
