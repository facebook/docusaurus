/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface SvgIconProps extends React.ComponentProps<'svg'> {
  viewBox?: string;
  size?: 'inherit' | 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  svgClass?: string; // Class attribute on the child
  colorAttr?: string; // Applies a color attribute to the SVG element.
  children: React.ReactElement; // Node passed into the SVG element.
}

export default function Svg(props: SvgIconProps) {
  const {
    svgClass,
    colorAttr,
    children,
    color = 'inherit',
    size = 'medium',
    viewBox = '0 0 24 24',
    ...rest
  } = props;

  let svgIconSize: string;
  let svgIconColor: string;

  switch (size) {
    case 'small':
      svgIconSize = styles.svgIconSmall;
      break;
    case 'inherit':
      svgIconSize = styles.svgIconInherit;
      break;
    case 'large':
      svgIconSize = styles.svgIconLarge;
      break;
    case 'medium':
      svgIconSize = styles.svgIconMedium;
      break;
    default:
      svgIconSize = '';
      break;
  }

  switch (color) {
    case 'primary':
      svgIconColor = styles.svgIconPrimary;
      break;
    case 'secondary':
      svgIconColor = styles.svgIconSecondary;
      break;
    case 'success':
      svgIconColor = styles.svgIconSuccess;
      break;
    case 'error':
      svgIconColor = styles.svgIconError;
      break;
    case 'warning':
      svgIconColor = styles.svgIconWarning;
      break;
    case 'inherit':
      svgIconColor = styles.svgIconColor;
      break;
    default:
      svgIconColor = '';
      break;
  }

  return (
    <svg
      viewBox={viewBox}
      color={colorAttr}
      aria-hidden={true}
      className={clsx(styles.svgIcon, svgIconColor, svgIconSize, svgClass)}
      {...rest}>
      {children}
    </svg>
  );
}
