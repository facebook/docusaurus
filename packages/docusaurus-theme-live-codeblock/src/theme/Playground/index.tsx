/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import PlaygroundProvider from '@theme/Playground/Provider';
import PlaygroundContainer from '@theme/Playground/Container';
import PlaygroundLayout from '@theme/Playground/Layout';

import type {Props} from '@theme/Playground';

export default function Playground({
  children,
  transformCode,
  ...props
}: Props): ReactNode {
  return (
    <PlaygroundContainer>
      <PlaygroundProvider code={children} {...props}>
        <PlaygroundLayout />
      </PlaygroundProvider>
    </PlaygroundContainer>
  );
}
