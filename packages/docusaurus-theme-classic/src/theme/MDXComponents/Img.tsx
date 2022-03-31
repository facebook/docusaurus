/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/MDXComponents/Img';
import styles from './Img.module.css';
import clsx from 'clsx';

function transformImgClassName(className?: string): string {
  return clsx(className, styles.img);
}

export default function MDXImg(props: Props): JSX.Element {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      loading="lazy"
      {...props}
      className={transformImgClassName(props.className)}
    />
  );
}
