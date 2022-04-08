/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactElement, type ComponentProps} from 'react';
import Head from '@docusaurus/Head';
import type {Props} from '@theme/MDXComponents/Head';

// MDX elements are wrapped through the MDX pragma. In some cases (notably usage
// with Head/Helmet) we need to unwrap those elements.
function unwrapMDXElement(element: ReactElement) {
  if (element?.props?.mdxType && element?.props?.originalType) {
    const {mdxType, originalType, ...newProps} = element.props;
    return React.createElement(element.props.originalType, newProps);
  }
  return element;
}

export default function MDXHead(props: Props): JSX.Element {
  const unwrappedChildren = React.Children.map(props.children, (child) =>
    unwrapMDXElement(child as ReactElement),
  );
  return (
    <Head {...(props as ComponentProps<typeof Head>)}>{unwrappedChildren}</Head>
  );
}
