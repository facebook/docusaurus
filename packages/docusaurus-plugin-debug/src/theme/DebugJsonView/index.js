/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ReactJson from 'react-json-view';

// avoids "react-json-view" to display  "root"
const RootName = false;

function DebugJsonView({src}) {
  return (
    <ReactJson
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
