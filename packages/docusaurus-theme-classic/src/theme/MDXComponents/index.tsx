/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {isValidElement} from 'react';
import Link from '@docusaurus/Link';
import CodeBlock, {Props} from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import type {MDXComponentsObject} from '@theme/MDXComponents';

const MDXComponents: MDXComponentsObject = {
  code: (props) => {
    const {children} = props;
    if (typeof children === 'string') {
      if (!children.includes('\n')) {
        return <code {...props} />;
      }
      return <CodeBlock {...props} />;
    }
    return children;
  },
  a: (props) => <Link {...props} />,
  pre: (props: any) => {
    const {children} = props;
    return (
      <CodeBlock
        {...((isValidElement(children)
          ? children?.props
          : {children}) as Props)}
      />
    );
  },
  h1: Heading('h1'),
  h2: Heading('h2'),
  h3: Heading('h3'),
  h4: Heading('h4'),
  h5: Heading('h5'),
  h6: Heading('h6'),
};

export default MDXComponents;
