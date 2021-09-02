/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type {Props} from '@theme/DebugJsonView';
import type {ReactJsonViewProps} from 'react-json-view';

// avoids "react-json-view" to display  "root"
const RootName = null;

// Seems ReactJson does not work with SSR
// https://github.com/mac-s-g/react-json-view/issues/121
const BrowserOnlyReactJson = (props: ReactJsonViewProps) => {
  return (
    <BrowserOnly>
      {() => {
        // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
        const ReactJson = require('react-json-view').default;
        return <ReactJson {...props} />;
      }}
    </BrowserOnly>
  );
};

function DebugJsonView({src, collapseDepth}: Props): JSX.Element {
  return (
    <BrowserOnlyReactJson
      // Prop type defined by react-json-view
      // eslint-disable-next-line @typescript-eslint/ban-types
      src={src as object}
      style={{
        marginTop: '10px',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#292a2b',
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
      groupArraysAfterLength={5}
      enableClipboard={false}
      displayDataTypes={false}
    />
  );
}

export default DebugJsonView;
