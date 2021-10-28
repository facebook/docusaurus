import React from 'react';
import Layout from '@theme/Layout';

// Repro for hydration issue https://github.com/facebook/docusaurus/issues/5617
function BuggyText() {
  return (
    <span>
      Built using the{' '}
      <a href="https://www.electronjs.org/" target="_blank">
        Electron
      </a>{' '}
      , based on{' '}
      <a href="https://www.chromium.org/" target="_blank">
        Chromium
      </a>
      , and written using{' '}
      <a href="https://www.typescriptlang.org/" target="_blank">
        TypeScript
      </a>{' '}
      , Xplorer promises you an unprecedented experience.
    </span>
  );
}

export default function Home() {
  return (
    <Layout>
      <BuggyText />
    </Layout>
  );
}
