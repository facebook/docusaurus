/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';

// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children: ReactNode): {
  mdxAdmonitionTitle: ReactNode | undefined;
  rest: ReactNode;
} {
  const items = React.Children.toArray(children);
  const mdxAdmonitionTitle = items.find(
    (item) =>
      React.isValidElement(item) &&
      (item.props as {mdxType: string} | null)?.mdxType ===
        'mdxAdmonitionTitle',
  ) as JSX.Element | undefined;
  const rest = <>{items.filter((item) => item !== mdxAdmonitionTitle)}</>;
  return {
    mdxAdmonitionTitle: mdxAdmonitionTitle?.props.children,
    rest,
  };
}

export function processAdmonitionProps<
  Props extends {readonly children: ReactNode; readonly title?: ReactNode},
>(props: Props): Props {
  const {mdxAdmonitionTitle, rest} = extractMDXAdmonitionTitle(props.children);
  const title = props.title ?? mdxAdmonitionTitle;
  return {
    ...props,
    // Do not return "title: undefined" prop
    // this might create unwanted props overrides when merging props
    // For example: {...default,...props}
    ...(title && {title}),
    children: rest,
  };
}
