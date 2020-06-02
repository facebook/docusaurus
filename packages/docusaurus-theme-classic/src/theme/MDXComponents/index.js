/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import {MDXProvider} from '@mdx-js/react';
import styles from './styles.module.css';

const InlineCodeBlock = (props) => <code {...props} />;

// On some elements, <code> should not wire the prism JS editor
// instead we should use a regular inline code block
// context: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/pull/233#issuecomment-636998272
const InlineCodeBlockProvider = ({children}) => (
  <MDXProvider components={{code: InlineCodeBlock}}>{children}</MDXProvider>
);

export default {
  code: (props) => {
    const {children} = props;
    if (typeof children === 'string') {
      return <CodeBlock {...props} />;
    }
    return children;
  },
  summary: (props) => (
    <InlineCodeBlockProvider>
      <summary {...props} />
    </InlineCodeBlockProvider>
  ),
  a: (props) => {
    if (/\.[^./]+$/.test(props.href)) {
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a {...props} />;
    }
    return <Link {...props} />;
  },
  pre: (props) => <div className={styles.mdxCodeBlock} {...props} />,
  h1: Heading('h1'),
  h2: Heading('h2'),
  h3: Heading('h3'),
  h4: Heading('h4'),
  h5: Heading('h5'),
  h6: Heading('h6'),
};
