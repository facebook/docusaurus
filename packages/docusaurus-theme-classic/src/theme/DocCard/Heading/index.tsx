/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Heading from '@theme/Heading';
import type {Props} from '@theme/DocCard/Heading';

import styles from './styles.module.css';

export default function DocCardHeading({title, icon}: Props): ReactNode {
  return (
    <Heading
      as="h2"
      className={clsx(
        'text--truncate',
        ThemeClassNames.docs.docCard.heading,
        styles.cardTitle,
      )}
      title={title}>
      {icon && (
        <span
          className={clsx(
            ThemeClassNames.docs.docCard.icon,
            styles.cardTitleIcon,
          )}>
          {icon}
        </span>
      )}
      <span
        className={clsx(
          ThemeClassNames.docs.docCard.title,
          styles.cardTitleText,
        )}>
        {title}
      </span>
    </Heading>
  );
}
