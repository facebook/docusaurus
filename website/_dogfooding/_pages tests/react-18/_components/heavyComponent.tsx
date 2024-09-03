/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

export default function HeavyComponent(): JSX.Element {
  return (
    <div style={{border: 'solid', margin: 10, padding: 10}}>
      <button type="button" onClick={() => alert('click')}>
        HeavyComponent
      </button>
    </div>
  );
}
