/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';
import type {Props} from '@theme/ThemedImage';

const ThemedImage = (props: Props): JSX.Element => {
  const {isClient} = useDocusaurusContext();
  const {isDarkTheme} = useThemeContext();
  const {sources, src, className, alt = '', ...propsRest} = props;

  if (isClient) {
    const finalSrc = sources
      ? isDarkTheme
        ? sources.dark
        : sources.light
      : src;
    return (
      <img
        src={finalSrc}
        alt={alt}
        className={clsx(
          'themedImage',
          sources
            ? {
                themedImageLight: !isDarkTheme,
                themedImageDark: isDarkTheme,
              }
            : null,
          className,
        )}
        {...propsRest}
      />
    );
  } else {
    return sources ? (
      <>
        <img
          src={sources.light}
          alt={alt}
          className={clsx('themedImageSSR', 'themedImageLight', className)}
          {...propsRest}
        />
        <img
          src={sources.dark}
          alt={alt}
          className={clsx('themedImageSSR', 'themedImageDark', className)}
          {...propsRest}
        />
      </>
    ) : (
      <img
        src={src}
        alt={alt}
        className={clsx('themedImageSSR', className)}
        {...propsRest}
      />
    );
  }
};

export default ThemedImage;
