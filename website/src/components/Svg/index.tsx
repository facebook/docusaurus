/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, type ComponentProps} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface SvgIconProps extends ComponentProps<'svg'> {
  viewBox?: string;
  size?: 'inherit' | 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  svgClass?: string; // Class attribute on the child
  colorAttr?: string; // Applies a color attribute to the SVG element.
  children: ReactNode; // Node passed into the SVG element.
}

export default function Svg(props: SvgIconProps): JSX.Element {
  const {
    svgClass,
    colorAttr,
    children,
    color = 'inherit',
    size = 'medium',
    viewBox = '0 0 24 24',
    ...rest
  } = props;

  return (
    <svg
      viewBox={viewBox}
      color={colorAttr}
      aria-hidden
      className={clsx(styles.svgIcon, styles[color], styles[size], svgClass)}
      {...rest}>
      {children}
    </svg>
  );
}
