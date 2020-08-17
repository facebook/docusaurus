/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import BrowserOnly from '@docusaurus/BrowserOnly';

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

function DebugJsonView({src}) {
  return (
    <BrowserOnlyReactJson
      src={src}
      name={RootName}
      shouldCollapse={(field) => {
        // By default, we collapse the json for performance reasons
        // See https://github.com/mac-s-g/react-json-view/issues/235
        // only the "root" is not collapsed
        return field.name !== RootName;
      }}
    />
  );
}

export default DebugJsonView;
