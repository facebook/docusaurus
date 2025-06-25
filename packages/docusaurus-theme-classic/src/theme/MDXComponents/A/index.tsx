/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import type {Props} from '@theme/MDXComponents/A';
import styles from './styles.module.css';

function isFootnoteRef(props: Props) {
  return props['data-footnote-ref'] === true;
}

function FootnoteRefLink(props: Props) {
  const {
    navbar: {hideOnScroll},
  } = useThemeConfig();
  return (
    <Link
      {...props}
      className={clsx(
        hideOnScroll
          ? styles.footnoteRefHideOnScrollNavbar
          : styles.footnoteRefStickyNavbar,

        props.className,
      )}
    />
  );
}

export default function MDXA(props: Props): ReactNode {
  if (isFootnoteRef(props)) {
    return <FootnoteRefLink {...props} />;
  }
  return <Link {...props} />;
}
