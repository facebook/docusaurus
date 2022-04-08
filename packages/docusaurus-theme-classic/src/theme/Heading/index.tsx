/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Heading';
import {translate} from '@docusaurus/Translate';
import {useThemeConfig} from '@docusaurus/theme-common';

import styles from './styles.module.css';

function AnchorHeading({as: As, id, ...props}: Props) {
  const {
    navbar: {hideOnScroll},
  } = useThemeConfig();

  if (!id) {
    return <As {...props} />;
  }

  return (
    <As
      {...props}
      className={clsx(
        'anchor',
        hideOnScroll
          ? styles.anchorWithHideOnScrollNavbar
          : styles.anchorWithStickyNavbar,
      )}
      id={id}>
      {props.children}
      <a
        className="hash-link"
        href={`#${id}`}
        title={translate({
          id: 'theme.common.headingLinkTitle',
          message: 'Direct link to heading',
          description: 'Title for link to heading',
        })}>
        &#8203;
      </a>
    </As>
  );
}

export default function Heading({as, ...props}: Props): JSX.Element {
  if (as === 'h1') {
    return (
      <h1
        {...props}
        id={undefined} // h1 headings do not need an id because they don't appear in the TOC
      >
        {props.children}
      </h1>
    );
  }
  return <AnchorHeading as={as} {...props} />;
}
