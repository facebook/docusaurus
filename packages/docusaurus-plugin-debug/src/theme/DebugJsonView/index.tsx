/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type {Props} from '@theme/DebugJsonView';
import type {ReactJsonViewProps} from '@microlink/react-json-view';

// Avoids "react-json-view" displaying "root"
const RootName = null;

// Seems ReactJson does not work with SSR
// https://github.com/mac-s-g/react-json-view/issues/121
function BrowserOnlyReactJson(props: ReactJsonViewProps) {
  return (
    <BrowserOnly>
      {() => {
        const {default: ReactJson} =
          // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
          require('@microlink/react-json-view') as typeof import('@microlink/react-json-view');
        return <ReactJson {...props} />;
      }}
    </BrowserOnly>
  );
}

export default function DebugJsonView({
  src,
  collapseDepth,
}: Props): JSX.Element {
  return (
    <BrowserOnlyReactJson
      src={src as object}
      style={{
        marginTop: '10px',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#292a2b',
      }}
      name={RootName}
      theme="paraiso"
      shouldCollapse={(field) =>
        // By default, we collapse the json for performance reasons
        // See https://github.com/mac-s-g/react-json-view/issues/235
        // Non-root elements that are larger than 50 fields are collapsed
        field.name !== RootName && Object.keys(field.src).length > 50
      }
      collapsed={collapseDepth}
      groupArraysAfterLength={5}
      enableClipboard={false}
      displayDataTypes={false}
    />
  );
}
