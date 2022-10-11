/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import Playground from '@theme/Playground';
import ReactLiveScope from '@theme/ReactLiveScope';
import CodeBlock, {type Props} from '@theme-init/CodeBlock';
import ErrorPageContent from '@theme/ErrorPageContent';

const withLiveEditor = (Component: typeof CodeBlock) => {
  function WrappedComponent(props: Props) {
    if (props.live) {
      return (
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {/* @ts-expect-error: we have deliberately widened the type of language prop */}
          <Playground scope={ReactLiveScope} {...props} />
        </ErrorBoundary>
      );
    }

    return <Component {...props} />;
  }

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
