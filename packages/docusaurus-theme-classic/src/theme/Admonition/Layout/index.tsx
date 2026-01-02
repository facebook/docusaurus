/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';

import type {Props} from '@theme/Admonition/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

function AdmonitionContainer({
  type,
  className,
  children,
  ...optional
}: Pick<Props, 'type' | 'className' | 'id'> & {children: ReactNode}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        styles.admonition,
        className,
      )}
      {...optional}>
      {children}
    </div>
  );
}

function AdmonitionHeading({
  icon,
  title,
  id,
}: Pick<Props, 'icon' | 'title' | 'id'>) {
  return (
    <div className={styles.admonitionHeading}>
      <span className={styles.admonitionIcon}>{icon}</span>
      {id ? (
        <Heading as="h5" id={id} className={styles.admonitionHeadingLink}>
          {title}
        </Heading>
      ) : (
        title
      )}
    </div>
  );
}

function AdmonitionContent({children}: Pick<Props, 'children'>) {
  return children ? (
    <div className={styles.admonitionContent}>{children}</div>
  ) : null;
}

export default function AdmonitionLayout(props: Props): ReactNode {
  const {type, icon, title, children, className, id, ...optional} = props;
  const hasHeading = !!(title || icon);
  return (
    <AdmonitionContainer
      type={type}
      className={className}
      id={hasHeading ? undefined : id}
      {...optional}>
      {hasHeading ? (
        <AdmonitionHeading title={title} icon={icon} id={id} />
      ) : null}
      <AdmonitionContent>{children}</AdmonitionContent>
    </AdmonitionContainer>
  );
}
