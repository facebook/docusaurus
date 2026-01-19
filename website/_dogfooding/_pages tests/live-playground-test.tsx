/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Playground from '@theme/Playground';

export default function LivePlaygroundTest(): JSX.Element {
  return (
    <Layout title="Test Reset Button">
      <div style={{padding: '2rem'}}>
        <Heading as="h1">Reset Button Feature</Heading>
        <p>Edit the code below and use the Reset button to restore it!</p>

        <Playground>
          {`function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
        </Playground>
      </div>
    </Layout>
  );
}
