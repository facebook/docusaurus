/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import usePrismTheme from '@theme/hooks/usePrismTheme';
import Playground from '@theme/Playground';
import CodeBlock from '@theme-init/CodeBlock';

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    const {isClient} = useDocusaurusContext();
    const prismTheme = usePrismTheme();

    if (props.live) {
      return (
        <Playground
          key={isClient}
          scope={{...React}}
          theme={prismTheme}
          {...props}
        />
      );
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
