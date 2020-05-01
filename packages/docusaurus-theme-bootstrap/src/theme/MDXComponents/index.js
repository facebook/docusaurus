/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import {Table} from 'reactstrap';

export default {
  code: (props) => {
    const {children} = props;
    if (typeof children === 'string') {
      return <CodeBlock {...props} />;
    }
    return children;
  },
  table: Table,
  blockquote: (props) => <blockquote className="blockquote-footer">{props.children}</blockquote>,
  strong: (props) => <div className="font-weight-bolder" {...props}/>,
  em: (props) => <div className="font-italic" {...props}/>,
  p: (props) => <div className="font-weight-light" {...props}/>,
};
