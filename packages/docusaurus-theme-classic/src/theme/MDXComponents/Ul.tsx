/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/MDXComponents/Ul';

import styles from './Ul.module.css';

const containsClassListLocalClass = styles['contains-task-list'];

export default function MDXUl(props: Props): JSX.Element {
  return (
    <ul
      {...props}
      className={clsx(
        props.className,
        props.className?.includes('contains-task-list') &&
          containsClassListLocalClass,
      )}
    />
  );
}
