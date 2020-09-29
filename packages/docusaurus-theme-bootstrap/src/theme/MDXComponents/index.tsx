/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';
import CodeBlock from '@theme/CodeBlock';
import {Table} from 'reactstrap';

const Heading = (tag: string): ReactNode => {
  return function (props) {
    return React.createElement(tag, {className: `${tag} my-3`, ...props});
  };
};

export default {
  h1: Heading('h1'),
  h2: Heading('h2'),
  h3: Heading('h3'),
  h4: Heading('h4'),
  h5: Heading('h5'),
  h6: Heading('h6'),
  code: (props) => {
    const {children} = props;
    if (typeof children === 'string') {
      return <CodeBlock {...props} />;
    }
    return children;
  },
  table: Table,
  blockquote: (props) => (
    <blockquote className="blockquote-footer">{props.children}</blockquote>
  ),
  p: (props) => <div className="font-weight-light">{props.children}</div>,
};
