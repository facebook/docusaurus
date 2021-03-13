/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';

export type Props = {
  readonly children: ReactNode;
  readonly value: string;
  readonly hidden: boolean;
  readonly className: string;
};

function TabItem({children, hidden, className}: Props): JSX.Element {
  return (
    <div role="tabpanel" {...{hidden, className}}>
      {children}
    </div>
  );
}

export default TabItem;
