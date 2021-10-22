/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/Logo';

import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';

const Logo = (props: Props): JSX.Element => {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo = {src: {uri: ''}}},
  } = useThemeConfig();

  const {imageClassName, titleClassName, ...propsRest} = props;
  const logoLink = useBaseUrl(logo.href || '/');
  const sources = {
    light: useBaseUrl(logo.src.uri),
    dark: useBaseUrl(logo.srcDark?.uri || logo.src.uri),
  };
  const widths = {
    light: logo.src.width || '100%',
    dark: logo.src.width || logo.src.width || '100%',
  };

  const heights = {
    light: logo.src.height || '100%',
    dark: logo.src.height || logo.src.height || '100%',
  };
  const themedImage = (
    <ThemedImage
      sources={sources}
      heights={heights}
      widths={widths}
      alt={logo.alt || navbarTitle || title}
    />
  );

  return (
    <Link
      to={logoLink}
      {...propsRest}
      {...(logo.target && {target: logo.target})}>
      {logo.src &&
        (imageClassName ? (
          <div className={imageClassName}>{themedImage}</div>
        ) : (
          <>{themedImage}</>
        ))}
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
};

export default Logo;
