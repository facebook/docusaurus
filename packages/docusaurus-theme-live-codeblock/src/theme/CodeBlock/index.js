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
import ReactLiveScope from '@theme/ReactLiveScope';
import CodeBlock from '@theme-init/CodeBlock';
import {useMDXComponents} from '@mdx-js/react';

// Returns components that are available to use by the react-live playground
// It's not possible to import anything in the live playground,
// we need to provide the available imports manually
// See https://github.com/facebook/docusaurus/issues/2807
const useReactLiveScope = () => {
  const mdxComponents = useMDXComponents();
  return {
    ...mdxComponents,
    ...ReactLiveScope,
  };
};

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    const {isClient} = useDocusaurusContext();
    const prismTheme = usePrismTheme();
    const reactLiveScope = useReactLiveScope();

    if (props.live) {
      return (
        <Playground
          key={isClient}
          scope={reactLiveScope}
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
