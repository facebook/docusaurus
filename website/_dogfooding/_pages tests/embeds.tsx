/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import BrowserWindow from '@site/src/components/BrowserWindow';

function IframeTest({url}: {url: string}) {
  return (
    <BrowserWindow url={url} bodyStyle={{padding: 0, height: '100%'}}>
      <iframe src={url} title={url} style={{width: '100%', height: 300}} />
    </BrowserWindow>
  );
}

// See https://github.com/facebook/docusaurus/issues/8672
export default function Embeds(): JSX.Element {
  return (
    <Layout>
      <div style={{padding: 10}}>
        <Heading as="h1">Test Embeds</Heading>
        <IframeTest url="https://docusaurus.io/" />
        <IframeTest url="https://tutorial.docusaurus.io/" />
        <IframeTest url="https://deploy-preview-8708--docusaurus-2.netlify.app/" />
        <IframeTest url="http://localhost:3000/" />
      </div>
    </Layout>
  );
}
