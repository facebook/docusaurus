/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import BrowserWindow from './index';

// Quick and dirty component, to improve later if needed
export default function IframeWindow({url}: {url: string}): JSX.Element {
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
