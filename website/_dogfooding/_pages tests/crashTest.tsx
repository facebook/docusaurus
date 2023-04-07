/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

// We only crash the page if siteConfig.customFields.crashTest === true
function useBoom(): boolean {
  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();

  return (customFields as {crashTest?: boolean}).crashTest ?? false;
}

function boomRoot() {
  throw new Error('Boom root');
}

function boomParent() {
  try {
    boomRoot();
  } catch (err) {
    throw new Error('Boom parent', {cause: err as Error});
  }
}

function BoomComponent() {
  const boom = useBoom();
  return <>{boom && boomParent()}</>;
}

export default function CrashTestPage(): JSX.Element {
  return (
    <Layout>
      {/* eslint-disable-next-line @docusaurus/prefer-docusaurus-heading */}
      <h1>This crash if customFields.crashTest = true</h1>
      <BoomComponent />
    </Layout>
  );
}
