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

const Dark = ({style}) => (
  <span className={clsx(styles.toggle, styles.dark)} style={style} />
);
const Light = ({style}) => (
  <span className={clsx(styles.toggle, styles.light)} style={style} />
);

export default function (props: ComponentProps<typeof Toggle>): JSX.Element {
  const {isClient, siteConfig = {}} = useDocusaurusContext();

  const {
    themeConfig: {
      switchConfig: {darkIconStyle, lightIconStyle},
    },
  } = siteConfig;
  return (
    <Toggle
      disabled={!isClient}
      icons={{
        checked: <Dark style={darkIconStyle} />,
        unchecked: <Light style={lightIconStyle} />,
      }}
      {...props}
    />
  );
}
