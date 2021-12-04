/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/Icon/ExternalLink';
import IconExternalLinkBase from './icon.svg';

import styles from './styles.module.css';
import clsx from 'clsx';

export default function IconExternalLink({
  className,
  ...restProps
}: Props): JSX.Element {
  return (
    <IconExternalLinkBase
      className={clsx(styles.iconExternalLink, className)}
      {...restProps}
    />
  );
}
