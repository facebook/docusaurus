/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ComponentProps, type ReactElement} from 'react';
import Details from '@theme/Details';
import type {Props} from '@theme/MDXComponents/Details';

export default function MDXDetails(props: Props): JSX.Element {
  const items = React.Children.toArray(props.children) as ReactElement[];
  // Split summary item from the rest to pass it as a separate prop to the
  // Details theme component
  const summary: ReactElement<ComponentProps<'summary'>> = items.find(
    (item) => item?.props?.mdxType === 'summary',
  )!;
  const children = <>{items.filter((item) => item !== summary)}</>;

  return (
    <Details {...props} summary={summary}>
      {children}
    </Details>
  );
}
