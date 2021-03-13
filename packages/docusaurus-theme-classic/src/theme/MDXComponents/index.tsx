/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps} from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';

export type MDXComponentsObject = {
  readonly code: typeof CodeBlock;
  readonly a: (props: ComponentProps<'a'>) => JSX.Element;
  readonly pre: typeof CodeBlock;
  readonly h1: (props: ComponentProps<'h1'>) => JSX.Element;
  readonly h2: (props: ComponentProps<'h2'>) => JSX.Element;
  readonly h3: (props: ComponentProps<'h3'>) => JSX.Element;
  readonly h4: (props: ComponentProps<'h4'>) => JSX.Element;
  readonly h5: (props: ComponentProps<'h5'>) => JSX.Element;
  readonly h6: (props: ComponentProps<'h6'>) => JSX.Element;
};

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
    return <CodeBlock {...children?.props} />;
  },
  h1: Heading('h1'),
  h2: Heading('h2'),
  h3: Heading('h3'),
  h4: Heading('h4'),
  h5: Heading('h5'),
  h6: Heading('h6'),
};

export default MDXComponents;
