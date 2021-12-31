/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useState} from 'react';

export default function ErrorBoundaryTestButton({
  children = 'Boom!',
}: {
  children?: ReactNode;
}): JSX.Element {
  const [state, setState] = useState(false);
  if (state) {
    throw new Error('Boom!');
  }
  return (
    <button type="button" onClick={() => setState(true)}>
      {children}
    </button>
  );
}
