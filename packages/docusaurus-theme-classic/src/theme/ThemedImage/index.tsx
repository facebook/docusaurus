/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps} from 'react';
import clsx from 'clsx';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';

export type Props = {
  readonly sources: {
    readonly light: string;
    readonly dark: string;
  };
} & Omit<ComponentProps<'img'>, 'src'>;

import styles from './styles.module.css';

const ThemedImage = (props: Props): JSX.Element => {
  const {isClient} = useDocusaurusContext();
  const {isDarkTheme} = useThemeContext();
  const {sources, className, alt = '', ...propsRest} = props;

  type SourceName = keyof Props['sources'];

  const renderedSourceNames: SourceName[] = isClient
    ? isDarkTheme
      ? ['dark']
      : ['light']
    : // We need to render both images on the server to avoid flash
      // See https://github.com/facebook/docusaurus/pull/3730
      ['light', 'dark'];

  return (
    <>
      {renderedSourceNames.map((sourceName) => (
        <img
          key={sourceName}
          src={sources[sourceName]}
          alt={alt}
          className={clsx(
            styles.themedImage,
            styles[`themedImage--${sourceName}`],
            className,
          )}
          {...propsRest}
        />
      ))}
    </>
  );
};

export default ThemedImage;
