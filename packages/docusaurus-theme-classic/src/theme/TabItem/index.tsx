/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';

function TabItem(props: {readonly children: ReactNode}): JSX.Element {
  return <div>{props.children}</div>;
}

export default TabItem;
