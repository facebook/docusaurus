/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

// Repro for hydration issue https://github.com/facebook/docusaurus/issues/5617
function BuggyText() {
  return (
    <span>
      Built using the{' '}
      <a href="https://www.electronjs.org/" target="_blank" rel="noreferrer">
        Electron
      </a>{' '}
      , based on{' '}
      <a href="https://www.chromium.org/" target="_blank" rel="noreferrer">
        Chromium
      </a>
      , and written using{' '}
      <a
        href="https://www.typescriptlang.org/"
        target="_blank"
        rel="noreferrer">
        TypeScript
      </a>{' '}
      , Xplorer promises you an unprecedented experience.
    </span>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout>
      <BuggyText />
    </Layout>
  );
}
