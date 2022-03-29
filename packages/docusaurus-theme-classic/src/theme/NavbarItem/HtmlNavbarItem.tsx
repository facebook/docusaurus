/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';

import type {Props} from '@theme/NavbarItem/HtmlNavbarItem';

export default function HtmlNavbarItem({
  value,
  className,
  mobile = false,
  isDropdownItem = false,
}: Props): JSX.Element {
  const Comp = isDropdownItem ? 'li' : 'div';
  return (
    <Comp
      className={
        clsx(
          !mobile && !isDropdownItem && 'navbar__item',
          mobile && 'menu__list-item',
          className,
        ) || undefined
      }
      dangerouslySetInnerHTML={{__html: value}}
    />
  );
}
