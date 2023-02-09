/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useColorMode} from '@docusaurus/theme-common';
import type {Props} from '@theme/ThemedImage';

import styles from './styles.module.css';

export default function ThemedImage(props: Props): JSX.Element {
  const isBrowser = useIsBrowser();
  const {colorMode} = useColorMode();
  const {sources, className, alt, ...propsRest} = props;

  type SourceName = keyof Props['sources'];

  const clientThemes: SourceName[] =
    colorMode === 'dark' ? ['dark'] : ['light'];

  const renderedSourceNames: SourceName[] = isBrowser
    ? clientThemes
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
}
