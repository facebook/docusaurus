/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ComponentProps} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './styles.module.css';

export default function CodeBlockContainer<T extends 'div' | 'pre'>({
  as: As,
  ...props
}: {as: T} & ComponentProps<T>): JSX.Element {
  return (
    <As
      // Polymorphic components are hard to type, without `oneOf` generics
      {...(props as never)}
      className={clsx(
        props.className,
        styles.codeBlockContainer,
        ThemeClassNames.common.codeBlock,
      )}
    />
  );
}
