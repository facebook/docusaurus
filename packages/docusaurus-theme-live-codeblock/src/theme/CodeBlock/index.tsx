/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {parseCodeBlockMetaOptions} from '@docusaurus/theme-common/internal';
import Playground from '@theme/Playground';
import ReactLiveScope from '@theme/ReactLiveScope';
import CodeBlock, {type Props} from '@theme-init/CodeBlock';

const withLiveEditor = (Component: typeof CodeBlock) => {
  function WrappedComponent(props: Props) {
    const metaOptions = parseCodeBlockMetaOptions(
      props.metastring,
      props.metaOptions,
    );

    const live = props.live ?? metaOptions.live;
    if (live) {
      return (
        <Playground
          scope={ReactLiveScope}
          metaOptions={metaOptions}
          {...props}
        />
      );
    }

    return <Component metaOptions={metaOptions} {...props} />;
  }

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
