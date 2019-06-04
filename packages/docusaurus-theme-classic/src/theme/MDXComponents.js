/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from './components/CodeBlock';

export default {
  code: CodeBlock,
  a: Link,
  pre: props => (
    <pre
      className="pre"
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'inherit',
        padding: 0,
        boxSizing: 'border-box',
      }}
      {...props}
    />
  ),
};
