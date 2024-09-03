/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Container from '@theme/CodeBlock/Container';
import type {Props} from '@theme/CodeBlock/Content/Element';

import styles from './styles.module.css';

// <pre> tags in markdown map to CodeBlocks. They may contain JSX children. When
// the children is not a simple string, we just return a styled block without
// actually highlighting.
export default function CodeBlockJSX({
  children,
  className,
}: Props): JSX.Element {
  return (
    <Container
      as="pre"
      tabIndex={0}
      className={clsx(styles.codeBlockStandalone, 'thin-scrollbar', className)}>
      <code className={styles.codeBlockLines}>{children}</code>
    </Container>
  );
}
