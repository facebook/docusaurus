/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Playground from '@theme/Playground';
import useIsBrowser from '@docusaurus/useIsBrowser';
import ReactLiveScope from '@theme/ReactLiveScope';
import CodeBlock from '@theme-init/CodeBlock';

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    const isBrowser = useIsBrowser();
    if (props.live && isBrowser) {
      return <Playground scope={ReactLiveScope} {...props} />;
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
