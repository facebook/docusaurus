/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {CSSProperties} from 'react';
import Toggle from 'react-toggle';
import type {Props} from '@theme/Toggle';
import {useThemeConfig} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import clsx from 'clsx';
import styles from './styles.module.css';

interface IconProps {
  icon: string;
  style: CSSProperties;
}

const Dark = ({icon, style}: IconProps): JSX.Element => (
  <span className={clsx(styles.toggle, styles.dark)} style={style}>
    {icon}
  </span>
);
const Light = ({icon, style}: IconProps): JSX.Element => (
  <span className={clsx(styles.toggle, styles.light)} style={style}>
    {icon}
  </span>
);

export default function (props: Props): JSX.Element {
  const {
    colorMode: {
      switchConfig: {darkIcon, darkIconStyle, lightIcon, lightIconStyle},
    },
  } = useThemeConfig();
  const {isClient} = useDocusaurusContext();

  return (
    <Toggle
      disabled={!isClient}
      icons={{
        checked: <Dark icon={darkIcon} style={darkIconStyle} />,
        unchecked: <Light icon={lightIcon} style={lightIconStyle} />,
      }}
      {...props}
    />
  );
}
