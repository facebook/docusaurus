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
    <div style={{padding: 10}}>
      <BrowserWindow
        url={url}
        style={{minWidth: '40vw', maxWidth: 400}}
        bodyStyle={{padding: 0}}>
        <iframe src={url} title={url} style={{width: '100%', height: 300}} />
      </BrowserWindow>
    </div>
  );
}

// See https://github.com/facebook/docusaurus/issues/8672
export default function Embeds(): JSX.Element {
  return (
    <Layout>
      <div style={{padding: 10}}>
        <Heading as="h1">Test Embeds</Heading>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <IframeTest url="/?docusaurus-theme=light" />
          <IframeTest url="/?docusaurus-theme=dark" />
          <IframeTest url="/?docusaurus-theme=unexpected-value" />
          <IframeTest url="/" />
          <IframeTest url="https://docusaurus.io/" />
          <IframeTest url="https://tutorial.docusaurus.io/" />
        </div>
      </div>
    </Layout>
  );
}
