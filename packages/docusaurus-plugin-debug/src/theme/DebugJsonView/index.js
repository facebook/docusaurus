/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';
// import styles from './styles.module.css'

// avoids "react-json-view" to display  "root"
const RootName = false;

// Seems ReactJson does not work with SSR
// https://github.com/mac-s-g/react-json-view/issues/121
const BrowserOnlyReactJson = (props) => {
  return (
    <BrowserOnly>
      {() => {
        const ReactJson = require('react-json-view').default;
        return <ReactJson {...props} />;
      }}
    </BrowserOnly>
  );
};

function DebugJsonView({src, collapseDepth}) {
  return (
    <BrowserOnlyReactJson
      src={src}
      style={{
        marginTop: '10px',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#242526'
      }}
      name={RootName}
      theme="paraiso"
      shouldCollapse={(field) => {
        // By default, we collapse the json for performance reasons
        // See https://github.com/mac-s-g/react-json-view/issues/235
        // Non-root elements that are larger than 50 fields are collapsed
        return field.name !== RootName && Object.keys(field.src).length > 50;
      }}
      collapsed={collapseDepth}
      groupArraysAfterLength="5"
      enableClipboard={false}
      displayDataTypes={false}
    />
  );
}

export default DebugJsonView;
