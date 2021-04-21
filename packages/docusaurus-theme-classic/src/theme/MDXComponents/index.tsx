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

    // For retrocompatibility purposes (pretty rare use case)
    // See https://github.com/facebook/docusaurus/pull/1584
    if (isValidElement(children)) {
      return children;
    }

    return !children.includes('\n') ? (
      <code {...props} />
    ) : (
      <CodeBlock {...props} />
    );
  },
  a: (props) => <Link {...props} />,
  pre: (props) => {
    const {children} = props as {children: any};

    // See comment for `code` above
    if (isValidElement(children?.props?.children)) {
      return children?.props.children;
    }

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
