/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps} from 'react';
import Toggle from 'react-toggle';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import clsx from 'clsx';
import styles from './styles.module.css';

import {DEFAULT_COLOR_MODE_CONFIG} from '../../themeConfigSchema.js';

const Dark = ({icon, style}) => (
  <span className={clsx(styles.toggle, styles.dark)} style={style}>
    {icon}
  </span>
);
const Light = ({icon, style}) => (
  <span className={clsx(styles.toggle, styles.light)} style={style}>
    {icon}
  </span>
);

export default function (props: ComponentProps<typeof Toggle>): JSX.Element {
  const {isClient, siteConfig = {}} = useDocusaurusContext();

  const {
    switchConfig: {
      darkIcon: defaultDarkIcon,
      darkIconStyle: defaultDarkIconStyle,
      lightIcon: defaultLightIcon,
      lightIconStyle: defaultLightIconStyle,
    },
  } = DEFAULT_COLOR_MODE_CONFIG;
  const {
    themeConfig: {
      colorMode: {
        switchConfig: {
          darkIcon = defaultDarkIcon,
          darkIconStyle = defaultDarkIconStyle,
          lightIcon = defaultLightIcon,
          lightIconStyle = defaultLightIconStyle,
        } = DEFAULT_COLOR_MODE_CONFIG.switchConfig,
      } = DEFAULT_COLOR_MODE_CONFIG,
    },
  } = siteConfig;
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
