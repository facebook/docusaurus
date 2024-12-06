/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, Suspense} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const HeavyComponentLazy = React.lazy(
  () => import('./_components/heavyComponent'),
);

export default function React18Tests(): ReactNode {
  return (
    <Layout>
      <main style={{padding: 30}}>
        <Heading as="h1">React 18 tests</Heading>

        <hr />

        <Heading as="h2">{'Suspense > HeavyComponent'}</Heading>
        <Suspense fallback="[Suspense fallback] - Suspense > HeavyComponent">
          <HeavyComponentLazy />
        </Suspense>

        <hr />

        <Heading as="h2">{'BrowserOnly > Suspense > HeavyComponent'}</Heading>
        <BrowserOnly>
          {() => (
            <Suspense fallback="[Suspense fallback] - BrowserOnly > Suspense > HeavyComponent">
              <HeavyComponentLazy />
            </Suspense>
          )}
        </BrowserOnly>

        <hr />

        <Heading as="h2">{'Suspense > BrowserOnly > HeavyComponent'}</Heading>
        <Suspense fallback="[Suspense fallback] - Suspense > BrowserOnly > HeavyComponent">
          <BrowserOnly>{() => <HeavyComponentLazy />}</BrowserOnly>
        </Suspense>
      </main>
    </Layout>
  );
}
